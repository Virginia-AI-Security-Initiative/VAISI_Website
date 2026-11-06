// Calendar helpers for the competition schedule: Google Calendar links and .ics files.
// Times are stored in UTC (EST is UTC-5 in November).

export type CalendarEvent = {
  id: string;
  title: string;
  description: string;
  location?: string;
  start: string; // ISO date-time in UTC, or YYYY-MM-DD for all-day
  end: string; // exclusive end; for all-day, the following day
  allDay?: boolean;
  rrule?: string; // e.g. "FREQ=DAILY;COUNT=5"
};

const TIME_ZONE = "America/New_York";

function compact(value: string, allDay?: boolean) {
  return allDay ? value.replaceAll("-", "") : value.replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

export function googleCalendarUrl(event: CalendarEvent) {
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: event.title,
    dates: `${compact(event.start, event.allDay)}/${compact(event.end, event.allDay)}`,
    details: event.description,
    ctz: TIME_ZONE,
  });
  if (event.location) params.set("location", event.location);
  if (event.rrule) params.set("recur", `RRULE:${event.rrule}`);
  return `https://calendar.google.com/calendar/render?${params}`;
}

function escapeIcs(value: string) {
  return value.replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/([,;])/g, "\\$1");
}

export function toIcs(events: CalendarEvent[]) {
  const stamp = compact(new Date().toISOString());
  const lines = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//VAISI//AI Policy Competition//EN", "CALSCALE:GREGORIAN"];
  for (const event of events) {
    lines.push(
      "BEGIN:VEVENT",
      `UID:${event.id}@vaisi.org`,
      `DTSTAMP:${stamp}`,
      event.allDay ? `DTSTART;VALUE=DATE:${compact(event.start, true)}` : `DTSTART:${compact(event.start)}`,
      event.allDay ? `DTEND;VALUE=DATE:${compact(event.end, true)}` : `DTEND:${compact(event.end)}`,
      `SUMMARY:${escapeIcs(event.title)}`,
      `DESCRIPTION:${escapeIcs(event.description)}`,
    );
    if (event.location) lines.push(`LOCATION:${escapeIcs(event.location)}`);
    if (event.rrule) lines.push(`RRULE:${event.rrule}`);
    lines.push("END:VEVENT");
  }
  lines.push("END:VCALENDAR");
  return lines.join("\r\n") + "\r\n";
}

export function dateTile(start: string, allDay?: boolean) {
  const date = allDay ? new Date(`${start}T12:00:00-05:00`) : new Date(start);
  const part = (options: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat("en-US", { timeZone: TIME_ZONE, ...options }).format(date);
  return { month: part({ month: "short" }), day: part({ day: "numeric" }), weekday: part({ weekday: "short" }) };
}
