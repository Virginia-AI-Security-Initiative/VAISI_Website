"use client";

import Image from "next/image";
import Link from "next/link";
import { Camera, ChevronLeft, ChevronRight, ExternalLink, X } from "lucide-react";
import { createPortal } from "react-dom";
import { useCallback, useEffect, useState } from "react";
import Section from "@/components/Section";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/motion";
import { sectionTitleClass } from "@/components/sectionTitle";
import type { EventLink, WebsiteEvent } from "@/lib/events/types";

type EventPhoto = string | { src: string; alt: string };

function formatDateRange(start: string, end: string, includeTime: boolean) {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const date = new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "America/New_York" });
  const time = new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit", timeZone: "America/New_York" });
  const sameDay = date.format(startDate) === date.format(endDate);
  if (!includeTime) return sameDay ? date.format(startDate) : `${date.format(startDate)} – ${date.format(endDate)}`;
  if (sameDay) return `${date.format(startDate)} · ${time.format(startDate)}–${time.format(endDate)}`;
  return `${date.format(startDate)}, ${time.format(startDate)} – ${date.format(endDate)}, ${time.format(endDate)}`;
}

function EventLinks({ links }: { links?: EventLink[] }) {
  if (!links?.length) return null;
  return <div className="mt-4 flex flex-col items-start gap-2 border-t border-gray-100 pt-3">
    {links.map((link) => {
      const className = link.emphasis === "primary"
        ? "tap-scale inline-flex min-h-11 items-center justify-center rounded-lg bg-primary/8 px-3.5 py-2 text-sm font-medium text-primary hover:bg-primary/12"
        : "text-link-subtle inline-flex min-h-11 items-center text-sm font-medium text-gray-600 hover:text-primary";
      return link.url.startsWith("http")
        ? <a key={link.url} href={link.url} target="_blank" rel="noopener noreferrer" className={className}>{link.label}</a>
        : <Link key={link.url} href={link.url} scroll={false} className={className}>{link.label}</Link>;
    })}
  </div>;
}

function PhotoLightbox({ photos, title, onClose }: { photos: EventPhoto[]; title: string; onClose: () => void }) {
  const [index, setIndex] = useState(0);
  const goNext = useCallback(() => setIndex((value) => (value + 1) % photos.length), [photos.length]);
  const goPrevious = useCallback(() => setIndex((value) => (value - 1 + photos.length) % photos.length), [photos.length]);
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowRight") goNext();
      if (event.key === "ArrowLeft") goPrevious();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => { document.body.style.overflow = previousOverflow; window.removeEventListener("keydown", onKeyDown); };
  }, [goNext, goPrevious, onClose]);
  const photo = photos[index];
  const src = typeof photo === "string" ? photo : photo.src;
  const alt = typeof photo === "string" ? `${title} photo ${index + 1}` : photo.alt;
  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90" onClick={onClose} role="dialog" aria-modal="true" aria-label={`${title} photo gallery`}>
      <button onClick={onClose} className="tap-scale fixed right-6 top-6 z-10 flex size-11 items-center justify-center rounded-xl text-white/80 hover:bg-white/10" aria-label="Close photo gallery"><X size={28} /></button>
      {photos.length > 1 && <>
        <button onClick={(event) => { event.stopPropagation(); goPrevious(); }} className="tap-scale fixed left-2 top-1/2 z-10 flex size-11 -translate-y-1/2 items-center justify-center rounded-xl text-white/80 hover:bg-white/10 sm:left-6" aria-label="Previous photo"><ChevronLeft size={36} /></button>
        <button onClick={(event) => { event.stopPropagation(); goNext(); }} className="tap-scale fixed right-2 top-1/2 z-10 flex size-11 -translate-y-1/2 items-center justify-center rounded-xl text-white/80 hover:bg-white/10 sm:right-6" aria-label="Next photo"><ChevronRight size={36} /></button>
      </>}
      <div className="relative h-[80vh] w-[90vw] max-w-6xl" onClick={(event) => event.stopPropagation()}><Image src={src} alt={alt} fill sizes="90vw" className="object-contain" /></div>
      <p className="fixed bottom-6 left-1/2 -translate-x-1/2 text-sm tabular-nums text-white/70">{index + 1} / {photos.length}</p>
    </div>, document.body,
  );
}

function Flyer({ event, cover = false }: { event: WebsiteEvent; cover?: boolean }) {
  if (!event.imageSrc) return null;

  return <div className="relative flex items-center justify-center overflow-hidden bg-gray-100" style={{ aspectRatio: "8.5 / 11" }}>
    {event.imageSrc.startsWith("http")
      // Remote flyer hosts vary (Airtable and the configured Supabase project), so this cannot use a fixed Next Image allowlist.
      // eslint-disable-next-line @next/next/no-img-element
      ? <img src={event.imageSrc} alt={`${event.title} flyer`} className={`image-outline absolute inset-0 size-full ${cover ? "object-cover" : "object-contain"}`} />
      : <Image src={event.imageSrc} alt={`${event.title} flyer`} fill sizes="(min-width: 1024px) 352px, (min-width: 640px) 50vw, 100vw" className={`image-outline ${cover ? "object-cover" : "object-contain"}`} />
    }
  </div>;
}

function UpcomingCard({ event }: { event: WebsiteEvent }) {
  return <article className="surface-card overflow-hidden rounded-2xl border border-gray-200 bg-white">
    <Flyer event={event} />
    <div className="p-4">
      <h3 className="mb-1 text-base font-bold text-gray-900">{event.title}</h3>
      <p className="mb-1 text-xs font-medium text-secondary tabular-nums">{event.dateLabel ?? formatDateRange(event.start, event.end, true)}</p>
      <p className="mb-2 text-xs font-medium text-secondary">{event.location}</p>
      <p className="text-sm text-gray-500">{event.description}</p>
      <EventLinks links={event.links} />
    </div>
  </article>;
}

function PastCard({ event }: { event: WebsiteEvent }) {
  const [open, setOpen] = useState(false);
  return <>
    <article className="surface-card overflow-hidden rounded-2xl border border-gray-200 bg-white">
      <Flyer event={event} cover />
      <div className="p-4">
        <span className="mb-2 inline-block rounded-full bg-primary/8 px-2 py-0.5 text-xs font-semibold text-primary tabular-nums">{event.dateLabel ?? formatDateRange(event.start, event.end, false)}</span>
        <h3 className="mb-1 text-base font-bold text-gray-900">{event.title}</h3>
        <p className="text-sm text-gray-500">{event.description}</p>
        {event.links?.some((link) => link.url.startsWith("http")) && <div className="mt-2 flex flex-wrap gap-4">{event.links.filter((link) => link.url.startsWith("http")).map((link) => <a key={link.url} href={link.url} target="_blank" rel="noopener noreferrer" className="text-link-subtle inline-flex min-h-11 items-center gap-1.5 text-xs text-gray-500"><ExternalLink size={12} />{link.label}</a>)}</div>}
        {!!event.photos?.length && <button onClick={() => setOpen(true)} className="text-link-subtle mt-2 inline-flex min-h-11 items-center gap-1.5 text-xs text-gray-500"><Camera size={12} />View photos ({event.photos.length})</button>}
      </div>
    </article>
    {open && event.photos && <PhotoLightbox photos={event.photos} title={event.title} onClose={() => setOpen(false)} />}
  </>;
}

export default function EventGrid({ upcoming, past }: { upcoming: WebsiteEvent[]; past: WebsiteEvent[] }) {
  return <>
    {upcoming.length > 0 && <Section className="border-b border-gray-200 bg-gray-50"><div className="mx-auto max-w-6xl">
      <Reveal><h2 className={`${sectionTitleClass} mb-6 text-gray-900`}>Upcoming Events</h2></Reveal>
      <StaggerGroup className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">{upcoming.map((event) => <StaggerItem key={`${event.source}-${event.id}`}><UpcomingCard event={event} /></StaggerItem>)}</StaggerGroup>
    </div></Section>}
    <Section className="bg-white"><div className="mx-auto max-w-6xl">
      <Reveal><h2 className={`${sectionTitleClass} mb-6 text-gray-900`}>Past Events</h2></Reveal>
      <StaggerGroup className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">{past.map((event) => <StaggerItem key={`${event.source}-${event.id}`}><PastCard event={event} /></StaggerItem>)}</StaggerGroup>
    </div></Section>
  </>;
}
