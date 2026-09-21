import PageHero from "@/components/PageHero";
import EventGrid from "@/components/events/EventGrid";
import { getWebsiteEvents, partitionWebsiteEvents } from "@/lib/events/data";

export const dynamic = "force-dynamic";

export default async function EventsPage() {
  const events = await getWebsiteEvents();
  const { upcoming, past } = partitionWebsiteEvents(events);

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <PageHero title="Events" />
      <EventGrid upcoming={upcoming} past={past} />
    </div>
  );
}
