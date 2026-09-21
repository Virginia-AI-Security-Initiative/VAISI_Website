"use client";

import { Eye, EyeOff, ImageMinus, Pencil, Plus, Upload } from "lucide-react";
import Link from "next/link";
import { FormEvent, useState, useTransition } from "react";
import { createPortalEvent, deletePortalFlyer, togglePortalEvent, updatePortalEvent, type EventCreatorResult } from "@/app/eventcreator/actions";
import type { WebsiteEvent } from "@/lib/events/types";

const inputClass = "min-h-11 w-full rounded-lg bg-white px-3.5 text-base text-slate-950 shadow-[inset_0_0_0_1px_rgba(15,23,42,0.18)] outline-none transition-[box-shadow] focus:shadow-[inset_0_0_0_2px_#dc6c3a]";
const labelClass = "mb-1.5 block text-sm font-semibold text-slate-800";

function easternDateTimeInput(iso: string) {
  const parts = Object.fromEntries(new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hourCycle: "h23",
  }).formatToParts(new Date(iso)).map((part) => [part.type, part.value]));
  return `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}`;
}

function SubmitButton({ children, disabled }: { children: React.ReactNode; disabled: boolean }) {
  return <button type="submit" disabled={disabled} className="tap-scale inline-flex min-h-11 items-center justify-center rounded-lg bg-slate-950 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-wait disabled:opacity-60">{children}</button>;
}

function EventFields({ event }: { event?: WebsiteEvent }) {
  return <div className="grid gap-4">
    <label><span className={labelClass}>Event name *</span><input name="name" required maxLength={160} defaultValue={event?.title} className={inputClass} /></label>
    <label><span className={labelClass}>Event description *</span><textarea name="description" required maxLength={4000} rows={4} defaultValue={event?.description} className={`${inputClass} py-3`} /></label>
    <div className="grid gap-4 sm:grid-cols-2">
      <label><span className={labelClass}>Starts *</span><input type="datetime-local" name="start" required defaultValue={event ? easternDateTimeInput(event.start) : ""} className={`${inputClass} tabular-nums`} /></label>
      <label><span className={labelClass}>Ends *</span><input type="datetime-local" name="end" required defaultValue={event ? easternDateTimeInput(event.end) : ""} className={`${inputClass} tabular-nums`} /></label>
    </div>
    <label><span className={labelClass}>Location * <span className="font-normal text-slate-500">(TBD allowed)</span></span><input name="location" required maxLength={300} defaultValue={event?.location} className={inputClass} /></label>
    <label><span className={labelClass}>Flyer <span className="font-normal text-slate-500">(JPG, PNG, WebP, or GIF; max 5 MB)</span></span><input type="file" name="flyer" accept="image/jpeg,image/png,image/webp,image/gif" className="block min-h-11 w-full rounded-lg bg-white px-3 py-2 text-sm text-slate-700 shadow-[inset_0_0_0_1px_rgba(15,23,42,0.18)] file:mr-3 file:rounded-md file:border-0 file:bg-slate-100 file:px-3 file:py-1.5 file:font-semibold" /></label>
  </div>;
}

export default function EventCreatorPortal({ events }: { events: WebsiteEvent[] }) {
  const [isPending, startTransition] = useTransition();
  const [notice, setNotice] = useState<EventCreatorResult | null>(null);

  function submit(action: (data: FormData) => Promise<EventCreatorResult>) {
    return (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const form = event.currentTarget;
      const data = new FormData(form);
      startTransition(async () => {
        const result = await action(data);
        setNotice(result);
        if (result.ok && action === createPortalEvent) form.reset();
      });
    };
  }

  function quickAction(action: (data: FormData) => Promise<EventCreatorResult>, data: FormData) {
    startTransition(async () => setNotice(await action(data)));
  }

  return <main className="min-h-screen bg-slate-100 px-4 py-10 text-slate-950 sm:px-6">
    <div className="mx-auto max-w-5xl">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div><p className="text-sm font-semibold uppercase tracking-[0.16em] text-orange-700">VAISI internal</p><h1 className="mt-1 text-3xl font-semibold tracking-tight">Event Creator</h1><p className="mt-2 text-sm text-slate-600">Times are entered and displayed in Eastern Time.</p></div>
        <div className="flex gap-4 text-sm"><Link href="/events" className="text-link-subtle min-h-11 py-3">View events</Link><a href="/eventcreator/sign-out" className="text-link-subtle min-h-11 py-3">Sign out</a></div>
      </header>

      {notice && <div role="status" className={`mt-6 rounded-lg px-4 py-3 text-sm font-medium shadow-[0_0_0_1px_rgba(0,0,0,0.08)] ${notice.ok ? "bg-emerald-50 text-emerald-900" : "bg-red-50 text-red-900"}`}>{notice.message}</div>}

      <section className="mt-8 rounded-xl bg-white p-5 shadow-[0_0_0_1px_rgba(15,23,42,0.08),0_8px_24px_rgba(15,23,42,0.06)] sm:p-7">
        <div className="mb-5 flex items-center gap-3"><Plus className="text-orange-700" size={22} /><div><h2 className="text-xl font-semibold">Create an Airtable event</h2><p className="mt-1 text-sm text-slate-600">Creates the calendar record, public event, website listing, and standard RSVP page.</p></div></div>
        <form onSubmit={submit(createPortalEvent)} encType="multipart/form-data">
          <EventFields />
          <div className="mt-5"><SubmitButton disabled={isPending}>{isPending ? "Saving…" : "Create event"}</SubmitButton></div>
        </form>
      </section>

      <section className="mt-10">
        <div className="mb-4"><h2 className="text-2xl font-semibold">All website events</h2><p className="mt-1 text-sm text-slate-600">Airtable events sync their details back to Airtable. Website-only events remain outside Airtable.</p></div>
        <div className="space-y-4">
          {events.map((event) => <article key={`${event.source}-${event.id}`} className="rounded-xl bg-white p-5 shadow-[0_0_0_1px_rgba(15,23,42,0.08)]">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><h3 className="text-lg font-semibold">{event.title}</h3><span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">{event.source === "airtable" ? "Airtable + website" : "Website only"}</span>{!event.visible && <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-900">Hidden</span>}</div><p className="mt-1 text-sm text-slate-600 tabular-nums">{new Date(event.start).toLocaleString("en-US", { timeZone: "America/New_York", dateStyle: "medium", timeStyle: "short" })} · {event.location}</p></div>
              <div className="flex shrink-0 flex-wrap gap-2">
                <button type="button" disabled={isPending} onClick={() => { const data = new FormData(); data.set("slug", event.slug); data.set("source", event.source); data.set("airtableEventId", event.source === "airtable" ? event.id : ""); data.set("visible", String(!event.visible)); quickAction(togglePortalEvent, data); }} className="tap-scale inline-flex min-h-10 items-center gap-2 rounded-lg bg-slate-100 px-3 text-sm font-semibold hover:bg-slate-200">{event.visible ? <EyeOff size={16} /> : <Eye size={16} />}{event.visible ? "Hide" : "Show"}</button>
                {event.imageSrc && <button type="button" disabled={isPending} onClick={() => { const data = new FormData(); data.set("slug", event.slug); data.set("source", event.source); data.set("eventId", event.id); quickAction(deletePortalFlyer, data); }} className="tap-scale inline-flex min-h-10 items-center gap-2 rounded-lg bg-slate-100 px-3 text-sm font-semibold hover:bg-slate-200"><ImageMinus size={16} />Remove flyer</button>}
              </div>
            </div>
            <details className="mt-4 group"><summary className="tap-scale flex min-h-11 w-fit list-none items-center gap-2 rounded-lg px-3 text-sm font-semibold text-slate-700 hover:bg-slate-100"><Pencil size={16} />Edit details or upload flyer</summary>
              <form onSubmit={submit(updatePortalEvent)} encType="multipart/form-data" className="mt-4 border-t border-slate-100 pt-5">
                <input type="hidden" name="eventId" value={event.id} /><input type="hidden" name="oldSlug" value={event.slug} /><input type="hidden" name="source" value={event.source} /><input type="hidden" name="visible" value={String(event.visible)} />
                <EventFields event={event} />
                <div className="mt-5"><SubmitButton disabled={isPending}><Upload size={16} />{isPending ? "Saving…" : "Save changes"}</SubmitButton></div>
              </form>
            </details>
          </article>)}
        </div>
      </section>
    </div>
  </main>;
}
