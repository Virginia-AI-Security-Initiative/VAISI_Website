import type { Metadata } from "next";
import { CalendarDays, MapPin } from "lucide-react";
import { notFound } from "next/navigation";
import PageHero from "@/components/PageHero";
import Section from "@/components/Section";
import RsvpModal from "@/components/rsvp/RsvpModal";
import { getPublicEventBySlug } from "@/lib/rsvp/airtable";

type Props = { params: Promise<{ slug: string }> };

function formatEventTime(start: string, end: string) {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const date = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "America/New_York",
  }).format(startDate);
  const time = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: "America/New_York",
  });
  return `${date}, ${time.format(startDate)}–${time.format(endDate)}`;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const event = await getPublicEventBySlug((await params).slug);
  if (!event) return { title: "Event | VAISI" };
  return {
    title: `${event.name} | VAISI`,
    description: event.description,
  };
}

export default async function EventRsvpPage({ params }: Props) {
  const event = await getPublicEventBySlug((await params).slug);
  if (!event) notFound();

  return (
    <div className="min-h-screen bg-white">
      <PageHero title={event.name} />
      <Section className="bg-gray-50">
        <div className="mx-auto max-w-3xl rounded-3xl bg-white p-6 shadow-[0_0_0_1px_rgba(0,0,0,0.08),0_12px_36px_rgba(0,0,0,0.08)] sm:p-9">
          <div className="space-y-2 text-sm font-medium text-gray-600 sm:text-base">
            <p className="flex items-start gap-2">
              <CalendarDays className="mt-0.5 size-5 shrink-0 text-secondary" />
              <span className="tabular-nums">{formatEventTime(event.start, event.end)}</span>
            </p>
            <p className="flex items-start gap-2">
              <MapPin className="mt-0.5 size-5 shrink-0 text-secondary" />
              <span>{event.location}</span>
            </p>
          </div>
          <p className="mt-5 text-lg leading-relaxed text-gray-600">{event.description}</p>
          <div className="mt-7">
            <RsvpModal event={event} />
          </div>
        </div>
      </Section>
    </div>
  );
}
