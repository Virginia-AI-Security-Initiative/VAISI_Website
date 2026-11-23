import type { Metadata } from "next";
import { notFound } from "next/navigation";
import RsvpModal from "@/components/rsvp/RsvpModal";
import { getPublicEventBySlug } from "@/lib/rsvp/airtable";
import EventsPage from "../page";

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

// The event opens as a popup layered over the events page; closing it returns to /events.
export default async function EventRsvpPage({ params, searchParams }: Props) {
  const { slug } = await params;
  // Dev-only: `?preview=open` shows the RSVP form even for past events, for layout work.
  const previewOpen = process.env.NODE_ENV !== "production" && (await searchParams).preview === "open";
  const event = await getPublicEventBySlug(slug);
  if (!event) notFound();

  const closed = previewOpen
    ? undefined
    : event.status === "Cancelled"
      ? "cancelled"
      : event.status === "Past" || hasEnded(event.end)
        ? "past"
        : undefined;

  return (
    <>
      <EventsPage />
      <RsvpModal event={event} showTrigger={false} closeHref="/events" closed={closed} />
    </>
  );
}
