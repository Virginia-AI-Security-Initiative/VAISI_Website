import { NextResponse } from "next/server";
import { HackathonError, submitBrief } from "@/lib/hackathon/store";
import { DEADLINES, isOpen, MAX_BRIEF_BYTES, MAX_BRIEF_LABEL } from "@/lib/hackathon/rules";

export async function POST(request: Request) {
  if (!isOpen("submission")) {
    return NextResponse.json({ error: DEADLINES.submission.message, closed: true }, { status: 403 });
  }
  try {
    const form = await request.formData();

    // Quietly accept bot submissions from the hidden honeypot without writing data.
    if (typeof form.get("website") === "string" && String(form.get("website")).trim()) {
      return NextResponse.json({ ok: true });
    }

    const teamCode = typeof form.get("teamCode") === "string" ? String(form.get("teamCode")) : "";
    const file = form.get("brief");
    if (!teamCode) return NextResponse.json({ error: "Enter your team code." }, { status: 400 });
    if (!(file instanceof File) || file.size === 0) return NextResponse.json({ error: "Attach your policy brief." }, { status: 400 });
    if (file.size > MAX_BRIEF_BYTES) return NextResponse.json({ error: `Your PDF must be ${MAX_BRIEF_LABEL} or smaller.` }, { status: 400 });

    const header = Buffer.from(await file.slice(0, 5).arrayBuffer()).toString("latin1");
    if (header !== "%PDF-") return NextResponse.json({ error: "Please upload your brief as a PDF." }, { status: 400 });

    const result = await submitBrief(teamCode, file);
    return NextResponse.json({ ok: true, team: { name: result.name }, submittedAt: result.submittedAt });
  } catch (error) {
    if (error instanceof HackathonError) return NextResponse.json({ error: error.message }, { status: 400 });
    console.error("Hackathon brief upload failed", error);
    return NextResponse.json({ error: "We couldn't upload your brief. Please try again." }, { status: 500 });
  }
}
