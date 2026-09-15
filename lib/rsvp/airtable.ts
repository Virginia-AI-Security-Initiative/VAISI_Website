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

function linkedRecordId(value: unknown) {
  if (!Array.isArray(value) || typeof value[0] !== "string") return null;
  return value[0];
}

export async function getPublicEventBySlug(slug: string): Promise<PublicEvent | null> {
  const fallback = EVENT_FALLBACKS[slug] ?? null;

  try {
    const event = (await listPublicEvents()).find((record) => {
      const name = record.fields.Name;
      return typeof name === "string" && eventSlug(name) === slug;
    });

    if (!event) return fallback;

    const name = String(event.fields.Name ?? "");
    const calendarId = linkedRecordId(event.fields["Internal Calendar"]);
    if (!calendarId) return fallback;

    const calendar = await airtableFetch<AirtableRecord>(
      `${AIRTABLE_TABLES.internalCalendar}/${calendarId}`,
    );

    const start = calendar.fields.Start;
    const end = calendar.fields.End;
    if (typeof start !== "string" || typeof end !== "string") return fallback;

    return {
      id: event.id,
      name,
      slug: eventSlug(name),
      description: String(event.fields.Description ?? ""),
      location: String(event.fields.Location ?? ""),
      start,
      end,
    };
  } catch (error) {
    if (!fallback) throw error;
    console.error("Using RSVP event fallback after Airtable lookup failed", {
      slug,
      error: error instanceof Error ? error.message : "Unknown error",
    });
    return fallback;
  }
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
