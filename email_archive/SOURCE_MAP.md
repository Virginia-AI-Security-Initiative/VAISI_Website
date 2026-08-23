# Current Information Source Map

Use historical emails for tone and structure only. Current logistics must come
from the user, the current website code, or another explicitly authoritative
source.

## Repository sources

| Need | Primary file/location | What to inspect |
| --- | --- | --- |
| Upcoming public events | `app/events/page.tsx` | `upcomingEvents`: title, date/time, location, description, flyer, RSVP/details links |
| Past event calibration | `app/events/page.tsx` | `pastEvents`: descriptions, dates, photos, recordings, and event-detail links |
| Fellowships | `app/get-involved/page.tsx` | `eventTypes`: schedule, time, duration, description, application note/deadline, application and syllabus links |
| Membership and community benefits | `app/get-involved/page.tsx` | membership benefit arrays and the rendered membership sections |
| Mailing list and social channels | `app/get-involved/page.tsx` | `stayUpdatedCards`: Listserv subscription, GroupMe, Instagram, LinkedIn |
| Public calendar | `app/page.tsx` | embedded Google Calendar ID and timezone; the calendar's event contents are external, not stored in the file |
| Mission and organizational background | `app/about/page.tsx` | mission, history, and organizational framing |
| Team and roles | `app/about/members.ts`, `app/team/page.tsx` | names and public roles; confirm a sender's current title rather than relying on old email signatures |
| Research announcements | `app/research/data.ts`, `app/research/page.tsx` | publication titles, authors, descriptions, and external links |
| Resource recommendations | `app/resources/page.tsx` | curated resource names, descriptions, and URLs |
| Internal planned events | Supabase `admin_events`, accessed through `lib/admin/data.ts` and `/admin` | internal date/time/location/description; this may be newer than static public pages but requires configured access |

## Fast local searches

```bash
rg -n "upcomingEvents|title:|dateRange:|location:|RSVP" app/events/page.tsx
rg -n "eventTypes|applicationNote|Apply by|schedule:|time:" app/get-involved/page.tsx
rg -n "mission|history|fellowship|membership" app/about app/get-involved
rg -n "vaisi_announcements|GroupMe|Instagram|LinkedIn" app
```

## Precedence and conflict handling

1. Facts the user supplies for the specific draft.
2. A clearly current authoritative event record or registration form.
3. The current public website content.
4. Historical website content.
5. Historical emails, for voice only.

If two current-looking sources conflict, flag the exact conflict before
producing a send-ready version. Never silently choose between different dates,
locations, deadlines, or URLs.

## Known historical/current mismatch

The supplied fellowship roundup mentions a September 13 deadline and a summer
reading group. As of this archive's creation, `app/get-involved/page.tsx`
contains Fall 2026 fellowship information with a September 6 call to action.
This is expected historical drift and demonstrates why old emails must not be
used as the factual source for new messages.

The April general-body emails appear to describe the same event, but that event
is not in the current `pastEvents` array. Their association is recorded as an
inference, not as verified website data.
