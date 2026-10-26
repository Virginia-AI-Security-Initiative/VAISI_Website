import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, MapPin } from "lucide-react";
import Section from "@/components/Section";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/motion";
import { Flyer, formatDateRange } from "@/components/events/eventDisplay";
import RsvpForm from "@/components/rsvp/RsvpForm";
import { getWebsiteEvents, partitionWebsiteEvents } from "@/lib/events/data";
import { getPublicEventBySlug } from "@/lib/rsvp/airtable";
import type { WebsiteEvent } from "@/lib/events/types";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ preview?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const event = await getPublicEventBySlug((await params).slug);
  if (!event) return { title: "Event | VAISI" };
  return {
    title: `${event.name} | VAISI`,
    description: event.description,
  };
}

function hasEnded(end: string) {
  return new Date(end).getTime() < Date.now();
}

function FlyerPlaceholder({ title }: { title: string }) {
  return <div className="relative flex flex-col justify-between overflow-hidden rounded-2xl bg-primary p-8 text-white" style={{ aspectRatio: "8.5 / 11" }}>
    <Image src="/logo.png" alt="" width={56} height={56} className="size-14 rounded-xl bg-white p-1.5" />
    <div>
      <p className="mb-3 text-sm font-semibold uppercase tracking-[0.14em] text-secondary">VAISI Event</p>
      <p className="text-3xl font-bold leading-tight tracking-[-0.02em]">{title}</p>
    </div>
  </div>;
}

function ClosedNotice({ title, body }: { title: string; body: string }) {
  return <div className="py-6 text-center">
    <h2 className="text-2xl font-bold tracking-[-0.02em] text-primary">{title}</h2>
    <p className="mx-auto mt-2 max-w-sm text-base leading-relaxed text-gray-600">{body}</p>
    <Link href="/events" className="tap-scale button-raised mt-6 inline-flex min-h-11 items-center justify-center rounded-xl bg-primary px-5 py-2.5 font-medium text-white hover:bg-primary/92">
      See upcoming events
    </Link>
  </div>;
}

function MoreEventCard({ event }: { event: WebsiteEvent }) {
  const href = event.links?.find((link) => link.emphasis === "primary" && !link.url.startsWith("http"))?.url ?? "/events";
  return <Link href={href} className="surface-card flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-4">
    <p className="mb-1 text-xs font-medium text-secondary tabular-nums">{event.dateLabel ?? formatDateRange(event.start, event.end, true)}</p>
    <h3 className="mb-1 text-base font-bold text-gray-900">{event.title}</h3>
    <p className="text-xs font-medium text-gray-500">{event.location}</p>
  </Link>;
}

export default async function EventPage({ params, searchParams }: Props) {
  const { slug } = await params;
  // Dev-only: `?preview=open` shows the RSVP form even for past events, for layout work.
  const previewOpen = process.env.NODE_ENV !== "production" && (await searchParams).preview === "open";
  const event = await getPublicEventBySlug(slug);
  if (!event) notFound();

  const websiteEvents = await getWebsiteEvents();
  const { upcoming } = partitionWebsiteEvents(websiteEvents);
  const websiteEvent = websiteEvents.find((candidate) => candidate.slug === slug);
  const flyerSrc = websiteEvent?.imageSrc ?? (event.flyerRemoved ? undefined : event.imageSrc);
  const moreEvents = upcoming.filter((candidate) => candidate.slug !== slug).slice(0, 3);

  const isCancelled = !previewOpen && event.status === "Cancelled";
  const isPast = !previewOpen && (event.status === "Past" || hasEnded(event.end));

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <header className="border-b border-black/10 bg-white px-4 pb-9 pt-8 sm:px-6 sm:pb-11 sm:pt-10 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Link href="/events" className="text-link-subtle -ml-1 mb-6 inline-flex min-h-11 items-center gap-1.5 px-1 text-sm font-medium text-gray-600 hover:text-primary">
            <ArrowLeft size={16} />
            All events
          </Link>
          <h1 className="max-w-4xl text-4xl font-bold leading-[1.05] tracking-[-0.03em] text-primary sm:text-6xl">
            {event.name}
          </h1>
          <div className="mt-5 flex flex-col gap-2 text-base font-medium text-gray-600 sm:flex-row sm:gap-6">
            <p className="flex items-center gap-2">
              <CalendarDays className="size-5 shrink-0 text-secondary" />
              <span className="tabular-nums">{formatDateRange(event.start, event.end, true)}</span>
            </p>
            {event.location && <p className="flex items-center gap-2">
              <MapPin className="size-5 shrink-0 text-secondary" />
              <span>{event.location}</span>
            </p>}
          </div>
        </div>
      </header>

      <Section className="border-b border-gray-200 bg-gray-50">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-12">
          <Reveal className="mx-auto w-full max-w-md lg:max-w-none">
            {flyerSrc
              ? <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white"><Flyer src={flyerSrc} title={event.name} sizes="(min-width: 1024px) 460px, 100vw" /></div>
              : <FlyerPlaceholder title={event.name} />}
          </Reveal>

          <Reveal delay={0.08} className="lg:sticky lg:top-24 lg:self-start">
            {event.description && <>
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-[0.14em] text-secondary">About this event</h2>
              <p className="text-lg leading-relaxed text-gray-700">{event.description}</p>
            </>}

            <div className="surface-panel mt-8 rounded-[28px] bg-white p-5 sm:p-8">
              {isCancelled
                ? <ClosedNotice title="This event was cancelled" body="Check out what else VAISI has coming up." />
                : isPast
                  ? <ClosedNotice title="This event has already happened" body="RSVPs are closed. Check out what VAISI has coming up next." />
                  : <RsvpForm
                      event={event}
                      header={<div>
                        <h2 id="rsvp-title" className="text-2xl font-bold tracking-[-0.02em] text-primary sm:text-3xl">Reserve your spot</h2>
                        <p className="mt-1.5 text-sm text-gray-500">Free and open to everyone. Takes about 30 seconds.</p>
                      </div>}
                    />}
            </div>
          </Reveal>
        </div>
      </Section>

      {moreEvents.length > 0 && <Section className="bg-white">
        <div className="mx-auto max-w-6xl">
          <Reveal><h2 className="mb-6 text-2xl font-bold text-gray-900 sm:text-3xl">More upcoming events</h2></Reveal>
          <StaggerGroup className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {moreEvents.map((other) => <StaggerItem key={`${other.source}-${other.id}`}><MoreEventCard event={other} /></StaggerItem>)}
          </StaggerGroup>
        </div>
      </Section>}
    </div>
  );
}
