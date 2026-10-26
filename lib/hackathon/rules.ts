// Competition limits and deadlines, shared by the forms and the API routes.

// Vercel rejects request bodies over 4.5 MB before our code runs, and the upload also carries the
// team code and form overhead, so the file itself must stay a little under that.
export const MAX_BRIEF_LABEL = "4.5 MB";
export const MAX_BRIEF_BYTES = 4_400_000;

export const DEADLINES = {
  // 11:59 PM Eastern on November 15, 2026 (EST is UTC-5).
  registration: { closesAt: new Date("2026-11-16T04:59:59.999Z"), message: "Team signup and registration closed at 11:59 PM on November 15." },
  // 5:00 PM Eastern on November 20, 2026.
  submission: { closesAt: new Date("2026-11-20T22:00:00.000Z"), message: "Brief submissions closed at 5:00 PM EST on November 20." },
} as const;

export type Deadline = keyof typeof DEADLINES;

// HACKATHON_TEST_NOW (an ISO date) lets local testing pretend it's a different time. Ignored in production.
function now() {
  const test = process.env.NODE_ENV !== "production" ? process.env.HACKATHON_TEST_NOW : undefined;
  return test ? new Date(test) : new Date();
}

export function isOpen(deadline: Deadline) {
  return now() <= DEADLINES[deadline].closesAt;
}
