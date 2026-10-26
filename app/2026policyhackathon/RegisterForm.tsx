"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, Copy } from "lucide-react";
import { FormEvent, useState } from "react";
import { Field, fieldClassName } from "@/components/rsvp/RsvpForm";
import { ACADEMIC_STATUSES } from "@/lib/rsvp/config";

type Mode = "create" | "join" | "solo";

type RegisteredTeam = {
  name: string;
  code: string;
  members: string[];
  spotsLeft: number;
  solo: boolean;
};

const modes: Array<{ id: Mode; label: string; detail: string }> = [
  { id: "create", label: "Start a team", detail: "Get a code to share" },
  { id: "join", label: "Join a team", detail: "Use a teammate's code" },
  { id: "solo", label: "Compete solo", detail: "A team of one" },
];

export default function RegisterForm({ groupmeUrl }: { groupmeUrl: string }) {
  const [mode, setMode] = useState<Mode>("create");
  const [status, setStatus] = useState<"form" | "submitting" | "done">("form");
  const [error, setError] = useState("");
  const [team, setTeam] = useState<RegisteredTeam | null>(null);
  const [copied, setCopied] = useState(false);

  async function submit(formEvent: FormEvent<HTMLFormElement>) {
    formEvent.preventDefault();
    setStatus("submitting");
    setError("");
    const form = new FormData(formEvent.currentTarget);

    try {
      const response = await fetch("/api/hackathon/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode, ...Object.fromEntries(form) }),
      });
      const result = (await response.json()) as { error?: string; team?: RegisteredTeam };
      if (!response.ok || !result.team) throw new Error(result.error);
      setTeam(result.team);
      setStatus("done");
    } catch (submissionError) {
      setError(
        submissionError instanceof Error && submissionError.message
          ? submissionError.message
          : "We couldn't save your registration. Please try again.",
      );
      setStatus("form");
    }
  }

  async function copyCode() {
    if (!team) return;
    try {
      await navigator.clipboard.writeText(team.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard can be unavailable (permissions, insecure origin); the code stays visible to copy by hand.
    }
  }

  return (
    <AnimatePresence mode="wait" initial={false}>
      {status === "done" && team ? (
        <motion.div
          key="done"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.2 }}
          className="py-4 text-center sm:py-6"
        >
          <h3 className="text-3xl font-bold tracking-[-0.02em] text-primary">You’re registered</h3>
          <p className="mx-auto mt-2 max-w-sm text-base leading-relaxed text-gray-600">
            You’re on <span className="font-semibold text-primary">{team.name}</span>
            {team.members.length > 1 && <> with {team.members.slice(0, -1).join(", ")}</>}.
          </p>

          <div className="mx-auto mt-6 max-w-sm rounded-2xl bg-gray-50 p-5 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.08)]">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-secondary">Your team code</p>
            <div className="mt-2 flex items-center justify-center gap-3">
              <span className="font-mono text-3xl font-bold tracking-[0.2em] text-primary">{team.code}</span>
              <button
                type="button"
                onClick={copyCode}
                className="tap-scale flex size-11 items-center justify-center rounded-xl text-gray-500 hover:bg-white hover:text-primary"
                aria-label="Copy team code"
              >
                {copied ? <Check size={20} /> : <Copy size={20} />}
              </button>
            </div>
            <p className="mt-2 text-sm text-gray-500">
              {team.solo
                ? "Save this. You’ll need it to upload your brief."
                : team.spotsLeft > 0
                  ? `Share it with up to ${team.spotsLeft} more teammate${team.spotsLeft === 1 ? "" : "s"}. You’ll also need it to upload your brief.`
                  : "Your team is full. You’ll need this code to upload your brief."}
            </p>
          </div>

          <a
            href={groupmeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="tap-scale button-raised mt-6 inline-flex min-h-11 items-center justify-center rounded-xl bg-primary px-5 py-2.5 font-medium text-white hover:bg-primary/92"
          >
            Join the GroupMe
          </a>
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
            <label htmlFor="hackathon-website">Website</label>
            <input id="hackathon-website" name="website" tabIndex={-1} autoComplete="off" />
          </div>

          <fieldset>
            <legend className="mb-2 block text-sm font-medium text-primary">How are you competing?</legend>
            <div className="grid grid-cols-3 gap-2">
              {modes.map(({ id, label, detail }) => (
                <label
                  key={id}
                  className={`tap-scale flex cursor-pointer flex-col items-center gap-1 rounded-xl p-3 text-center transition-[background-color,box-shadow] ${
                    mode === id
                      ? "bg-primary text-white shadow-[0_6px_18px_rgba(35,45,75,0.22)]"
                      : "bg-gray-50 text-primary shadow-[inset_0_0_0_1px_rgba(0,0,0,0.1)] hover:bg-white"
                  }`}
                >
                  <input type="radio" name="modeChoice" value={id} checked={mode === id} onChange={() => setMode(id)} className="sr-only" />
                  <span className="text-sm font-semibold leading-tight">{label}</span>
                  <span className={`hidden text-xs sm:block ${mode === id ? "text-white/70" : "text-gray-500"}`}>{detail}</span>
                </label>
              ))}
            </div>
          </fieldset>

          {mode === "create" && <Field label="Team name" name="teamName" placeholder="e.g. The Hoo Policy Group" />}
          {mode === "join" && (
            <Field label="Team code" name="teamCode" placeholder="6-character code" hint="Ask the teammate who started your team for this." />
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Name" name="name" autoComplete="name" />
            <Field label="Email" name="email" type="email" autoComplete="email" />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-primary">Academic Status</span>
              <select name="academicStatus" required defaultValue="" className={fieldClassName}>
                <option value="" disabled>Select one</option>
                {ACADEMIC_STATUSES.map((option) => <option key={option}>{option}</option>)}
              </select>
            </label>
            <Field label="School" name="school" autoComplete="organization" placeholder="University of Virginia" />
          </div>

          <Field label="Major/Minor" name="majorMinor" />

          {error && <p role="alert" className="text-sm font-medium text-red-700">{error}</p>}

          <button
            type="submit"
            disabled={status === "submitting"}
            className="tap-scale button-raised flex min-h-12 w-full items-center justify-center rounded-xl bg-primary px-5 py-3 font-medium text-white hover:bg-primary/92 disabled:cursor-wait disabled:opacity-65"
          >
            {status === "submitting" ? "Registering…" : mode === "join" ? "Join team" : mode === "solo" ? "Register" : "Create team & register"}
          </button>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
