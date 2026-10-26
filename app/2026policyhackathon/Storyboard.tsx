"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { INTRO_SEEN_COOKIE, storyboard } from "./content";

type Warning = { year: string; org: string; stat: string; finding: string; source: { label: string; url: string } };

// The headline beats lead (shown larger), then the rest of the warnings.
const WARNINGS: Warning[] = [
  ...storyboard.beats,
  ...storyboard.flood,
];
const TOTAL = WARNINGS.length;
const LEAD_COUNT = storyboard.beats.length;

// Timing: each warning lands faster than the last (exponential decay), so they pile up.
const START_DELAY = 2200;
const FIRST_GAP = 2400;
const DECAY = 0.68;
const MIN_GAP = 140;
const gapBefore = (index: number) => (index === 0 ? START_DELAY : Math.max(MIN_GAP, FIRST_GAP * Math.pow(DECAY, index - 1)));

// Where each card lands on the screen (percent of width/height) and its tilt.
const POSITIONS = [
  { x: 30, y: 36, r: -3 },
  { x: 70, y: 32, r: 3 },
  { x: 33, y: 68, r: 2 },
  { x: 68, y: 66, r: -2 },
  { x: 50, y: 22, r: 4 },
  { x: 18, y: 52, r: -5 },
  { x: 82, y: 50, r: 5 },
  { x: 52, y: 82, r: -3 },
  { x: 24, y: 22, r: 2 },
  { x: 78, y: 82, r: -4 },
  { x: 76, y: 20, r: -2 },
  { x: 22, y: 82, r: 3 },
  { x: 62, y: 44, r: -1 },
  { x: 50, y: 52, r: 1 },
];

function markIntroSeen() {
  document.cookie = `${INTRO_SEEN_COOKIE}=1; path=/2026policyhackathon; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
}

function goToHackathon(smooth = true) {
  markIntroSeen();
  document.getElementById("hackathon")?.scrollIntoView({ behavior: smooth ? "smooth" : "auto", block: "start" });
}

function SourceLink({ source }: { source: Warning["source"] }) {
  return (
    <a
      href={source.url}
      target="_blank"
      rel="noopener noreferrer"
      className="mt-2 inline-flex items-center gap-1 text-[11px] font-medium text-white/45 underline-offset-2 hover:text-white/80 hover:underline"
    >
      {source.label}
    </a>
  );
}

function WarningCard({ warning, lead }: { warning: Warning; lead: boolean }) {
  return (
    <figure
      className={`rounded-2xl bg-[#141a2e]/95 shadow-[0_20px_60px_rgba(0,0,0,0.55)] ring-1 backdrop-blur ${
        lead ? "p-5 ring-secondary/40 sm:p-6" : "p-4 ring-white/12"
      }`}
    >
      <p className={`font-bold leading-none tracking-[-0.03em] text-white ${lead ? "text-4xl sm:text-5xl" : "text-3xl sm:text-4xl"}`}>{warning.stat}</p>
      <p className={`mt-2 leading-snug text-white/80 ${lead ? "text-sm sm:text-base" : "text-sm"}`}>{warning.finding}</p>
      <figcaption className="mt-2.5 text-xs leading-snug text-white/55">
        {warning.org} in <span className="font-bold tabular-nums text-secondary">{warning.year}</span>
      </figcaption>
      <SourceLink source={warning.source} />
    </figure>
  );
}

function Cascade() {
  const [shown, setShown] = useState(0);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    const timers: number[] = [];
    let at = 0;
    WARNINGS.forEach((_, index) => {
      at += gapBefore(index);
      timers.push(window.setTimeout(() => setShown(index + 1), at));
    });
    timers.push(window.setTimeout(() => setFinished(true), at + 1100));
    // Hand off to the hackathon header, unless the visitor has already scrolled away.
    timers.push(window.setTimeout(() => {
      if (window.scrollY < window.innerHeight * 0.3) goToHackathon();
      else markIntroSeen();
    }, at + 4200));
    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, []);

  const intensity = shown / TOTAL;

  return (
    <>
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(220,108,58,0.4),transparent_65%)] transition-opacity duration-700"
        style={{ opacity: intensity * 0.7 }}
      />

      {/* Opening line, which fades back as the warnings arrive */}
      <motion.div
        animate={{ opacity: shown === 0 ? 1 : 0.12, scale: shown === 0 ? 1 : 0.96 }}
        transition={{ duration: 0.8 }}
        className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-6 text-center"
      >
        <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-4 text-sm font-semibold uppercase tracking-[0.16em] text-secondary">
          {storyboard.eyebrow}
        </motion.p>
        <motion.h2 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }} className="max-w-4xl text-4xl font-bold leading-[1.04] tracking-[-0.035em] text-white sm:text-7xl">
          {storyboard.headline}
        </motion.h2>
        <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.6 }} className="mt-5 max-w-2xl text-lg text-white/70 sm:text-2xl">
          {storyboard.subhead}
        </motion.p>
      </motion.div>

      {/* Warnings */}
      {WARNINGS.slice(0, shown).map((warning, index) => {
        const position = POSITIONS[index % POSITIONS.length];
        const lead = index < LEAD_COUNT;
        return (
          <div
            key={warning.stat}
            className={`absolute -translate-x-1/2 -translate-y-1/2 ${lead ? "w-[min(82vw,24rem)]" : "w-[min(76vw,20rem)]"}`}
            style={{ left: `${position.x}%`, top: `${position.y}%`, rotate: `${position.r}deg`, zIndex: index + 1 }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 1.4 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", duration: 0.45, bounce: 0.15 }}
            >
              <WarningCard warning={warning} lead={lead} />
            </motion.div>
          </div>
        );
      })}

      {/* Closing line */}
      <AnimatePresence>
        {finished && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }} className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#0b1020]/88 px-6 text-center">
            <p className="max-w-3xl text-4xl font-bold leading-tight tracking-[-0.02em] text-white sm:text-6xl">{storyboard.outro}</p>
            <motion.button
              type="button"
              onClick={() => goToHackathon()}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.8 }}
              className="mt-10 inline-flex min-h-11 items-center gap-2 rounded-xl px-4 text-sm font-semibold text-white/60 hover:text-white"
            >
              Continue ↓
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// Reduced motion: everything at once, no animation.
function StaticWarnings() {
  return (
    <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <p className="mb-4 text-sm font-semibold uppercase tracking-[0.16em] text-secondary">{storyboard.eyebrow}</p>
      <h2 className="max-w-4xl text-4xl font-bold leading-tight tracking-[-0.03em] text-white sm:text-6xl">{storyboard.headline}</h2>
      <p className="mt-4 max-w-2xl text-lg text-white/70">{storyboard.subhead}</p>
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {WARNINGS.map((warning, index) => <WarningCard key={warning.stat} warning={warning} lead={index < LEAD_COUNT} />)}
      </div>
      <p className="mt-10 text-2xl font-bold text-white">
        {storyboard.outro}
      </p>
    </div>
  );
}

// Returning visitors: one slim band instead of the full intro, with a way to watch it again.
function CompactIntro({ onReplay }: { onReplay: () => void }) {
  return (
    <section aria-label="Why AI policy matters" className="bg-[#0b1020] text-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <p className="text-base font-semibold text-white/85 sm:text-lg">
          {storyboard.outro}
        </p>
        <button
          type="button"
          onClick={onReplay}
          className="tap-scale inline-flex min-h-11 shrink-0 items-center gap-2 self-start rounded-xl bg-white/10 px-4 py-2 text-sm font-semibold text-white ring-1 ring-white/15 hover:bg-white/15 sm:self-auto"
        >
          {storyboard.replay}
        </button>
      </div>
    </section>
  );
}

export default function Storyboard({ seen = false }: { seen?: boolean }) {
  const reduced = Boolean(useReducedMotion());
  const [replaying, setReplaying] = useState(false);
  const replay = useCallback(() => {
    setReplaying(true);
    requestAnimationFrame(() => window.scrollTo({ top: 0 }));
  }, []);

  // Remember the visitor once they reach the hackathon header by any route.
  useEffect(() => {
    const target = document.getElementById("hackathon");
    if (!target) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        markIntroSeen();
        observer.disconnect();
      }
    }, { threshold: 0.25 });
    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  if (seen && !replaying) return <CompactIntro onReplay={replay} />;

  return (
    <section aria-label="Why AI policy matters" className="relative isolate overflow-hidden bg-[#0b1020] text-white">
      {reduced ? (
        <StaticWarnings />
      ) : (
        <div className="relative h-[calc(100svh-4rem)] min-h-[560px]">
          <Cascade key={replaying ? "replay" : "first"} />
          <button
            type="button"
            onClick={() => goToHackathon()}
            className="absolute right-4 top-4 z-[60] min-h-11 rounded-lg px-3 text-sm font-medium text-white/50 underline-offset-4 hover:text-white hover:underline sm:right-8"
          >
            {storyboard.skip} ↓
          </button>
        </div>
      )}
    </section>
  );
}
