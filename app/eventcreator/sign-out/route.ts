import { NextResponse } from "next/server";
import { clearEventCreatorSession } from "@/lib/eventcreator/auth";

export async function GET(request: Request) {
  await clearEventCreatorSession();
  return NextResponse.redirect(new URL("/eventcreator", request.url));
}
