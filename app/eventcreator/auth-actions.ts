"use server";

import { redirect } from "next/navigation";
import { createEventCreatorSession, verifyEventCreatorPassword } from "@/lib/eventcreator/auth";

export async function signInToEventCreator(formData: FormData) {
  const password = String(formData.get("password") ?? "");
  if (!(await verifyEventCreatorPassword(password))) {
    await new Promise((resolve) => setTimeout(resolve, 600));
    redirect("/eventcreator?error=invalid-password");
  }
  await createEventCreatorSession();
  redirect("/eventcreator");
}
