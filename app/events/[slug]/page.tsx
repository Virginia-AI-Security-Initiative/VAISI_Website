import type { Metadata } from "next";
import { notFound } from "next/navigation";
import RsvpModal from "@/components/rsvp/RsvpModal";
import { getPublicEventBySlug } from "@/lib/rsvp/airtable";
import EventsPage from "../page";

type Props = { params: Promise<{ slug: string }> };

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
    <>
      <EventsPage />
      <RsvpModal event={event} showTrigger={false} closeHref="/events" />
    </>
  );
}
