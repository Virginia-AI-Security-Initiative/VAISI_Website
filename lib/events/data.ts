import "server-only";

import {
  getAllPublicEvents,
  getWebsiteEventSettings,
  isAirtableConfigured,
} from "@/lib/rsvp/airtable";
import { staticEvents } from "@/lib/events/static-events";
import type { WebsiteEvent } from "@/lib/events/types";

export async function getWebsiteEvents(options?: { includeHidden?: boolean }) {
  const [airtableEvents, settings] = isAirtableConfigured()
    ? await Promise.all([getAllPublicEvents(), getWebsiteEventSettings()])
    : [[], []];
  const settingsBySlug = new Map(settings.map((setting) => [setting.slug, setting]));

  const websiteEvents = staticEvents.map((event) => {
    const setting = settingsBySlug.get(event.slug);
    if (!setting) return event;
    return {
      ...event,
      title: setting.title ?? event.title,
      description: setting.description ?? event.description,
      location: setting.location ?? event.location,
      start: setting.start ?? event.start,
      end: setting.end ?? event.end,
      dateLabel: setting.start || setting.end ? undefined : event.dateLabel,
      imageSrc: setting.flyerRemoved ? undefined : (setting.imageSrc ?? event.imageSrc),
      visible: setting.visible,
    };
  });

  const staticBySlug = new Map(websiteEvents.map((event) => [event.slug, event]));
  const managedEvents: WebsiteEvent[] = airtableEvents
    .filter((event) => event.status !== "Cancelled")
    .map((event) => {
      const staticFallback = staticBySlug.get(event.slug);
      return {
        id: event.id,
        source: "airtable",
        title: event.name,
        slug: event.slug,
        description: event.description,
        location: event.location,
        start: event.start,
        end: event.end,
        imageSrc: event.flyerRemoved ? undefined : (event.imageSrc ?? staticFallback?.imageSrc),
        photos: staticFallback?.photos,
        links: [{ label: "RSVP", url: `/events/${event.slug}`, emphasis: "primary" }],
        visible: event.visible ?? true,
      };
    });

  const managedSlugs = new Set(managedEvents.map((event) => event.slug));
  return [...managedEvents, ...websiteEvents.filter((event) => !managedSlugs.has(event.slug))]
    .filter((event) => options?.includeHidden || event.visible)
    .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
}

export function partitionWebsiteEvents(events: WebsiteEvent[]) {
  const now = Date.now();
  return {
    upcoming: events.filter((event) => new Date(event.end).getTime() >= now),
    past: events
      .filter((event) => new Date(event.end).getTime() < now)
      .sort((a, b) => new Date(b.start).getTime() - new Date(a.start).getTime()),
  };
}
