import { NextResponse } from "next/server";
import { getTeamByCode, normalizeTeamCode } from "@/lib/hackathon/store";

// Lets the brief upload form confirm which team a code belongs to before uploading.
export async function GET(request: Request) {
  const code = normalizeTeamCode(new URL(request.url).searchParams.get("code") ?? "");
  if (code.length !== 6) return NextResponse.json({ error: "Team codes are 6 characters." }, { status: 400 });

  const team = await getTeamByCode(code);
  if (!team) return NextResponse.json({ error: "No team found with that code." }, { status: 404 });

  return NextResponse.json(team);
}
