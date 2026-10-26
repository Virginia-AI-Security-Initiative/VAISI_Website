import { NextResponse } from "next/server";
import { ACADEMIC_STATUSES } from "@/lib/rsvp/config";
import { createTeam, HackathonError, joinTeam, MAX_TEAM_SIZE } from "@/lib/hackathon/store";
import { DEADLINES, isOpen } from "@/lib/hackathon/rules";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function clean(value: unknown, maxLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

export async function POST(request: Request) {
  if (!isOpen("registration")) {
    return NextResponse.json({ error: DEADLINES.registration.message, closed: true }, { status: 403 });
  }
  try {
    const body = await request.json();

    // Quietly accept bot submissions from the hidden honeypot without writing data.
    if (clean(body.website, 200)) return NextResponse.json({ ok: true });

    const mode = clean(body.mode, 10);
    const participant = {
      name: clean(body.name, 120),
      email: clean(body.email, 254).toLowerCase(),
      academicStatus: clean(body.academicStatus, 50),
      school: clean(body.school, 160),
      majorMinor: clean(body.majorMinor, 160),
    };

    if (!participant.name || !emailPattern.test(participant.email) || !participant.academicStatus || !participant.school || !participant.majorMinor) {
      return NextResponse.json({ error: "Please complete every field." }, { status: 400 });
    }
    if (!(ACADEMIC_STATUSES as readonly string[]).includes(participant.academicStatus)) {
      return NextResponse.json({ error: "Please choose a valid academic status." }, { status: 400 });
    }

    let team;
    if (mode === "join") {
      const teamCode = clean(body.teamCode, 20);
      if (!teamCode) return NextResponse.json({ error: "Enter the team code your teammate shared." }, { status: 400 });
      team = await joinTeam(teamCode, participant);
    } else if (mode === "create" || mode === "solo") {
      const teamName = mode === "solo" ? `${participant.name} (solo)` : clean(body.teamName, 80);
      if (!teamName) return NextResponse.json({ error: "Give your team a name." }, { status: 400 });
      team = await createTeam(teamName, participant, mode === "solo");
    } else {
      return NextResponse.json({ error: "Choose how you're competing." }, { status: 400 });
    }

    return NextResponse.json({
      ok: true,
      team: {
        name: team.name,
        code: team.code,
        members: team.memberNames.map((name) => name.split(" ")[0]),
        spotsLeft: MAX_TEAM_SIZE - team.memberNames.length,
        solo: mode === "solo",
      },
    });
  } catch (error) {
    if (error instanceof HackathonError) return NextResponse.json({ error: error.message }, { status: 400 });
    console.error("Hackathon registration failed", error);
    return NextResponse.json({ error: "We couldn't save your registration. Please try again." }, { status: 500 });
  }
}
