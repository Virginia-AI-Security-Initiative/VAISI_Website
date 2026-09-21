import "server-only";

import {
  AIRTABLE_BASE_ID,
  AIRTABLE_FIELDS,
  AIRTABLE_TABLES,
  eventSlug,
} from "@/lib/rsvp/config";

type AirtableRecord = {
  id: string;
  fields: Record<string, unknown>;
};

type AirtableListResponse = {
  records: AirtableRecord[];
  offset?: string;
};

export interface PublicEvent {
  id: string;
  name: string;
  slug: string;
  description: string;
  location: string;
  start: string;
  end: string;
  status?: "Upcoming" | "Past" | "Cancelled";
  imageSrc?: string;
  visible?: boolean;
  flyerRemoved?: boolean;
}

export interface WebsiteEventSetting {
  id: string;
  slug: string;
  visible: boolean;
  title?: string;
  description?: string;
  location?: string;
  start?: string;
  end?: string;
  imageSrc?: string;
  flyerRemoved: boolean;
}

export interface RsvpSubmission {
  eventId: string;
  name: string;
  email: string;
  academicStatus: string;
  majorMinor: string;
  referral: string;
}

const EVENT_FALLBACKS: Record<string, PublicEvent> = {
  "are-we-in-control": {
    id: "recIE5RJczAjvc1YC",
    name: "Are We in Control?",
    slug: "are-we-in-control",
    description:
      "Come discuss the recent HuggingFace incident, in which OpenAI agents escaped internal environments, coordinated agent swarms of over 700 agents, and hacked external companies. Pizza will be provided.",
    location: "Nau Hall 211",
    start: "2026-09-23T22:30:00.000Z",
    end: "2026-09-23T23:30:00.000Z",
  },
};

function getApiKey() {
  const rawKey = process.env.airtable_api ?? process.env.AIRTABLE_API_KEY;
  if (!rawKey) throw new Error("Airtable is not configured");

  let key = rawKey.trim();
  if (
    (key.startsWith('"') && key.endsWith('"')) ||
    (key.startsWith("'") && key.endsWith("'"))
  ) {
    key = key.slice(1, -1).trim();
  }
  key = key.replace(/^Bearer\s+/i, "").trim();

  if (!key) throw new Error("Airtable is not configured");
  return key;
}

export function isAirtableConfigured() {
  return Boolean(process.env.airtable_api?.trim() || process.env.AIRTABLE_API_KEY?.trim());
}

async function airtableFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${getApiKey()}`,
      "Content-Type": "application/json",
      ...init?.headers,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const detail = await response.text();
    console.error("Airtable request failed", response.status, detail);
    throw new Error("Airtable request failed");
  }

  return response.json() as Promise<T>;
}

async function listPublicEvents() {
  const records: AirtableRecord[] = [];
  let offset: string | undefined;

  do {
    const params = new URLSearchParams({ pageSize: "100" });
    if (offset) params.set("offset", offset);
    const page = await airtableFetch<AirtableListResponse>(
      `${AIRTABLE_TABLES.publicEvents}?${params}`,
    );
    records.push(...page.records);
    offset = page.offset;
  } while (offset);

  return records;
}

function stringField(fields: Record<string, unknown>, id: string, name: string) {
  const value = fields[id] ?? fields[name];
  return typeof value === "string" ? value : "";
}

function arrayField(fields: Record<string, unknown>, id: string, name: string) {
  const value = fields[id] ?? fields[name];
  return Array.isArray(value) ? value : [];
}

function selectName<T extends string>(value: unknown): T | undefined {
  if (typeof value === "string") return value as T;
  if (value && typeof value === "object" && "name" in value) {
    return String((value as { name: unknown }).name) as T;
  }
}

function attachmentUrl(value: unknown) {
  if (!Array.isArray(value)) return undefined;
  const first = value[0];
  if (!first || typeof first !== "object" || !("url" in first)) return undefined;
  return typeof first.url === "string" ? first.url : undefined;
}

function checkboxField(fields: Record<string, unknown>, id: string, name: string) {
  return (fields[id] ?? fields[name]) === true;
}

async function getCalendarRecord(id: string) {
  return airtableFetch<AirtableRecord>(
    `${AIRTABLE_TABLES.internalCalendar}/${id}?returnFieldsByFieldId=true`,
  );
}

export async function getAllPublicEvents(): Promise<PublicEvent[]> {
  const records = await listPublicEvents();

  const events: Array<PublicEvent | null> = await Promise.all(records.map(async (event): Promise<PublicEvent | null> => {
    const name = stringField(event.fields, AIRTABLE_FIELDS.publicEvents.name, "Name");
    const calendarId = linkedRecordId(
      event.fields[AIRTABLE_FIELDS.publicEvents.internalCalendar] ?? event.fields["Internal Calendar"],
    );
    if (!name || !calendarId) return null;

    const calendar = await getCalendarRecord(calendarId);
    const start = stringField(calendar.fields, AIRTABLE_FIELDS.internalCalendar.start, "Start");
    const end = stringField(calendar.fields, AIRTABLE_FIELDS.internalCalendar.end, "End");
    if (!start || !end) return null;

    return {
      id: event.id,
      name,
      slug: eventSlug(name),
      description: stringField(event.fields, AIRTABLE_FIELDS.publicEvents.description, "Description"),
      location: stringField(event.fields, AIRTABLE_FIELDS.publicEvents.location, "Location"),
      start,
      end,
      status: selectName<NonNullable<PublicEvent["status"]>>(event.fields[AIRTABLE_FIELDS.publicEvents.status] ?? event.fields.Status),
      visible: selectName<string>(event.fields[AIRTABLE_FIELDS.publicEvents.websiteVisibility] ?? event.fields["Website Visibility"]) !== "Hidden",
      flyerRemoved: checkboxField(event.fields, AIRTABLE_FIELDS.publicEvents.websiteFlyerRemoved, "Website Flyer Removed"),
      imageSrc: attachmentUrl(
        calendar.fields[AIRTABLE_FIELDS.internalCalendar.flyer] ?? calendar.fields.Flyer,
      ),
    } satisfies PublicEvent;
  }));
  return events.filter((event): event is PublicEvent => event !== null);
}

function linkedRecordId(value: unknown) {
  if (!Array.isArray(value) || typeof value[0] !== "string") return null;
  return value[0];
}

export async function getPublicEventBySlug(slug: string): Promise<PublicEvent | null> {
  const fallback = EVENT_FALLBACKS[slug] ?? null;

  try {
    return (await getAllPublicEvents()).find((event) => event.slug === slug) ?? fallback;
  } catch (error) {
    if (!fallback) throw error;
    console.error("Using RSVP event fallback after Airtable lookup failed", {
      slug,
      error: error instanceof Error ? error.message : "Unknown error",
    });
    return fallback;
  }
}

export type ManagedEventInput = {
  name: string;
  description: string;
  location: string;
  start: string;
  end: string;
};

async function createRecords(table: string, fields: Record<string, unknown>) {
  const result = await airtableFetch<{ records: AirtableRecord[] }>(table, {
    method: "POST",
    body: JSON.stringify({ records: [{ fields }], typecast: false }),
  });
  return result.records[0];
}

async function updateRecord(table: string, id: string, fields: Record<string, unknown>) {
  return airtableFetch<{ records: AirtableRecord[] }>(table, {
    method: "PATCH",
    body: JSON.stringify({ records: [{ id, fields }], typecast: false }),
  });
}

export async function createManagedEvent(input: ManagedEventInput) {
  const existing = (await getAllPublicEvents()).find((event) => eventSlug(event.name) === eventSlug(input.name));
  if (existing) throw new Error("An event with this name already exists.");

  const calendar = await createRecords(AIRTABLE_TABLES.internalCalendar, {
    [AIRTABLE_FIELDS.internalCalendar.name]: input.name,
    [AIRTABLE_FIELDS.internalCalendar.start]: input.start,
    [AIRTABLE_FIELDS.internalCalendar.end]: input.end,
    [AIRTABLE_FIELDS.internalCalendar.notes]: input.description,
    [AIRTABLE_FIELDS.internalCalendar.public]: true,
  });

  let event: AirtableRecord | undefined;
  for (let attempt = 0; attempt < 10 && !event; attempt += 1) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    event = (await listPublicEvents()).find((record) =>
      arrayField(record.fields, AIRTABLE_FIELDS.publicEvents.internalCalendar, "Internal Calendar")
        .some((value) => value === calendar.id || (value && typeof value === "object" && "id" in value && value.id === calendar.id)),
    );
  }

  if (!event) {
    event = await createRecords(AIRTABLE_TABLES.publicEvents, {
      [AIRTABLE_FIELDS.publicEvents.name]: input.name,
      [AIRTABLE_FIELDS.publicEvents.location]: input.location,
      [AIRTABLE_FIELDS.publicEvents.description]: input.description,
      [AIRTABLE_FIELDS.publicEvents.status]: "Upcoming",
      [AIRTABLE_FIELDS.publicEvents.websiteVisibility]: "Visible",
      [AIRTABLE_FIELDS.publicEvents.internalCalendar]: [calendar.id],
    });
  }

  await updateRecord(AIRTABLE_TABLES.publicEvents, event.id, {
    [AIRTABLE_FIELDS.publicEvents.name]: input.name,
    [AIRTABLE_FIELDS.publicEvents.location]: input.location,
    [AIRTABLE_FIELDS.publicEvents.description]: input.description,
    [AIRTABLE_FIELDS.publicEvents.status]: "Upcoming",
    [AIRTABLE_FIELDS.publicEvents.websiteVisibility]: "Visible",
  });

  return { eventId: event.id, calendarId: calendar.id, slug: eventSlug(input.name) };
}

export async function updateManagedEvent(eventId: string, input: ManagedEventInput) {
  const collision = (await getAllPublicEvents()).find(
    (candidate) => candidate.id !== eventId && eventSlug(candidate.name) === eventSlug(input.name),
  );
  if (collision) throw new Error("Another event already uses this name.");
  const event = (await listPublicEvents()).find((record) => record.id === eventId);
  if (!event) throw new Error("Event not found in Airtable.");
  const calendarId = linkedRecordId(
    event.fields[AIRTABLE_FIELDS.publicEvents.internalCalendar] ?? event.fields["Internal Calendar"],
  );
  if (!calendarId) throw new Error("This event has no linked Internal Calendar record.");

  await updateRecord(AIRTABLE_TABLES.internalCalendar, calendarId, {
    [AIRTABLE_FIELDS.internalCalendar.name]: input.name,
    [AIRTABLE_FIELDS.internalCalendar.start]: input.start,
    [AIRTABLE_FIELDS.internalCalendar.end]: input.end,
    [AIRTABLE_FIELDS.internalCalendar.notes]: input.description,
  });
  await updateRecord(AIRTABLE_TABLES.publicEvents, eventId, {
    [AIRTABLE_FIELDS.publicEvents.name]: input.name,
    [AIRTABLE_FIELDS.publicEvents.location]: input.location,
    [AIRTABLE_FIELDS.publicEvents.description]: input.description,
    [AIRTABLE_FIELDS.publicEvents.status]: new Date(input.end).getTime() < Date.now() ? "Past" : "Upcoming",
  });
  return { eventId, calendarId, slug: eventSlug(input.name) };
}

export async function setManagedEventFlyer(eventId: string, flyerUrl: string | null) {
  const event = (await listPublicEvents()).find((record) => record.id === eventId);
  if (!event) throw new Error("Event not found in Airtable.");
  const calendarId = linkedRecordId(
    event.fields[AIRTABLE_FIELDS.publicEvents.internalCalendar] ?? event.fields["Internal Calendar"],
  );
  if (!calendarId) throw new Error("This event has no linked Internal Calendar record.");
  await updateRecord(AIRTABLE_TABLES.internalCalendar, calendarId, {
    [AIRTABLE_FIELDS.internalCalendar.flyer]: flyerUrl ? [{ url: flyerUrl }] : [],
  });
  await updateRecord(AIRTABLE_TABLES.publicEvents, eventId, {
    [AIRTABLE_FIELDS.publicEvents.websiteFlyerRemoved]: !flyerUrl,
  });
}

export async function setManagedEventVisibility(eventId: string, visible: boolean) {
  await updateRecord(AIRTABLE_TABLES.publicEvents, eventId, {
    [AIRTABLE_FIELDS.publicEvents.websiteVisibility]: visible ? "Visible" : "Hidden",
  });
}

async function uploadAttachment(recordId: string, fieldId: string, file: File) {
  const response = await fetch(
    `https://content.airtable.com/v0/${AIRTABLE_BASE_ID}/${recordId}/${fieldId}/uploadAttachment`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${getApiKey()}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contentType: file.type,
        filename: file.name,
        file: Buffer.from(await file.arrayBuffer()).toString("base64"),
      }),
    },
  );
  if (!response.ok) {
    console.error("Airtable attachment upload failed", response.status, await response.text());
    throw new Error("Airtable flyer upload failed.");
  }
}

async function getManagedCalendarId(eventId: string) {
  const event = (await listPublicEvents()).find((record) => record.id === eventId);
  if (!event) throw new Error("Event not found in Airtable.");
  const calendarId = linkedRecordId(
    event.fields[AIRTABLE_FIELDS.publicEvents.internalCalendar] ?? event.fields["Internal Calendar"],
  );
  if (!calendarId) throw new Error("This event has no linked Internal Calendar record.");
  return calendarId;
}

export async function uploadManagedEventFlyer(eventId: string, file: File) {
  const calendarId = await getManagedCalendarId(eventId);
  await uploadAttachment(calendarId, AIRTABLE_FIELDS.internalCalendar.flyer, file);
  await updateRecord(AIRTABLE_TABLES.publicEvents, eventId, {
    [AIRTABLE_FIELDS.publicEvents.websiteFlyerRemoved]: false,
  });
}

export async function getWebsiteEventSettings(): Promise<WebsiteEventSetting[]> {
  const records: AirtableRecord[] = [];
  let offset: string | undefined;
  do {
    const params = new URLSearchParams({ pageSize: "100", returnFieldsByFieldId: "true" });
    if (offset) params.set("offset", offset);
    const page = await airtableFetch<AirtableListResponse>(`${AIRTABLE_TABLES.websiteEventSettings}?${params}`);
    records.push(...page.records);
    offset = page.offset;
  } while (offset);

  return records.map((record) => ({
    id: record.id,
    slug: stringField(record.fields, AIRTABLE_FIELDS.websiteEventSettings.slug, "Slug"),
    visible: checkboxField(record.fields, AIRTABLE_FIELDS.websiteEventSettings.visible, "Visible"),
    title: stringField(record.fields, AIRTABLE_FIELDS.websiteEventSettings.title, "Title") || undefined,
    description: stringField(record.fields, AIRTABLE_FIELDS.websiteEventSettings.description, "Description") || undefined,
    location: stringField(record.fields, AIRTABLE_FIELDS.websiteEventSettings.location, "Location") || undefined,
    start: stringField(record.fields, AIRTABLE_FIELDS.websiteEventSettings.start, "Start") || undefined,
    end: stringField(record.fields, AIRTABLE_FIELDS.websiteEventSettings.end, "End") || undefined,
    imageSrc: attachmentUrl(record.fields[AIRTABLE_FIELDS.websiteEventSettings.flyer] ?? record.fields.Flyer),
    flyerRemoved: checkboxField(record.fields, AIRTABLE_FIELDS.websiteEventSettings.flyerRemoved, "Flyer Removed"),
  })).filter((setting) => setting.slug);
}

export async function updateWebsiteEventSetting(
  slug: string,
  fields: Partial<Omit<WebsiteEventSetting, "id" | "slug" | "imageSrc">>,
) {
  const existing = (await getWebsiteEventSettings()).find((setting) => setting.slug === slug);
  const airtableFields: Record<string, unknown> = {
    [AIRTABLE_FIELDS.websiteEventSettings.slug]: slug,
  };
  if (fields.visible !== undefined) airtableFields[AIRTABLE_FIELDS.websiteEventSettings.visible] = fields.visible;
  if (fields.title !== undefined) airtableFields[AIRTABLE_FIELDS.websiteEventSettings.title] = fields.title;
  if (fields.description !== undefined) airtableFields[AIRTABLE_FIELDS.websiteEventSettings.description] = fields.description;
  if (fields.location !== undefined) airtableFields[AIRTABLE_FIELDS.websiteEventSettings.location] = fields.location;
  if (fields.start !== undefined) airtableFields[AIRTABLE_FIELDS.websiteEventSettings.start] = fields.start;
  if (fields.end !== undefined) airtableFields[AIRTABLE_FIELDS.websiteEventSettings.end] = fields.end;
  if (fields.flyerRemoved !== undefined) airtableFields[AIRTABLE_FIELDS.websiteEventSettings.flyerRemoved] = fields.flyerRemoved;
  if (existing) {
    await updateRecord(AIRTABLE_TABLES.websiteEventSettings, existing.id, airtableFields);
    return existing.id;
  }
  const created = await createRecords(AIRTABLE_TABLES.websiteEventSettings, {
    ...airtableFields,
    [AIRTABLE_FIELDS.websiteEventSettings.visible]: fields.visible ?? true,
  });
  return created.id;
}

export async function uploadWebsiteEventFlyer(slug: string, file: File) {
  const recordId = await updateWebsiteEventSetting(slug, { flyerRemoved: false });
  await uploadAttachment(recordId, AIRTABLE_FIELDS.websiteEventSettings.flyer, file);
}

export async function deleteWebsiteEventFlyer(slug: string) {
  const recordId = await updateWebsiteEventSetting(slug, { flyerRemoved: true });
  await updateRecord(AIRTABLE_TABLES.websiteEventSettings, recordId, {
    [AIRTABLE_FIELDS.websiteEventSettings.flyer]: [],
  });
}

export async function createRsvp(submission: RsvpSubmission) {
  return airtableFetch<{ records: AirtableRecord[] }>(AIRTABLE_TABLES.rsvps, {
    method: "POST",
    body: JSON.stringify({
      records: [
        {
          fields: {
            [AIRTABLE_FIELDS.rsvps.name]: submission.name,
            [AIRTABLE_FIELDS.rsvps.email]: submission.email,
            [AIRTABLE_FIELDS.rsvps.year]: submission.academicStatus,
            [AIRTABLE_FIELDS.rsvps.majorMinor]: submission.majorMinor,
            [AIRTABLE_FIELDS.rsvps.referral]: submission.referral,
            [AIRTABLE_FIELDS.rsvps.syncStatus]: "Pending",
            [AIRTABLE_FIELDS.rsvps.event]: [submission.eventId],
          },
        },
      ],
      typecast: false,
    }),
  });
}

export async function recordGroupmeClick(slug: string) {
  return airtableFetch<{ records: AirtableRecord[] }>(AIRTABLE_TABLES.groupmeClicks, {
    method: "POST",
    body: JSON.stringify({
      records: [{
        fields: {
          [AIRTABLE_FIELDS.groupmeClicks.eventSlug]: slug,
          [AIRTABLE_FIELDS.groupmeClicks.clickedAt]: new Date().toISOString(),
        },
      }],
    }),
  });
}
