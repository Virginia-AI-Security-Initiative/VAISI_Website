import { toIcs } from "../../calendar";
import { allCalendarEvents } from "../../content";

// Serves .ics files for Apple Calendar, Outlook and others: /2026policyhackathon/calendar/<event id>.ics,
// or /2026policyhackathon/calendar/all.ics for the whole schedule.
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id.replace(/\.ics$/, "");
  const events = allCalendarEvents();
  const selected = id === "all" ? events : events.filter((event) => event.id === id);
  if (!selected.length) return new Response("Event not found", { status: 404 });

  return new Response(toIcs(selected), {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="${id === "all" ? "vaisi-ai-policy-competition" : id}.ics"`,
    },
  });
}
