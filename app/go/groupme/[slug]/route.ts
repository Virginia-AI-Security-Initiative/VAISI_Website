import { GROUPME_URL } from "@/lib/rsvp/config";
import { recordGroupmeClick } from "@/lib/rsvp/airtable";

export const dynamic = "force-dynamic";

function groupmeRedirect() {
  return new Response(null, {
    status: 302,
    headers: {
      Location: GROUPME_URL,
      "Cache-Control": "private, no-store",
      "Referrer-Policy": "no-referrer",
    },
  });
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  if (/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    try {
      await recordGroupmeClick(slug);
    } catch (error) {
      console.error("Could not record GroupMe click", {
        slug,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  return groupmeRedirect();
}
