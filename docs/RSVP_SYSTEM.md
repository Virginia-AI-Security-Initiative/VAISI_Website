# VAISI RSVP system

Public RSVP links use `https://vaisi.org/events/<event-name-slug>`. Opening that URL loads the event from Airtable and opens the RSVP modal immediately. Closing the modal leaves the visitor on the event page.

## Create an event

Run this from the repository with the production Airtable token available as `airtable_api`:

```bash
node scripts/create-rsvp-event.mjs \
  --name "Event name" \
  --description "Short public description." \
  --location "Building 123" \
  --start "2026-10-01T18:30:00-04:00" \
  --end "2026-10-01T19:30:00-04:00"
```

The script is idempotent by exact event name. It creates the Internal Calendar row, lets the existing **Create Public Event when marked Public** Airtable automation create the linked Public Events row, then fills in its description, location, and Upcoming status. If the automation does not finish within ten seconds, the script creates the linked Public Events row itself.

The resulting URL is printed for use in emails and QR codes. Event pages derive their slug from the Airtable event name, so renaming an event changes its URL.

## Data flow

The website writes one row to `RSVPs`, including the linked `Event` and a `Pending` sync status. The enabled **RSVP to People** Airtable automation then finds a Person by email and links the RSVP to that person, or creates a new Person when none exists. The legacy Estimathon and Interest Meeting “Stamp Event” automations are not copied: they only add the event link that those old Airtable forms could not supply. The embedded website form supplies it directly.

The visible questions match the existing Estimathon RSVP: Name, Email, Academic Status, Major/Minor, and How did you hear about this event? After submission, the modal confirms the RSVP and links to the VAISI GroupMe.

## Environment

`airtable_api` is server-only. Never prefix it with `NEXT_PUBLIC_` or expose it in client code. The token needs read access to Public Events and Internal Calendar and record-create access to RSVPs.
