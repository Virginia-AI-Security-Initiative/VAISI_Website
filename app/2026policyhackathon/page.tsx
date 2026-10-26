import type { Metadata } from "next";
import { cookies } from "next/headers";
import type { ReactNode } from "react";
import Section from "@/components/Section";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/motion";
import { type CalendarEvent, dateTile, googleCalendarUrl } from "./calendar";
import { type Copy, hackathon, INTRO_SEEN_COOKIE } from "./content";
import Dropdown from "./Dropdown";
import HeroNetwork from "./HeroNetwork";
import Storyboard from "./Storyboard";
import RegisterForm from "./RegisterForm";
import SubmitBriefForm from "./SubmitBriefForm";
import { DEADLINES, isOpen } from "@/lib/hackathon/rules";

export const metadata: Metadata = {
  title: `2026 ${hackathon.title} | VAISI`,
  description: hackathon.tagline,
};

function Text({ value }: { value: Copy }) {
  if (typeof value === "string") return <>{value}</>;
  return (
    <span className="inline-flex items-center rounded-md border border-dashed border-secondary/70 bg-secondary/8 px-1.5 py-0.5 text-[0.85em] font-medium text-secondary">
      TBD: {value.tbd}
    </span>
  );
}

function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="mb-3 text-sm font-semibold uppercase tracking-[0.14em] text-secondary">{children}</p>;
}

function CardHeading({ children, light = false }: { children: ReactNode; light?: boolean }) {
  return <h3 className={`mb-2 text-lg font-bold ${light ? "text-white" : "text-primary"}`}>{children}</h3>;
}

function AddToCalendar({ event, light = false }: { event: CalendarEvent; light?: boolean }) {
  const linkClass = `inline-flex min-h-9 items-center gap-1.5 rounded-lg px-2.5 text-xs font-semibold transition-colors ${
    light ? "bg-white/10 text-white hover:bg-white/20" : "bg-primary/6 text-primary hover:bg-primary/12"
  }`;
  return (
    <div className="mt-3 flex flex-wrap gap-2">
      <a href={googleCalendarUrl(event)} target="_blank" rel="noopener noreferrer" className={linkClass}>
        Google Calendar
      </a>
      <a href={`/2026policyhackathon/calendar/${event.id}.ics`} className={linkClass}>
        Apple / Outlook
      </a>
    </div>
  );
}

function ClosedNotice({ message }: { message: string }) {
  return (
    <div className="py-6 text-center">
      <p className="text-2xl font-bold tracking-[-0.02em] text-primary">Closed</p>
      <p className="mx-auto mt-2 max-w-sm text-base leading-relaxed text-gray-600">{message}</p>
    </div>
  );
}

function LinkOrTbd({ label, url }: { label: string; url: Copy }) {
  return typeof url === "string"
    ? <a href={url} target="_blank" rel="noopener noreferrer" className="text-link-subtle inline-flex min-h-11 items-center font-semibold text-primary">{label}</a>
    : <span className="font-medium text-primary">{label} <Text value={url} /></span>;
}

export default async function PolicyHackathonPage() {
  const h = hackathon;
  const introSeen = (await cookies()).get(INTRO_SEEN_COOKIE)?.value === "1";
  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* Hero */}
      <Storyboard seen={introSeen} />

      <header id="hackathon" className="relative isolate scroll-mt-16 overflow-hidden bg-primary px-4 pb-14 pt-14 text-white sm:px-6 sm:pb-20 sm:pt-20 lg:px-8">
        <HeroNetwork />
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(35,45,75,0.7)_10%,transparent_65%)]" />
        <Reveal className="relative">
        <div className="relative mx-auto max-w-7xl">
          <h1 className="max-w-4xl text-5xl font-bold leading-[0.98] tracking-[-0.035em] sm:text-7xl">2026 {h.title}</h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/80 sm:text-xl">{h.tagline}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#register" className="tap-scale button-raised inline-flex min-h-12 items-center justify-center rounded-xl bg-secondary px-6 py-3 font-semibold text-white hover:bg-secondary/92">
              Register
            </a>
            <a href="#submit" className="tap-scale inline-flex min-h-12 items-center justify-center rounded-xl bg-white/10 px-6 py-3 font-semibold text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.25)] hover:bg-white/15">
              Submit your brief
            </a>
          </div>
          <dl className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-white/15 sm:grid-cols-4">
            {h.facts.map((fact) => (
              <div key={fact.label} className="bg-primary/75 px-4 py-4 backdrop-blur-sm sm:px-5">
                <dt className="text-xs font-medium uppercase tracking-[0.12em] text-white/60">{fact.label}</dt>
                <dd className="mt-1 text-lg font-bold tabular-nums sm:text-xl">{fact.value}</dd>
              </div>
            ))}
          </dl>
        </div>
        </Reveal>
      </header>

      {/* Overview */}
      <Section className="border-b border-gray-200">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <Eyebrow>Introduction</Eyebrow>
            <p className="text-xl leading-relaxed text-gray-700">{h.intro}</p>
          </Reveal>
          <div className="space-y-4">
            <Reveal delay={0.08}>
              <div className="surface-panel rounded-2xl bg-gray-50 p-6">
                <CardHeading>{h.eligibility.heading}</CardHeading>
                <p className="leading-relaxed text-gray-600">{h.eligibility.body}</p>
              </div>
            </Reveal>
            <Reveal delay={0.12}>
              <div className="surface-panel rounded-2xl bg-gray-50 p-6">
                <CardHeading>{h.timeCommitment.heading}</CardHeading>
                <p className="leading-relaxed text-gray-600">{h.timeCommitment.body}</p>
              </div>
            </Reveal>
          </div>
        </div>
      </Section>

      {/* Sections */}
      <Section>
        <div className="mx-auto max-w-6xl space-y-3">
          <Dropdown id="schedule" number={1} title="Schedule">
            <p className="mb-6 max-w-3xl text-gray-600">{h.schedule.intro}</p>
            <a
              href="/2026policyhackathon/calendar/all.ics"
              className="tap-scale mb-5 inline-flex min-h-11 items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/92"
            >
              {h.schedule.addAll}
            </a>
            <StaggerGroup className="space-y-3">
              {h.timeline.map((item) => {
                const tile = item.date ? dateTile(item.date, true) : null;
                return (
                  <StaggerItem key={item.title}>
                    <div className="surface-panel flex gap-4 rounded-2xl bg-white p-4 sm:gap-5 sm:p-5">
                      <div className={`flex w-16 shrink-0 flex-col items-center self-start overflow-hidden rounded-xl text-center sm:w-20 ${tile ? "bg-white shadow-[inset_0_0_0_1px_rgba(0,0,0,0.1)]" : "border-2 border-dashed border-secondary/50"}`}>
                        {tile ? (
                          <>
                            <span className="w-full bg-secondary py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-white">{tile.month}</span>
                            <span className="pt-1 text-3xl font-bold leading-none tracking-[-0.03em] text-primary tabular-nums">{tile.day}</span>
                            <span className="pb-1.5 pt-0.5 text-xs font-medium text-gray-500">{tile.weekday}</span>
                          </>
                        ) : (
                          <span className="flex h-full min-h-[76px] items-center text-sm font-bold text-secondary">TBD</span>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-bold text-primary">{item.title}</h3>
                        <p className="mt-0.5 flex flex-wrap items-center gap-x-1 gap-y-1 text-sm font-semibold text-secondary">
                          <span><Text value={item.time} /></span>
                          {item.location && <span>at the {item.location}</span>}
                        </p>
                        <p className="mt-1 text-sm leading-relaxed text-gray-600"><Text value={item.body} /></p>
                        {item.calendar && <AddToCalendar event={item.calendar} />}
                      </div>
                    </div>
                  </StaggerItem>
                );
              })}
            </StaggerGroup>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <Reveal>
                <div className="h-full rounded-2xl bg-primary p-6 text-white">
                  <CardHeading light>{h.coworking.heading}</CardHeading>
                  <p className="text-sm font-semibold text-white/90">{h.coworking.when} in {h.coworking.where}</p>
                  <p className="mt-2 text-sm leading-relaxed text-white/75">{h.coworking.body}</p>
                  <AddToCalendar event={h.coworking.calendar} light />
                </div>
              </Reveal>
              <Reveal delay={0.06}>
                <div className="surface-panel h-full rounded-2xl bg-white p-6">
                  <CardHeading>{h.workshops.heading}</CardHeading>
                  <p className="text-sm leading-relaxed text-gray-600">{h.workshops.body}</p>
                  <ul className="mt-4 divide-y divide-gray-100 border-t border-gray-100">
                    {h.workshops.events.map((event) => (
                      <li key={event.title} className="flex flex-wrap items-center justify-between gap-3 py-3">
                        <div className="min-w-0">
                          <p className="font-semibold text-primary">{event.title}</p>
                          <p className="mt-0.5 flex flex-wrap gap-x-3 gap-y-1 text-xs font-medium text-gray-500">
                            <span>When: <Text value={event.when} /></span>
                            <span>Where: <Text value={event.where} /></span>
                          </p>
                        </div>
                        {event.slug ? (
                          <a href={`/events/${event.slug}`} className="tap-scale button-raised inline-flex min-h-10 shrink-0 items-center rounded-xl bg-primary px-4 text-sm font-semibold text-white hover:bg-primary/92">
                            {h.workshops.rsvp}
                          </a>
                        ) : (
                          <span className="inline-flex min-h-10 shrink-0 items-center rounded-xl bg-gray-100 px-4 text-sm font-semibold text-gray-500">
                            {h.workshops.rsvpPending}
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            </div>
          </Dropdown>

          <Dropdown id="prizes" number={2} title="Prizes">
            <StaggerGroup className="grid gap-4 sm:grid-cols-3">
              {h.prizes.map((prize, index) => (
                <StaggerItem key={prize.place}>
                  <div className={`surface-card rounded-2xl p-6 ${index === 0 ? "bg-primary text-white" : "border border-gray-200 bg-white"}`}>
                    <p className={`text-sm font-semibold ${index === 0 ? "text-white/70" : "text-gray-500"}`}>{prize.place}</p>
                    <p className={`text-5xl font-bold tabular-nums tracking-[-0.03em] ${index === 0 ? "text-white" : "text-primary"}`}>{prize.amount}</p>
                  </div>
                </StaggerItem>
              ))}
            </StaggerGroup>
            <Reveal className="mt-4">
              <div className="flex items-start gap-4 rounded-2xl bg-secondary/8 p-5 shadow-[inset_0_0_0_1px_rgba(220,108,58,0.25)]">
                <div>
                  <p className="font-bold text-primary">{h.uvaPrize.title}</p>
                  <p className="text-gray-600">{h.uvaPrize.body}</p>
                </div>
              </div>
            </Reveal>
          </Dropdown>

          <Dropdown id="track" number={3} title="Track & deliverables">
            <Reveal>
              <div className="rounded-2xl bg-primary p-6 text-white sm:p-8">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-secondary">{h.track.label}</p>
                <p className="mt-3 text-2xl font-bold leading-snug sm:text-3xl"><Text value={h.track.question} /></p>
                <p className="mt-4 text-white/75"><Text value={h.track.context} /></p>
              </div>
            </Reveal>
            <p className="mt-6 font-semibold text-primary">{h.deliverablesIntro}</p>
            <StaggerGroup className="mt-3 grid gap-4 sm:grid-cols-2">
              {h.deliverables.map((item) => {
                return (
                  <StaggerItem key={item.title}>
                    <div className="surface-panel h-full rounded-2xl bg-white p-6">
                      <span className="inline-block rounded-full bg-primary/8 px-2.5 py-0.5 text-xs font-semibold text-primary">{item.who}</span>
                      <h3 className="mt-3 text-lg font-bold text-primary">{item.title}</h3>
                      <p className="mt-1 text-gray-600">{item.body}</p>
                    </div>
                  </StaggerItem>
                );
              })}
            </StaggerGroup>
            <Reveal className="mt-4">
              <div className="surface-panel rounded-2xl bg-white p-6">
                <CardHeading>{h.judging.heading}</CardHeading>
                <p className="leading-relaxed text-gray-600">{h.judging.body}</p>
              </div>
            </Reveal>
          </Dropdown>

          <Dropdown id="register" number={4} title="Register">
            <div className="grid gap-8 lg:grid-cols-[minmax(0,4fr)_minmax(0,6fr)] lg:gap-12">
              <Reveal>
                <CardHeading>{h.teamsHeading}</CardHeading>
                <ul className="space-y-2.5">
                  {h.teams.map((rule) => (
                    <li key={rule} className="flex gap-3 leading-relaxed text-gray-600">
                      <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-secondary" />
                      {rule}
                    </li>
                  ))}
                </ul>
              </Reveal>
              <Reveal delay={0.08}>
                <div className="surface-panel rounded-[28px] bg-white p-5 sm:p-8">
                  {isOpen("registration") ? <RegisterForm groupmeUrl={h.groupmeUrl} /> : <ClosedNotice message={DEADLINES.registration.message} />}
                </div>
              </Reveal>
            </div>
          </Dropdown>

          <Dropdown id="brief" number={5} title="Brief">
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="space-y-4">
                <Reveal>
                  <div className="surface-panel rounded-2xl bg-white p-6">
                    <h3 className="text-lg font-bold text-primary">{h.briefContentsHeading}</h3>
                    <ol className="mt-3 space-y-2.5">
                      {h.briefContents.map((item, index) => (
                        <li key={item} className="flex gap-3 text-gray-600">
                          <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">{index + 1}</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ol>
                    <p className="mt-4 text-sm text-gray-500">{h.graphicsNote}</p>
                  </div>
                </Reveal>
                <Reveal delay={0.05}>
                  <div className="rounded-2xl bg-secondary/8 p-6 shadow-[inset_0_0_0_1px_rgba(220,108,58,0.3)]">
                    <CardHeading>{h.formattingHeading}</CardHeading>
                    <p className="text-sm text-gray-600">{h.formattingWarning}</p>
                    <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                      {h.formatting.map((rule) => (
                        <li key={rule} className="flex items-start gap-2 text-sm font-medium text-primary">
                          <span className="mt-2 size-1.5 shrink-0 rounded-full bg-secondary" />
                          {rule}
                        </li>
                      ))}
                    </ul>
                    <p className="mt-4 border-t border-secondary/20 pt-4 text-sm leading-relaxed text-gray-700">
                      <span className="font-bold text-primary">{h.anonymity.lead}</span> {h.anonymity.body}
                    </p>
                  </div>
                </Reveal>
              </div>

              <Reveal delay={0.08}>
                <div className="surface-panel h-full rounded-2xl bg-white p-6">
                  <h3 className="text-lg font-bold text-primary">{h.scoring.heading}</h3>
                  <p className="mt-1 text-sm text-gray-600">{h.scoring.summary}</p>
                  {[
                    { label: h.scoring.writtenLabel, items: h.scoring.written },
                    { label: h.scoring.presentationLabel, items: h.scoring.presentation },
                  ].map((group) => (
                    <div key={group.label} className="mt-5">
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-secondary">{group.label}</p>
                      <dl className="mt-2 divide-y divide-gray-100">
                        {group.items.map((item) => (
                          <div key={item.title} className="py-2.5">
                            <dt className="font-semibold text-primary">{item.title}</dt>
                            <dd className="mt-0.5 text-sm text-gray-600">{item.body}</dd>
                          </div>
                        ))}
                      </dl>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>

            <Reveal className="mt-6">
              <div className="surface-panel rounded-2xl bg-white p-6">
                <h3 className="text-lg font-bold text-primary">{h.materialsHeading}</h3>
                <ul className="mt-3 flex flex-col gap-2 sm:flex-row sm:gap-6">
                  {h.resources.map((resource) => (
                    <li key={resource.label} className="flex items-center gap-2 text-sm">
                      <LinkOrTbd label={resource.label} url={resource.url} />
                    </li>
                  ))}
                </ul>
                <p className="mt-3 text-sm text-gray-600">{h.exampleWarning}</p>
                <p className="mt-2 text-xs text-gray-400">{h.credit}</p>
              </div>
            </Reveal>
          </Dropdown>

          <Dropdown id="submit" number={6} title="Submission">
            <div className="grid gap-8 lg:grid-cols-[minmax(0,4fr)_minmax(0,6fr)] lg:gap-12">
              <Reveal>
                <p className="leading-relaxed text-gray-600">{h.submission.intro}</p>
                <p className="mt-6 flex items-center gap-2 text-sm font-medium text-gray-500">
                  <Text value={h.submission.due} />
                </p>
              </Reveal>
              <Reveal delay={0.08}>
                <div className="surface-panel rounded-[28px] bg-white p-5 sm:p-8">
                  {isOpen("submission") ? <SubmitBriefForm /> : <ClosedNotice message={DEADLINES.submission.message} />}
                </div>
              </Reveal>
            </div>
          </Dropdown>
        </div>
      </Section>

      {/* Questions */}
      <Section>
        <Reveal>
          <div className="mx-auto flex max-w-6xl flex-col items-start gap-5 rounded-2xl bg-primary p-6 text-white sm:flex-row sm:items-center sm:justify-between sm:p-8">
            <div className="flex items-start gap-4">
              <div>
                <h2 className="text-2xl font-bold">{h.questions.heading}</h2>
                <p className="mt-1 text-white/75">{h.questions.body}</p>
              </div>
            </div>
            <a href={h.groupmeUrl} target="_blank" rel="noopener noreferrer" className="tap-scale inline-flex min-h-11 shrink-0 items-center justify-center rounded-xl bg-white px-5 py-2.5 font-semibold text-primary hover:bg-white/90">
              Join the GroupMe
            </a>
          </div>
        </Reveal>
      </Section>
    </div>
  );
}
