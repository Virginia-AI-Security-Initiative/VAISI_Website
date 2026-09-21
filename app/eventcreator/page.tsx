import { CalendarPlus, ShieldCheck } from "lucide-react";
import EventCreatorPortal from "@/app/eventcreator/EventCreatorPortal";
import { signInToEventCreator } from "@/app/eventcreator/auth-actions";
import { hasEventCreatorSession } from "@/lib/eventcreator/auth";
import { getWebsiteEvents } from "@/lib/events/data";
import { isAirtableConfigured } from "@/lib/rsvp/airtable";

export const dynamic = "force-dynamic";

function SetupMessage() {
  return <main className="min-h-screen bg-slate-950 px-6 py-12 text-white"><div className="mx-auto flex min-h-[70vh] max-w-2xl flex-col justify-center">
    <ShieldCheck className="mb-6" size={40} />
    <h1 className="text-3xl font-semibold">Event Creator</h1>
    <p className="mt-4 text-slate-300">Airtable is not configured for this environment.</p>
  </div></main>;
}

function SignIn({ invalid }: { invalid: boolean }) {
  return <main className="min-h-screen bg-slate-950 px-6 py-12 text-white"><div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center">
    <CalendarPlus className="mb-6" size={40} />
    <h1 className="text-3xl font-semibold">Event Creator</h1>
    <p className="mt-4 text-slate-300">Enter the VAISI Event Creator password.</p>
    <form action={signInToEventCreator} className="mt-8">
      <label htmlFor="event-creator-password" className="mb-2 block text-sm font-semibold text-slate-200">Password</label>
      <input id="event-creator-password" name="password" type="password" required autoComplete="current-password" className="min-h-12 w-full rounded-lg bg-white px-4 text-base text-slate-950 outline-none shadow-[inset_0_0_0_1px_rgba(255,255,255,0.2)] focus:shadow-[inset_0_0_0_2px_#dc6c3a]" />
      {invalid && <p role="alert" className="mt-3 text-sm font-medium text-red-300">That password is incorrect.</p>}
      <button type="submit" className="tap-scale mt-5 inline-flex min-h-12 items-center justify-center rounded-lg bg-white px-5 py-3 text-sm font-semibold text-slate-950 hover:bg-slate-100">Continue</button>
    </form>
  </div></main>;
}

export default async function EventCreatorPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  if (!isAirtableConfigured()) return <SetupMessage />;
  if (!(await hasEventCreatorSession())) {
    return <SignIn invalid={(await searchParams).error === "invalid-password"} />;
  }
  const events = await getWebsiteEvents({ includeHidden: true });
  return <EventCreatorPortal events={events} />;
}
