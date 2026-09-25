"use server";

import { revalidatePath, updateTag } from "next/cache";
import { WEBSITE_EVENTS_CACHE_TAG } from "@/lib/events/data";
import { requireEventCreatorSession } from "@/lib/eventcreator/auth";
import { eventSlug } from "@/lib/rsvp/config";
import {
  createManagedEvent,
  deleteWebsiteEventFlyer,
  setManagedEventFlyer,
  setManagedEventVisibility,
  updateManagedEvent,
  updateWebsiteEventSetting,
  uploadManagedEventFlyer,
  uploadWebsiteEventFlyer,
} from "@/lib/rsvp/airtable";

export type EventCreatorResult = { ok: boolean; message: string };

const allowedFlyerTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

function requiredText(formData: FormData, name: string, label: string, maxLength: number) {
  const value = String(formData.get(name) ?? "").trim();
  if (!value) throw new Error(`${label} is required.`);
  if (value.length > maxLength) throw new Error(`${label} is too long.`);
  return value;
}

function easternLocalToIso(value: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/.exec(value);
  if (!match) throw new Error("Use a valid date and time.");
  const [, year, month, day, hour, minute] = match.map(Number);
  const wallTime = Date.UTC(year, month - 1, day, hour, minute);
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23",
  });
  const parts = Object.fromEntries(formatter.formatToParts(new Date(wallTime)).map((part) => [part.type, part.value]));
  const represented = Date.UTC(Number(parts.year), Number(parts.month) - 1, Number(parts.day), Number(parts.hour), Number(parts.minute), Number(parts.second));
  return new Date(wallTime - (represented - wallTime)).toISOString();
}

function eventInput(formData: FormData) {
  const start = easternLocalToIso(requiredText(formData, "start", "Start time", 20));
  const end = easternLocalToIso(requiredText(formData, "end", "End time", 20));
  if (new Date(end).getTime() <= new Date(start).getTime()) throw new Error("End time must be after start time.");
  return {
    name: requiredText(formData, "name", "Event name", 160),
    description: requiredText(formData, "description", "Event description", 4000),
    location: requiredText(formData, "location", "Location", 300),
    start,
    end,
  };
}

function validatedFlyer(formData: FormData) {
  const file = formData.get("flyer");
  if (!(file instanceof File) || file.size === 0) return null;
  if (file.size > 5 * 1024 * 1024) throw new Error("Flyers must be 5 MB or smaller.");
  if (!allowedFlyerTypes.has(file.type)) throw new Error("Use a JPG, PNG, WebP, or GIF flyer.");
  return file;
}

function refreshEvents() {
  updateTag(WEBSITE_EVENTS_CACHE_TAG);
  revalidatePath("/events");
  revalidatePath("/events/[slug]", "page");
  revalidatePath("/eventcreator");
}

function failure(error: unknown): EventCreatorResult {
  return { ok: false, message: error instanceof Error ? error.message : "The event action failed." };
}

export async function createPortalEvent(formData: FormData): Promise<EventCreatorResult> {
  try {
    await requireEventCreatorSession();
    const input = eventInput(formData);
    const slug = eventSlug(input.name);
    if (!slug) throw new Error("Event name must contain letters or numbers.");
    const file = validatedFlyer(formData);
    const created = await createManagedEvent(input);
    let flyerWarning = "";
    if (file) {
      try {
        await uploadManagedEventFlyer(created.eventId, file);
      } catch {
        flyerWarning = " The event was created, but the flyer upload failed; you can retry it below.";
      }
    }
    refreshEvents();
    return { ok: true, message: `Created ${input.name}. RSVP: /events/${created.slug}.${flyerWarning}` };
  } catch (error) {
    return failure(error);
  }
}

export async function updatePortalEvent(formData: FormData): Promise<EventCreatorResult> {
  try {
    await requireEventCreatorSession();
    const source = requiredText(formData, "source", "Source", 20);
    const id = requiredText(formData, "eventId", "Event", 100);
    const oldSlug = requiredText(formData, "oldSlug", "Event slug", 100);
    const input = eventInput(formData);
    const requestedSlug = eventSlug(input.name);
    if (!requestedSlug) throw new Error("Event name must contain letters or numbers.");
    const file = validatedFlyer(formData);

    if (source === "airtable") {
      await updateManagedEvent(id, input);
      if (file) await uploadManagedEventFlyer(id, file);
    } else if (source === "website") {
      await updateWebsiteEventSetting(oldSlug, {
        visible: formData.get("visible") !== "false",
        title: input.name,
        description: input.description,
        location: input.location,
        start: input.start,
        end: input.end,
        ...(file ? { flyerRemoved: false } : {}),
      });
      if (file) await uploadWebsiteEventFlyer(oldSlug, file);
    } else {
      throw new Error("Unknown event source.");
    }

    refreshEvents();
    return { ok: true, message: `Updated ${input.name}.` };
  } catch (error) {
    return failure(error);
  }
}

export async function togglePortalEvent(formData: FormData): Promise<EventCreatorResult> {
  try {
    await requireEventCreatorSession();
    const slug = requiredText(formData, "slug", "Event slug", 100);
    const source = requiredText(formData, "source", "Source", 20);
    const airtableEventId = String(formData.get("airtableEventId") ?? "").trim();
    const visible = String(formData.get("visible")) === "true";
    if (source === "airtable") {
      if (!airtableEventId) throw new Error("Airtable event ID is missing.");
      await setManagedEventVisibility(airtableEventId, visible);
    } else if (source === "website") {
      await updateWebsiteEventSetting(slug, { visible });
    } else {
      throw new Error("Unknown event source.");
    }
    refreshEvents();
    return { ok: true, message: visible ? "Event is visible." : "Event is hidden." };
  } catch (error) {
    return failure(error);
  }
}

export async function deletePortalFlyer(formData: FormData): Promise<EventCreatorResult> {
  try {
    await requireEventCreatorSession();
    const slug = requiredText(formData, "slug", "Event slug", 100);
    const source = requiredText(formData, "source", "Source", 20);
    const id = requiredText(formData, "eventId", "Event", 100);
    if (source === "airtable") {
      await setManagedEventFlyer(id, null);
    } else if (source === "website") {
      await deleteWebsiteEventFlyer(slug);
    } else {
      throw new Error("Unknown event source.");
    }
    refreshEvents();
    return { ok: true, message: "Flyer removed." };
  } catch (error) {
    return failure(error);
  }
}
