# VAISI RSVP system

Public RSVP links use `https://vaisi.org/events/<event-name-slug>`. Opening that URL loads the event from Airtable and opens the RSVP modal over the Events page immediately. Closing the modal returns the visitor to `/events`.

## Create an event

Approved VAISI exec members can create and manage events at
`https://vaisi.org/eventcreator`. Google sign-in uses the same allowlist as the
existing admin dashboard. The portal creates the linked Internal Calendar and
Public Events records, publishes the event in chronological order on `/events`,
and provides the standard `/events/<event-name-slug>` RSVP flow.

The portal also supports editing, show/hide controls, and flyer upload/removal.
Event data, visibility, and flyers are stored entirely in Airtable. Managed
event flyers use the linked Internal Calendar attachment field, and visibility
uses Public Events → Website Visibility.

Website-only events remain in `lib/events/static-events.ts` and do not become
Public Events records. Portal edits for them are stored in Airtable's Website
Event Settings table. If a Public Events record has the same slug, the Airtable
version supplies its current logistics while retaining the tracked event media
as a fallback.

### Command-line fallback

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

The visible questions match the existing Estimathon RSVP: Name, Email, Academic Status, Major/Minor, and How did you hear about this event? After submission, the modal confirms the RSVP and links to the VAISI GroupMe. The confirmation button visits `/go/groupme/<event-slug>`, records one anonymous row in Airtable's **GroupMe Clicks** table, then redirects to GroupMe. Filter or group that table by **Event slug** to see per-event click totals. This counts button clicks, not confirmed GroupMe joins.

The Airtable row stores only an event slug and timestamp; it does not store attendee identity. If logging fails, the visitor is still redirected to GroupMe. The production `airtable_api` token needs record-create access to **GroupMe Clicks** in addition to the existing RSVP tables.

## Environment

`airtable_api` is server-only. Never prefix it with `NEXT_PUBLIC_` or expose it in client code. The token needs read access to Public Events and Internal Calendar and record-create access to RSVPs.
