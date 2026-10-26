"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check } from "lucide-react";
import { FormEvent, ReactNode, useState } from "react";
import { ACADEMIC_STATUSES, EA_COHOSTED_EVENT_SLUG } from "@/lib/rsvp/config";
import type { PublicEvent } from "@/lib/rsvp/airtable";

export default function RsvpForm({
  event,
  header,
  titleId = "rsvp-title",
}: {
  event: PublicEvent;
  header?: ReactNode;
  titleId?: string;
}) {
  const [status, setStatus] = useState<"form" | "submitting" | "confirmed">("form");
  const [error, setError] = useState("");

  async function submit(formEvent: FormEvent<HTMLFormElement>) {
    formEvent.preventDefault();
    setStatus("submitting");
    setError("");

    const form = new FormData(formEvent.currentTarget);
    try {
      const response = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: event.slug,
          name: form.get("name"),
          email: form.get("email"),
          academicStatus: form.get("academicStatus"),
          majorMinor: form.get("majorMinor"),
          referral: form.get("referral"),
          website: form.get("website"),
        }),
      });

      const result = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(result.error);
      setStatus("confirmed");
    } catch (submissionError) {
      setError(
        submissionError instanceof Error && submissionError.message
          ? submissionError.message
          : "We couldn't save your RSVP. Please try again.",
      );
      setStatus("form");
    }
  }

  return (
    <AnimatePresence mode="wait" initial={false}>
      {status === "confirmed" ? (
        <motion.div
          key="confirmed"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.2 }}
          className="py-8 text-center sm:py-10"
        >
          <div className="mx-auto mb-5 flex size-14 items-center justify-center rounded-2xl bg-secondary text-white shadow-[0_8px_24px_rgba(220,108,58,0.28)]">
            <Check size={28} strokeWidth={2.5} />
          </div>
          <h2 id={titleId} className="text-3xl font-bold tracking-[-0.02em] text-primary">
            You’re RSVPed
          </h2>
          <p className="mx-auto mt-3 max-w-sm text-base leading-relaxed text-gray-600">
            {event.slug === EA_COHOSTED_EVENT_SLUG
              ? "Join either cohost’s GroupMe to stay up to date with future events."
              : "Join the VAISI GroupMe to stay up to date with future club news."}
          </p>
          {event.slug === EA_COHOSTED_EVENT_SLUG ? (
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <a
                href={`/go/groupme/${event.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="tap-scale button-raised inline-flex min-h-11 items-center justify-center rounded-xl bg-primary px-5 py-2.5 font-medium text-white hover:bg-primary/92"
              >
                Join VAISI GroupMe
              </a>
              <a
                href={`/go/groupme/${event.slug}/ea`}
                target="_blank"
                rel="noopener noreferrer"
                className="tap-scale button-raised inline-flex min-h-11 items-center justify-center rounded-xl bg-secondary px-5 py-2.5 font-medium text-white hover:bg-secondary/92"
              >
                Join EA GroupMe
              </a>
            </div>
          ) : (
            <a
              href={`/go/groupme/${event.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="tap-scale button-raised mt-6 inline-flex min-h-11 items-center justify-center rounded-xl bg-primary px-5 py-2.5 font-medium text-white hover:bg-primary/92"
            >
              Join GroupMe
            </a>
          )}
        </motion.div>
      ) : (
        <motion.div
          key="form"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.18 }}
        >
          {header}

          <form onSubmit={submit} className={`${header ? "mt-6 " : ""}relative space-y-4`}>
            <div className="absolute -left-[10000px]" aria-hidden="true">
              <label htmlFor={`${titleId}-website`}>Website</label>
              <input id={`${titleId}-website`} name="website" tabIndex={-1} autoComplete="off" />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Name" name="name" autoComplete="name" />
              <Field label="Email" name="email" type="email" autoComplete="email" />
            </div>

            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-primary">Academic Status</span>
              <select
                name="academicStatus"
                required
                defaultValue=""
                className={fieldClassName}
              >
                <option value="" disabled>Select one</option>
                {ACADEMIC_STATUSES.map((option) => <option key={option}>{option}</option>)}
              </select>
            </label>

            <Field label="Major/Minor" name="majorMinor" autoComplete="organization-title" />
            <Field label="How did you hear about this event?" name="referral" />

            {error && <p role="alert" className="text-sm font-medium text-red-700">{error}</p>}

            <button
              type="submit"
              disabled={status === "submitting"}
              className="tap-scale button-raised flex min-h-12 w-full items-center justify-center rounded-xl bg-primary px-5 py-3 font-medium text-white hover:bg-primary/92 disabled:cursor-wait disabled:opacity-65"
            >
              {status === "submitting" ? "Submitting…" : "RSVP"}
            </button>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export const fieldClassName =
  "min-h-11 w-full rounded-xl bg-gray-50 px-3.5 text-base text-gray-900 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.12)] outline-none transition-[background-color,box-shadow] focus:bg-white focus:shadow-[inset_0_0_0_2px_var(--secondary)]";

export function Field({
  label,
  name,
  type = "text",
  autoComplete,
  placeholder,
  hint,
}: {
  label: string;
  name: string;
  type?: string;
  autoComplete?: string;
  placeholder?: string;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-primary">{label}</span>
      <input
        name={name}
        type={type}
        autoComplete={autoComplete}
        placeholder={placeholder}
        required
        className={fieldClassName}
      />
      {hint && <span className="mt-1.5 block text-xs text-gray-500">{hint}</span>}
    </label>
  );
}
