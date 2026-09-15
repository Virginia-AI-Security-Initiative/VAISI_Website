import { NextResponse } from "next/server";
import { createRsvp, getPublicEventBySlug } from "@/lib/rsvp/airtable";
import { ACADEMIC_STATUSES } from "@/lib/rsvp/config";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function clean(value: unknown, maxLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Quietly accept bot submissions from the hidden honeypot without writing data.
    if (clean(body.website, 200)) return NextResponse.json({ ok: true });

    const slug = clean(body.slug, 100);
    const name = clean(body.name, 120);
    const email = clean(body.email, 254).toLowerCase();
    const academicStatus = clean(body.academicStatus, 50);
    const majorMinor = clean(body.majorMinor, 160);
    const referral = clean(body.referral, 240);

    if (!slug || !name || !emailPattern.test(email) || !academicStatus || !majorMinor || !referral) {
      return NextResponse.json({ error: "Please complete every field." }, { status: 400 });
    }

    if (!(ACADEMIC_STATUSES as readonly string[]).includes(academicStatus)) {
      return NextResponse.json({ error: "Please choose a valid academic status." }, { status: 400 });
    }

    const event = await getPublicEventBySlug(slug);
    if (!event) return NextResponse.json({ error: "This event is not available." }, { status: 404 });

    await createRsvp({ eventId: event.id, name, email, academicStatus, majorMinor, referral });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("RSVP submission failed", error);
    return NextResponse.json(
      { error: "We couldn't save your RSVP. Please try again." },
      { status: 500 },
    );
  }
}
