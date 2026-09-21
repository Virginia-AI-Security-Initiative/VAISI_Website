import "server-only";

import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { getEventCreatorAccessConfig } from "@/lib/rsvp/airtable";

const COOKIE_NAME = "vaisi_event_creator_session";
const SESSION_LENGTH_MS = 7 * 24 * 60 * 60 * 1000;

function airtableSigningSecret() {
  const raw = process.env.airtable_api ?? process.env.AIRTABLE_API_KEY;
  if (!raw) throw new Error("Airtable is not configured.");
  return raw.trim().replace(/^Bearer\s+/i, "").replace(/^['\"]|['\"]$/g, "");
}

function safeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer);
}

function signature(expires: string, passwordHash: string) {
  return createHmac("sha256", airtableSigningSecret())
    .update(`event-creator:${expires}:${passwordHash}`)
    .digest("hex");
}

export async function verifyEventCreatorPassword(password: string) {
  const access = await getEventCreatorAccessConfig();
  if (!access) return false;
  const submittedHash = createHash("sha256").update(password).digest("hex");
  return safeEqual(submittedHash, access.passwordHash);
}

export async function hasEventCreatorSession() {
  const value = (await cookies()).get(COOKIE_NAME)?.value;
  if (!value) return false;
  const [expires, providedSignature] = value.split(".");
  if (!expires || !providedSignature || Number(expires) <= Date.now()) return false;
  const access = await getEventCreatorAccessConfig();
  if (!access) return false;
  return safeEqual(providedSignature, signature(expires, access.passwordHash));
}

export async function createEventCreatorSession() {
  const access = await getEventCreatorAccessConfig();
  if (!access) throw new Error("Event Creator access is not active in Airtable.");
  const expires = String(Date.now() + SESSION_LENGTH_MS);
  (await cookies()).set(COOKIE_NAME, `${expires}.${signature(expires, access.passwordHash)}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/eventcreator",
    expires: new Date(Number(expires)),
  });
}

export async function clearEventCreatorSession() {
  (await cookies()).set(COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/eventcreator",
    expires: new Date(0),
  });
}

export async function requireEventCreatorSession() {
  if (!(await hasEventCreatorSession())) {
    throw new Error("Enter the Event Creator password first.");
  }
}
