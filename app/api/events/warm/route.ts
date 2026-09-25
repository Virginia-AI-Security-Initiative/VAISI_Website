import { getWebsiteEvents } from "@/lib/events/data";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await getWebsiteEvents();
    return new Response(null, { status: 204, headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("Could not warm events cache", error);
    return new Response(null, { status: 503, headers: { "Cache-Control": "no-store" } });
  }
}
