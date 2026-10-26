"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChangeEvent, FormEvent, useState } from "react";
import { fieldClassName } from "@/components/rsvp/RsvpForm";
import { MAX_BRIEF_BYTES as MAX_BYTES, MAX_BRIEF_LABEL } from "@/lib/hackathon/rules";

type TeamLookup = { name: string; memberCount: number; submitted: boolean };

function formatSize(bytes: number) {
  return bytes < 1024 * 1024 ? `${Math.round(bytes / 1024)} KB` : `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export default function SubmitBriefForm() {
  const [team, setTeam] = useState<TeamLookup | null>(null);
  const [lookupError, setLookupError] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"form" | "submitting" | "done">("form");
  const [error, setError] = useState("");
  const [submittedTeam, setSubmittedTeam] = useState("");

  async function lookUpTeam(event: ChangeEvent<HTMLInputElement>) {
    const code = event.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "");
    setTeam(null);
    setLookupError("");
    if (code.length !== 6) return;
    const response = await fetch(`/api/hackathon/team?code=${code}`);
    const result = (await response.json()) as TeamLookup & { error?: string };
    if (response.ok) setTeam(result);
    else setLookupError(result.error ?? "No team found with that code.");
  }

  function chooseFile(event: ChangeEvent<HTMLInputElement>) {
    const chosen = event.target.files?.[0] ?? null;
    setError("");
    if (chosen && chosen.size > MAX_BYTES) {
      setError(`Your PDF must be ${MAX_BRIEF_LABEL} or smaller.`);
      event.target.value = "";
      setFile(null);
      return;
    }
    setFile(chosen);
  }

  async function submit(formEvent: FormEvent<HTMLFormElement>) {
    formEvent.preventDefault();
    if (!team) {
      setError("Enter a valid team code first.");
      return;
    }
    setStatus("submitting");
    setError("");

    try {
      const response = await fetch("/api/hackathon/submit", { method: "POST", body: new FormData(formEvent.currentTarget) });
      const result = (await response.json()) as { error?: string; team?: { name: string } };
      if (!response.ok) throw new Error(result.error);
      setSubmittedTeam(result.team?.name ?? team.name);
      setStatus("done");
    } catch (submissionError) {
      setError(
        submissionError instanceof Error && submissionError.message
          ? submissionError.message
          : "We couldn't upload your brief. Please try again.",
      );
      setStatus("form");
    }
  }

  return (
    <AnimatePresence mode="wait" initial={false}>
      {status === "done" ? (
        <motion.div
          key="done"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.2 }}
          className="py-6 text-center"
        >
          <h3 className="text-3xl font-bold tracking-[-0.02em] text-primary">Brief submitted</h3>
          <p className="mx-auto mt-2 max-w-sm text-base leading-relaxed text-gray-600">
            We received the brief for <span className="font-semibold text-primary">{submittedTeam}</span>. Your team can submit multiple times, but the most recent submission at 5:00 November 20th will be judged.
          </p>
        </motion.div>
      ) : (
        <motion.form
          key="form"
          onSubmit={submit}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.18 }}
          className="relative space-y-5"
        >
          <div className="absolute -left-[10000px]" aria-hidden="true">
            <label htmlFor="brief-website">Website</label>
            <input id="brief-website" name="website" tabIndex={-1} autoComplete="off" />
          </div>

          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-primary">Team code</span>
            <input
              name="teamCode"
              required
              maxLength={6}
              autoComplete="off"
              placeholder="6-character code"
              onChange={lookUpTeam}
              className={`${fieldClassName} font-mono uppercase tracking-[0.2em] placeholder:font-sans placeholder:normal-case placeholder:tracking-normal`}
            />
            {team && (
              <span className="mt-1.5 block text-sm font-medium text-primary">
                {team.name} with {team.memberCount} member{team.memberCount === 1 ? "" : "s"}
                {team.submitted && <span className="font-normal text-gray-500">, and your newest upload is the one judged</span>}
              </span>
            )}
            {lookupError && <span className="mt-1.5 block text-sm font-medium text-red-700">{lookupError}</span>}
          </label>

          <label className="block cursor-pointer">
            <span className="mb-1.5 block text-sm font-medium text-primary">Policy brief (PDF, max {MAX_BRIEF_LABEL})</span>
            <span className="flex min-h-28 flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 px-4 py-5 text-center transition-colors hover:border-secondary/60 hover:bg-white">
              {file ? (
                <>
                  <span className="text-sm font-medium text-primary">{file.name}</span>
                  <span className="text-xs text-gray-500">{formatSize(file.size)}, or click to choose a different file</span>
                </>
              ) : (
                <>
                  <span className="text-sm font-medium text-primary">Choose your PDF</span>
                  <span className="text-xs text-gray-500">2 pages max with no names or identifying info</span>
                </>
              )}
            </span>
            <input name="brief" type="file" accept="application/pdf,.pdf" required onChange={chooseFile} className="sr-only" />
          </label>

          {error && <p role="alert" className="text-sm font-medium text-red-700">{error}</p>}

          <button
            type="submit"
            disabled={status === "submitting"}
            className="tap-scale button-raised flex min-h-12 w-full items-center justify-center rounded-xl bg-primary px-5 py-3 font-medium text-white hover:bg-primary/92 disabled:cursor-wait disabled:opacity-65"
          >
            {status === "submitting" ? "Uploading…" : "Submit brief"}
          </button>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
