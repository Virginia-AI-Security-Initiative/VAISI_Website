import "server-only";

import { randomInt } from "node:crypto";
import * as airtable from "@/lib/hackathon/airtable";

// Team-based registration and brief submission for the AI Policy Competition.
//
// Data lives in a single Airtable table in the club's base (see docs/HACKATHON_AIRTABLE.md) when
// HACKATHON_AIRTABLE_BASE_ID and a token are set. Without them, local development
// falls back to an in-memory store that resets on restart; production refuses to run
// without Airtable so registrations are never silently lost.

export const MAX_TEAM_SIZE = 3;
export { MAX_BRIEF_BYTES } from "@/lib/hackathon/rules";

export type Participant = {
  name: string;
  email: string;
  academicStatus: string;
  school: string;
  majorMinor: string;
};

export type RegisteredTeam = { name: string; code: string; memberNames: string[] };
export type TeamLookup = { name: string; memberCount: number; submitted: boolean };

export class HackathonError extends Error {}

const CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function newTeamCode() {
  return Array.from({ length: 6 }, () => CODE_ALPHABET[randomInt(CODE_ALPHABET.length)]).join("");
}

export function normalizeTeamCode(value: string) {
  return value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 6);
}

const NOT_FOUND = "We couldn't find a team with that code. Double-check it with your teammate.";
const alreadyRegistered = (email: string, teamName: string) => `${email} is already registered on team “${teamName}”.`;

function airtableEnabled() {
  if (airtable.isHackathonAirtableConfigured()) return true;
  if (process.env.NODE_ENV === "production") {
    throw new HackathonError("Registration isn't open yet. Please check back soon.");
  }
  return false;
}

// ---------- Airtable ----------

const viaAirtable = {
  async createTeam(teamName: string, participant: Participant, solo: boolean): Promise<RegisteredTeam> {
    const existing = await airtable.findParticipantTeamName(participant.email);
    if (existing) throw new HackathonError(alreadyRegistered(participant.email, existing));
    if (await airtable.teamNameTaken(teamName)) throw new HackathonError("That team name is taken. Try another.");

    let code = newTeamCode();
    while (await airtable.teamCodeExists(code)) code = newTeamCode();

    await airtable.createParticipant({ name: teamName, code, solo }, participant);
    return { name: teamName, code, memberNames: [participant.name] };
  },

  async joinTeam(code: string, participant: Participant): Promise<RegisteredTeam> {
    const team = await airtable.findTeam(code);
    if (!team) throw new HackathonError(NOT_FOUND);
    const existing = await airtable.findParticipantTeamName(participant.email);
    if (existing) throw new HackathonError(alreadyRegistered(participant.email, existing));
    if (team.memberNames.length >= MAX_TEAM_SIZE) throw new HackathonError(`“${team.name}” already has ${MAX_TEAM_SIZE} members.`);

    await airtable.createParticipant({ name: team.name, code, solo: false }, participant);
    return { name: team.name, code, memberNames: [...team.memberNames, participant.name] };
  },

  async getTeamByCode(code: string): Promise<TeamLookup | null> {
    const team = await airtable.findTeam(code);
    if (!team) return null;
    return { name: team.name, memberCount: team.memberNames.length, submitted: await airtable.hasSubmission(code) };
  },

  async submitBrief(code: string, file: File) {
    const team = await airtable.findTeam(code);
    if (!team) throw new HackathonError(NOT_FOUND);
    const submittedAt = await airtable.createSubmission(team, file);
    return { name: team.name, submittedAt };
  },
};

// ---------- In-memory (local development only) ----------

type MemoryTeam = { name: string; code: string; members: Participant[]; submissions: string[] };
type MemoryState = { teams: MemoryTeam[] };
const globalState = globalThis as typeof globalThis & { __hackathonStore?: MemoryState };
const memory = (globalState.__hackathonStore ??= { teams: [] });

const memoryFind = (code: string) => memory.teams.find((team) => team.code === code) ?? null;
const memoryTeamOf = (email: string) => memory.teams.find((team) => team.members.some((member) => member.email === email));

const inMemory = {
  async createTeam(teamName: string, participant: Participant): Promise<RegisteredTeam> {
    const existing = memoryTeamOf(participant.email);
    if (existing) throw new HackathonError(alreadyRegistered(participant.email, existing.name));
    if (memory.teams.some((team) => team.name.toLowerCase() === teamName.toLowerCase())) {
      throw new HackathonError("That team name is taken. Try another.");
    }
    let code = newTeamCode();
    while (memoryFind(code)) code = newTeamCode();
    memory.teams.push({ name: teamName, code, members: [participant], submissions: [] });
    return { name: teamName, code, memberNames: [participant.name] };
  },

  async joinTeam(code: string, participant: Participant): Promise<RegisteredTeam> {
    const team = memoryFind(code);
    if (!team) throw new HackathonError(NOT_FOUND);
    const existing = memoryTeamOf(participant.email);
    if (existing) throw new HackathonError(alreadyRegistered(participant.email, existing.name));
    if (team.members.length >= MAX_TEAM_SIZE) throw new HackathonError(`“${team.name}” already has ${MAX_TEAM_SIZE} members.`);
    team.members.push(participant);
    return { name: team.name, code, memberNames: team.members.map((member) => member.name) };
  },

  async getTeamByCode(code: string): Promise<TeamLookup | null> {
    const team = memoryFind(code);
    return team ? { name: team.name, memberCount: team.members.length, submitted: team.submissions.length > 0 } : null;
  },

  async submitBrief(code: string) {
    const team = memoryFind(code);
    if (!team) throw new HackathonError(NOT_FOUND);
    const submittedAt = new Date().toISOString();
    team.submissions.push(submittedAt);
    return { name: team.name, submittedAt };
  },
};

// ---------- Public API ----------

export async function createTeam(teamName: string, participant: Participant, solo = false) {
  return airtableEnabled() ? viaAirtable.createTeam(teamName, participant, solo) : inMemory.createTeam(teamName, participant);
}

export async function joinTeam(code: string, participant: Participant) {
  const normalized = normalizeTeamCode(code);
  return airtableEnabled() ? viaAirtable.joinTeam(normalized, participant) : inMemory.joinTeam(normalized, participant);
}

export async function getTeamByCode(code: string) {
  const normalized = normalizeTeamCode(code);
  return airtableEnabled() ? viaAirtable.getTeamByCode(normalized) : inMemory.getTeamByCode(normalized);
}

export async function submitBrief(code: string, file: File) {
  const normalized = normalizeTeamCode(code);
  return airtableEnabled() ? viaAirtable.submitBrief(normalized, file) : inMemory.submitBrief(normalized);
}
