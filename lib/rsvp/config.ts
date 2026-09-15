export const AIRTABLE_BASE_ID = "appM8XoHX2voW3LQe";

export const AIRTABLE_TABLES = {
  people: "tbl0itJagOOY71AQn",
  rsvps: "tblyHx9ABxEwUSL8w",
  groupmeClicks: "tblGsZg6wdxFEj970",
  publicEvents: "tblh1H6GK4pHcKB8j",
  internalCalendar: "tblJJtTFMQ30Cmwj5",
} as const;

export const AIRTABLE_FIELDS = {
  rsvps: {
    name: "fldQredsNhxWyQCHa",
    email: "fldm8edSAsQvgBXPL",
    year: "fldB2PjHZMTH5ygVI",
    majorMinor: "fldP2XvMFxZqpYoDK",
    referral: "fld3V2nql2wVZ09YQ",
    syncStatus: "fldc2fG9b0HoEGvX8",
    event: "fldHjE9cAqXf5Mm1A",
  },
  publicEvents: {
    name: "fldYAT3UTpxeJsusn",
    location: "fldxyKDxCbRDHQwvO",
    description: "fld6LPrpuyD0nNmWU",
    status: "fldznBKKYGhZwEgcH",
    internalCalendar: "fldCjdLVcNtSsdgJ7",
  },
  internalCalendar: {
    name: "fldwPNmbW1y0GmBRd",
    start: "fldQVKekZUCwIZIw9",
    end: "fld4NLNThhwCbxOr3",
  },
  groupmeClicks: {
    eventSlug: "fldRoLhyE5Kh6r0lK",
    clickedAt: "fldF4T9VXd1VYJbW6",
  },
} as const;

export const ACADEMIC_STATUSES = [
  "First Year",
  "Second Year",
  "Third Year",
  "Fourth Year",
  "Law Student",
  "PhD",
  "Masters Student",
  "Post Doc",
  "Professional",
  "Faculty",
  "Other",
] as const;

export const GROUPME_URL = "https://groupme.com/join_group/110490963/bxseYw8L";

export function eventSlug(name: string) {
  return name
    .normalize("NFKD")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
