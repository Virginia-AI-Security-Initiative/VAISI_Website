import "server-only";

// Airtable storage for the AI Policy Competition: a single table in the club's base, created by
// scripts/setup-hackathon-airtable.mjs (field names here must match it). Each row is either a
// Participant (one per person) or a Submission (one per brief upload); rows share a Team Code.

// HACKATHON_AIRTABLE_API_URL points both at a local mock for testing; leave it unset in real use.
const API = process.env.HACKATHON_AIRTABLE_API_URL ?? "https://api.airtable.com/v0";
const CONTENT_API = process.env.HACKATHON_AIRTABLE_API_URL ?? "https://content.airtable.com/v0";

type AirtableRecord = { id: string; fields: Record<string, unknown> };

function baseId() {
  return process.env.HACKATHON_AIRTABLE_BASE_ID?.trim() ?? "";
}

function table() {
  return encodeURIComponent(process.env.HACKATHON_AIRTABLE_TABLE?.trim() || "AI Policy Competition 2026");
}

function token() {
  return (process.env.HACKATHON_AIRTABLE_TOKEN ?? process.env.airtable_api ?? "")
    .trim()
    .replace(/^['"]|['"]$/g, "")
    .replace(/^Bearer\s+/i, "");
}

export function isHackathonAirtableConfigured() {
  return Boolean(baseId() && token());
}

async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API}/${baseId()}/${path}`, {
    ...init,
    headers: { Authorization: `Bearer ${token()}`, "Content-Type": "application/json" },
    cache: "no-store",
  });
  if (!response.ok) {
    console.error("Competition Airtable request failed", response.status, await response.text());
    throw new Error("Airtable request failed.");
  }
  return response.json() as Promise<T>;
}

// Airtable formula string literal.
const str = (value: string) => JSON.stringify(value);
const participants = (clause: string) => `AND({Type}="Participant",${clause})`;

async function find(formula: string, maxRecords = 1) {
  const params = new URLSearchParams({ filterByFormula: formula, maxRecords: String(maxRecords) });
  const result = await api<{ records: AirtableRecord[] }>(`${table()}?${params}`);
  return result.records;
}

async function create(fields: Record<string, unknown>) {
  const result = await api<{ records: AirtableRecord[] }>(table(), {
    method: "POST",
    body: JSON.stringify({ records: [{ fields }], typecast: true }),
  });
  return result.records[0];
}

export type AirtableTeam = { name: string; code: string; memberNames: string[] };

/** The team's participant rows, in sign-up order. Null if no one has registered with that code. */
export async function findTeam(code: string): Promise<AirtableTeam | null> {
  const rows = await find(participants(`{Team Code}=${str(code)}`), 10);
  if (!rows.length) return null;
  const ordered = [...rows].sort((a, b) => String(a.fields.Timestamp ?? "").localeCompare(String(b.fields.Timestamp ?? "")));
  return {
    name: String(ordered[0].fields["Team Name"] ?? ""),
    code,
    memberNames: ordered.map((row) => String(row.fields.Name ?? "")),
  };
}

export async function teamCodeExists(code: string) {
  return (await find(`{Team Code}=${str(code)}`)).length > 0;
}

export async function teamNameTaken(name: string) {
  return (await find(participants(`LOWER({Team Name})=${str(name.toLowerCase())}`))).length > 0;
}

export async function findParticipantTeamName(email: string) {
  const row = (await find(participants(`LOWER({Email})=${str(email.toLowerCase())}`)))[0];
  return row ? String(row.fields["Team Name"] ?? "a team") : null;
}

export async function hasSubmission(code: string) {
  return (await find(`AND({Type}="Submission",{Team Code}=${str(code)})`)).length > 0;
}

export async function createParticipant(
  team: { name: string; code: string; solo: boolean },
  participant: { name: string; email: string; academicStatus: string; school: string; majorMinor: string },
) {
  return create({
    Name: participant.name,
    Type: "Participant",
    "Team Name": team.name,
    "Team Code": team.code,
    Solo: team.solo,
    Email: participant.email,
    "Academic Status": participant.academicStatus,
    School: participant.school,
    "Major/Minor": participant.majorMinor,
    Timestamp: new Date().toISOString(),
  });
}

export async function createSubmission(team: { name: string; code: string }, file: File) {
  const submittedAt = new Date().toISOString();
  const record = await create({
    Name: `Brief: ${team.name}`,
    Type: "Submission",
    "Team Name": team.name,
    "Team Code": team.code,
    Timestamp: submittedAt,
    Filename: file.name,
    "Size (KB)": Math.round(file.size / 1024),
  });

  const upload = await fetch(`${CONTENT_API}/${baseId()}/${record.id}/${encodeURIComponent("Brief PDF")}/uploadAttachment`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token()}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      contentType: "application/pdf",
      filename: file.name,
      file: Buffer.from(await file.arrayBuffer()).toString("base64"),
    }),
  });
  if (!upload.ok) {
    console.error("Competition brief upload failed", upload.status, await upload.text());
    await api(`${table()}/${record.id}`, { method: "DELETE" }).catch(() => {});
    throw new Error("Airtable attachment upload failed.");
  }
  return submittedAt;
}
