# AI Policy Competition: Airtable setup

Registration and brief uploads on `/2026policyhackathon` are stored in **one table, "AI Policy Competition 2026"**,
in the club's Airtable base (`appM8XoHX2voW3LQe`). Nothing else in that base is read or changed.

Each row is one of two types:

- **Participant**: one per registered person (name, email, academic status, school, major/minor) with
  their Team Name, Team Code and Solo flag.
- **Submission**: one per brief upload, with the Team Name, Team Code, the PDF, and judging score fields.

**Group the table by Team Code** to see each team's members and briefs together. The team is the unit of
record: briefs are uploaded with the team code, so it doesn't matter which member uploaded.

Code: `lib/hackathon/airtable.ts` (Airtable calls) and `lib/hackathon/store.ts` (registration rules).
Without the settings below, local development uses a temporary in-memory store; **production refuses to
accept registrations until Airtable is configured**, so nothing is silently lost.

## Settings

In `.env.local` locally, and in the Vercel project's environment variables for the live site:

```
HACKATHON_AIRTABLE_BASE_ID=appM8XoHX2voW3LQe
HACKATHON_AIRTABLE_TOKEN=pat...
```

The token needs `data.records:read` and `data.records:write` on the base (plus `schema.bases:read` and
`schema.bases:write` only when running the setup script). Optional: `HACKATHON_AIRTABLE_TABLE` to use a
differently named table.

## Creating or repairing the table

```
node --env-file=.env.local scripts/setup-hackathon-airtable.mjs
```

Safe to re-run: if the table exists it only adds missing fields.

## Rules the website enforces

- An email can register only once, on one team.
- Team names are unique (case-insensitive). Solo competitors become a team named "<Name> (solo)".
- Teams cap at 3 members.
- Uploads must be real PDFs, 4.5 MB or smaller (Vercel's request limit). Every upload is kept as its
  own Submission row; judge the most recent one before the 5:00 PM EST deadline (see Timestamp).

## Testing without real data

`HACKATHON_AIRTABLE_API_URL` points the code (and the setup script) at a different server, such as a local
mock. Leave it unset for real use.
