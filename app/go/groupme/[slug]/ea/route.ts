import { EA_COHOSTED_EVENT_SLUG, EA_GROUPME_URL } from "@/lib/rsvp/config";
import { recordGroupmeClick } from "@/lib/rsvp/airtable";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  if (slug !== EA_COHOSTED_EVENT_SLUG) {
    return new Response(null, { status: 404 });
  }

  try {
    await recordGroupmeClick(slug, "Effective Altruism");
  } catch (error) {
    console.error("Could not record Effective Altruism GroupMe click", {
      slug,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }

  return new Response(null, {
    status: 302,
    headers: {
      Location: EA_GROUPME_URL,
      "Cache-Control": "private, no-store",
      "Referrer-Policy": "no-referrer",
    },
  });
}
