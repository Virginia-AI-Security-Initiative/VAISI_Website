import { redirect } from "next/navigation";
import { CalendarPlus, ShieldCheck } from "lucide-react";
import EventCreatorPortal from "@/app/eventcreator/EventCreatorPortal";
import { getCurrentExecAccess } from "@/lib/admin/data";
import { getWebsiteEvents } from "@/lib/events/data";
import { createSupabaseServerClient, getSupabaseConfig } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

function SetupMessage() {
  return <main className="min-h-screen bg-slate-950 px-6 py-12 text-white"><div className="mx-auto flex min-h-[70vh] max-w-2xl flex-col justify-center">
    <ShieldCheck className="mb-6" size={40} />
    <h1 className="text-3xl font-semibold">Event Creator</h1>
    <p className="mt-4 text-slate-300">Supabase is not configured for this environment.</p>
  </div></main>;
}

function SignIn() {
  return <main className="min-h-screen bg-slate-950 px-6 py-12 text-white"><div className="mx-auto flex min-h-[70vh] max-w-2xl flex-col justify-center">
    <CalendarPlus className="mb-6" size={40} />
    <h1 className="text-3xl font-semibold">Event Creator</h1>
    <p className="mt-4 max-w-lg text-slate-300">Create and manage VAISI website events and their standard RSVP pages.</p>
    <a href="/auth/sign-in?next=/eventcreator" className="tap-scale mt-8 inline-flex min-h-12 w-fit items-center rounded-md bg-white px-5 py-3 text-sm font-semibold text-slate-950 hover:bg-slate-100">Continue with Google</a>
  </div></main>;
}

export default async function EventCreatorPage() {
  if (!getSupabaseConfig()) return <SetupMessage />;
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user?.email) return <SignIn />;
  const access = await getCurrentExecAccess(supabase, user.email);
  if (!access) redirect("/");
  const events = await getWebsiteEvents({ includeHidden: true });
  return <EventCreatorPortal events={events} currentEmail={user.email} />;
}
