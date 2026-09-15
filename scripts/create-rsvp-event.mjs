#!/usr/bin/env node

const BASE_ID = "appM8XoHX2voW3LQe";
const CALENDAR_TABLE = "tblJJtTFMQ30Cmwj5";
const EVENTS_TABLE = "tblh1H6GK4pHcKB8j";
const apiKey = process.env.airtable_api ?? process.env.AIRTABLE_API_KEY;

function readArgs(args) {
  const values = {};
  for (let index = 0; index < args.length; index += 2) {
    const key = args[index]?.replace(/^--/, "");
    values[key] = args[index + 1];
  }
  return values;
}

function slugify(value) {
  return value.normalize("NFKD").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

async function airtable(path, init) {
  const response = await fetch(`https://api.airtable.com/v0/${BASE_ID}/${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) throw new Error(`Airtable request failed (${response.status}): ${await response.text()}`);
  return response.json();
}

async function findEvent(name) {
  const params = new URLSearchParams({
    filterByFormula: `{Name}=${JSON.stringify(name)}`,
    maxRecords: "1",
  });
  const result = await airtable(`${EVENTS_TABLE}?${params}`);
  return result.records[0] ?? null;
}

async function main() {
  if (!apiKey) throw new Error("Set airtable_api before running this script.");
  const input = readArgs(process.argv.slice(2));
  for (const required of ["name", "description", "location", "start", "end"]) {
    if (!input[required]) throw new Error(`Missing --${required}`);
  }

  let event = await findEvent(input.name);
  if (!event) {
    const calendar = await airtable(CALENDAR_TABLE, {
      method: "POST",
      body: JSON.stringify({
        records: [{ fields: {
          Name: input.name,
          Start: input.start,
          End: input.end,
          Notes: input.description,
          Public: true,
        } }],
      }),
    });

    // The existing Airtable automation normally creates the Public Events row.
    for (let attempt = 0; attempt < 10 && !event; attempt += 1) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      event = await findEvent(input.name);
    }

    if (!event) {
      const created = await airtable(EVENTS_TABLE, {
        method: "POST",
        body: JSON.stringify({ records: [{ fields: {
          Name: input.name,
          Location: input.location,
          Description: input.description,
          Status: "Upcoming",
          "Internal Calendar": [calendar.records[0].id],
        } }] }),
      });
      event = created.records[0];
    }
  }

  await airtable(EVENTS_TABLE, {
    method: "PATCH",
    body: JSON.stringify({ records: [{ id: event.id, fields: {
      Location: input.location,
      Description: input.description,
      Status: "Upcoming",
    } }] }),
  });

  console.log(`RSVP URL: https://vaisi.org/events/${slugify(input.name)}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
