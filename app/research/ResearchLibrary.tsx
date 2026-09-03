"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { FileText, FlaskConical, Landmark, Search } from "lucide-react";
import {
  formatPublicationDate,
  KIND_LABELS,
  publications,
  type Publication,
  type PublicationKind,
} from "./data";

const filters: Array<{ value: "all" | PublicationKind; label: string }> = [
  { value: "all", label: "All" },
  { value: "technical", label: "Technical" },
  { value: "policy", label: "Policy" },
  { value: "fellowship", label: "Capstone" },
];

const kindIcons = {
  technical: FlaskConical,
  fellowship: FileText,
  policy: Landmark,
} satisfies Record<PublicationKind, typeof FileText>;

function SectionHeading({
  title,
  id,
  onViewAll,
}: {
  title: string;
  id: string;
  onViewAll: () => void;
}) {
  return (
    <div className="mb-5 flex items-center justify-between border-t border-black/10 pt-6">
      <h2 id={id} className="text-lg font-bold uppercase tracking-[0.05em] text-primary sm:text-xl">
        {title}
      </h2>
      <button
        type="button"
        onClick={onViewAll}
        className="group tap-scale inline-flex min-h-11 items-center gap-2 px-2 text-sm font-semibold text-primary hover:text-secondary"
      >
        View all
      </button>
    </div>
  );
}

function FeaturedResearch({ publication }: { publication: Publication }) {
  return (
    <section aria-labelledby="featured-research" className="grid gap-7 border-b border-black/10 pb-12 lg:grid-cols-[1.08fr_0.92fr] lg:items-stretch">
      <Link
        href={`/research/${publication.slug}`}
        className="image-outline group relative min-h-72 overflow-hidden bg-primary sm:min-h-[26rem] lg:min-h-[32rem]"
      >
        <Image
          src={publication.heroImage!}
          alt={publication.heroImageAlt ?? ""}
          fill
          priority
          sizes="(min-width: 1024px) 54vw, 100vw"
          className="object-contain p-5 transition-transform duration-500 ease-[cubic-bezier(0.2,0,0,1)] group-hover:scale-[1.015] sm:p-9"
        />
      </Link>

      <div className="flex flex-col justify-center lg:pl-4">
        <p className="text-sm font-bold uppercase tracking-[0.16em] text-secondary">
          Featured research
        </p>
        <h2 id="featured-research" className="mt-4 text-4xl font-bold leading-[1.03] tracking-[-0.025em] text-primary sm:text-5xl">
          {publication.title}
        </h2>
        <p className="mt-6 text-lg font-bold text-primary">{publication.authors}</p>
        <p className="mt-1 text-sm text-gray-500">
          {KIND_LABELS[publication.kind]}
          <span aria-hidden="true"> · </span>
          {formatPublicationDate(publication.date)}
        </p>
        <Link
          href={`/research/${publication.slug}`}
          className="tap-scale mt-8 inline-flex min-h-12 w-fit items-center rounded-lg bg-secondary px-6 font-semibold text-white shadow-[0_4px_14px_rgba(220,108,58,0.24)] hover:bg-[#c75f32]"
        >
          Read research
        </Link>
      </div>
    </section>
  );
}

function TechnicalCard({ publication }: { publication: Publication }) {
  return (
    <Link
      href={`/research/${publication.slug}`}
      className="surface-card group flex min-h-full flex-col overflow-hidden bg-white"
    >
      <div className="image-outline relative aspect-[16/9] overflow-hidden bg-primary">
        <Image
          src={publication.heroImage!}
          alt={publication.heroImageAlt ?? ""}
          fill
          sizes="(min-width: 1024px) 32vw, (min-width: 640px) 50vw, 100vw"
          className="object-contain p-3 transition-transform duration-500 ease-[cubic-bezier(0.2,0,0,1)] group-hover:scale-[1.02]"
        />
      </div>
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <p className="text-xs font-bold uppercase tracking-[0.15em] text-secondary">Technical paper</p>
        <h3 className="mt-3 text-xl font-bold leading-tight text-primary transition-colors duration-150 group-hover:text-secondary sm:text-2xl">
          {publication.title}
        </h3>
        <div className="mt-5 text-sm text-gray-500">
          <p className="font-semibold text-gray-800">{publication.authors}</p>
          <p className="mt-1">{formatPublicationDate(publication.date)}</p>
        </div>
        <span className="mt-auto inline-flex items-center pt-7 text-sm font-bold text-primary">
          Read paper
        </span>
      </div>
    </Link>
  );
}

function PolicyRow({ publication, index }: { publication: Publication; index: number }) {
  return (
    <Link
      href={`/research/${publication.slug}`}
      className="group grid gap-5 border-t border-black/10 py-5 first:border-t-0 sm:grid-cols-[11rem_1fr] sm:items-center"
    >
      <div className="relative hidden aspect-[16/9] overflow-hidden bg-primary sm:flex sm:items-center sm:justify-center">
        <Landmark className="relative size-9 text-white/90" aria-hidden="true" />
        <span className="absolute bottom-2 right-3 tabular-nums text-xs font-bold text-white/45">0{index + 1}</span>
      </div>
      <div>
        <div className="flex flex-wrap items-center gap-3">
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-secondary">Policy brief</p>
          {publication.award && (
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-amber-700">
              {publication.award} place
            </p>
          )}
        </div>
        <h3 className="mt-2 text-xl font-bold leading-snug text-primary transition-colors duration-150 group-hover:text-secondary">
          {publication.title}
        </h3>
        <p className="mt-2 text-sm text-gray-500">
          <span className="font-semibold text-gray-800">{publication.authors}</span>
          <span aria-hidden="true"> · </span>
          {formatPublicationDate(publication.date)}
        </p>
      </div>
    </Link>
  );
}

function FellowshipCard({ publication }: { publication: Publication }) {
  return (
    <Link
      href={`/research/${publication.slug}`}
      className="surface-card group grid min-h-full overflow-hidden bg-white sm:grid-cols-[0.9fr_1.1fr] lg:grid-cols-1"
    >
      <div className="image-outline relative min-h-52 overflow-hidden bg-[#eceef2] lg:aspect-[16/8] lg:min-h-0">
        {publication.heroImage ? (
          <Image
            src={publication.heroImage}
            alt={publication.heroImageAlt ?? ""}
            fill
            sizes="(min-width: 1024px) 32vw, (min-width: 640px) 40vw, 100vw"
            className="object-cover object-top transition-transform duration-500 ease-[cubic-bezier(0.2,0,0,1)] group-hover:scale-[1.02]"
          />
        ) : (
          <>
            <div className="absolute inset-0 bg-primary" />
            <FileText className="absolute left-1/2 top-1/2 size-10 -translate-x-1/2 -translate-y-1/2 text-white" aria-hidden="true" />
          </>
        )}
      </div>
      <div className="flex flex-col p-5">
        <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#66799e]">Fellowship project</p>
        <h3 className="mt-3 text-xl font-bold leading-tight text-primary transition-colors duration-150 group-hover:text-secondary">
          {publication.title}
        </h3>
        <div className="mt-auto pt-6 text-sm text-gray-500">
          <p className="font-semibold text-gray-800">{publication.authors}</p>
          <p className="mt-1">{formatPublicationDate(publication.date)}</p>
        </div>
        <span className="mt-5 inline-flex items-center text-sm font-bold text-primary">
          Read project
        </span>
      </div>
    </Link>
  );
}

function ResultItem({ publication }: { publication: Publication }) {
  const Icon = kindIcons[publication.kind];
  return (
    <li>
      <Link
        href={`/research/${publication.slug}`}
        className="group grid min-h-full grid-cols-[3rem_1fr] gap-4 border-t border-black/10 py-7 sm:grid-cols-[3.5rem_1fr] sm:gap-5"
      >
        <span className="flex size-12 items-center justify-center bg-[#eef0f4]">
          <Icon className="size-5 text-primary" aria-hidden="true" />
        </span>
        <div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-secondary">
              {KIND_LABELS[publication.kind]}
            </p>
          </div>
          <h3 className="mt-2 text-xl font-bold leading-snug text-primary transition-colors duration-150 group-hover:text-secondary sm:text-2xl">
            {publication.title}
          </h3>
          <p className="mt-3 text-sm text-gray-500">
            <span className="font-semibold text-gray-800">{publication.authors}</span>
            <span aria-hidden="true"> · </span>
            {formatPublicationDate(publication.date)}
          </p>
        </div>
      </Link>
    </li>
  );
}

export default function ResearchLibrary() {
  const [activeKind, setActiveKind] = useState<"all" | PublicationKind>("all");
  const [query, setQuery] = useState("");

  const technical = publications.filter((publication) => publication.kind === "technical");
  const policy = publications.filter((publication) => publication.kind === "policy");
  const fellowship = publications.filter((publication) => publication.kind === "fellowship");
  const featured = technical[0];

  const normalizedQuery = query.trim().toLowerCase();
  const filteredPublications = publications.filter((publication) => {
    const matchesKind = activeKind === "all" || publication.kind === activeKind;
    const matchesQuery =
      !normalizedQuery ||
      publication.title.toLowerCase().includes(normalizedQuery) ||
      publication.authors.toLowerCase().includes(normalizedQuery) ||
      publication.topics.some((topic) => topic.toLowerCase().includes(normalizedQuery));
    return matchesKind && matchesQuery;
  });

  const showingOverview = activeKind === "all" && !query.trim();

  function showKind(kind: PublicationKind) {
    setActiveKind(kind);
    setQuery("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="px-4 pb-7 pt-12 sm:px-6 sm:pb-9 sm:pt-14 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-xl">
            <h1 className="text-5xl font-bold tracking-[-0.03em] text-primary sm:text-6xl">Research</h1>
          </div>

          <div className="mt-8 flex flex-col gap-6 border-b border-black/10 sm:mt-9 lg:flex-row lg:items-end lg:justify-between">
            <nav aria-label="Filter research by type" className="flex max-w-full gap-8 overflow-x-auto">
              {filters.map((filter) => {
                const active = activeKind === filter.value;
                return (
                  <button
                    key={filter.value}
                    type="button"
                    onClick={() => setActiveKind(filter.value)}
                    aria-pressed={active}
                    className={`tap-scale relative min-h-12 shrink-0 px-0 text-sm font-bold uppercase tracking-[0.04em] ${
                      active ? "text-primary" : "text-gray-500 hover:text-primary"
                    }`}
                  >
                    {filter.label}
                    <span
                      className={`absolute inset-x-0 bottom-0 h-0.5 bg-secondary transition-transform duration-200 ${
                        active ? "scale-x-100" : "scale-x-0"
                      }`}
                    />
                  </button>
                );
              })}
            </nav>

            <label className="relative mb-5 block w-full lg:w-80">
              <span className="sr-only">Search research</span>
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search research…"
                className="h-12 w-full bg-white pl-4 pr-11 text-sm text-gray-900 shadow-[inset_0_0_0_1px_rgba(35,45,75,0.22)] outline-none transition-shadow duration-150 placeholder:text-gray-400 focus:shadow-[inset_0_0_0_2px_#dc6c3a]"
              />
              <Search className="pointer-events-none absolute right-4 top-1/2 size-5 -translate-y-1/2 text-primary" />
            </label>
          </div>
        </div>
      </header>

      {showingOverview ? (
        <div className="px-4 pb-20 sm:px-6 sm:pb-24 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <FeaturedResearch publication={featured} />

            <section className="pt-8" aria-labelledby="technical-research-heading">
              <SectionHeading id="technical-research-heading" title="Technical research" onViewAll={() => showKind("technical")} />
              <div className="grid gap-5 md:grid-cols-3">
                {technical.map((publication) => (
                  <TechnicalCard key={publication.slug} publication={publication} />
                ))}
              </div>
            </section>

            <section className="pt-12" aria-labelledby="policy-briefs-heading">
              <SectionHeading id="policy-briefs-heading" title="Policy briefs" onViewAll={() => showKind("policy")} />
              <div>
                {policy.slice(0, 3).map((publication, index) => (
                  <PolicyRow key={publication.slug} publication={publication} index={index} />
                ))}
              </div>
            </section>

            <section className="pt-12" aria-labelledby="fellowship-projects-heading">
              <SectionHeading id="fellowship-projects-heading" title="Fellowship capstone projects" onViewAll={() => showKind("fellowship")} />
              <div className="grid gap-5 lg:grid-cols-3">
                {fellowship
                  .filter((publication) => publication.heroImage)
                  .slice(0, 3)
                  .map((publication) => (
                    <FellowshipCard key={publication.slug} publication={publication} />
                  ))}
              </div>
            </section>
          </div>
        </div>
      ) : (
        <section className="px-4 pb-20 sm:px-6 sm:pb-24 lg:px-8" aria-labelledby="research-results-heading">
          <div className="mx-auto max-w-7xl">
            <div className="flex items-end justify-between gap-5 py-7">
              <h2 id="research-results-heading" className="text-3xl font-bold text-primary">
                {activeKind === "all" ? "Search results" : KIND_LABELS[activeKind]}
              </h2>
              <p className="text-sm text-gray-500" aria-live="polite">
                <span className="tabular-nums font-semibold text-gray-800">{filteredPublications.length}</span>{" "}
                {filteredPublications.length === 1 ? "publication" : "publications"}
              </p>
            </div>

            {filteredPublications.length ? (
              <ul className="grid gap-x-12 lg:grid-cols-2">
                {filteredPublications.map((publication) => (
                  <ResultItem key={publication.slug} publication={publication} />
                ))}
              </ul>
            ) : (
              <div className="border-t border-black/10 py-20 text-center">
                <p className="text-xl font-semibold text-primary">No research matches that search.</p>
                <button
                  type="button"
                  onClick={() => {
                    setQuery("");
                    setActiveKind("all");
                  }}
                  className="tap-scale mt-5 min-h-11 rounded-lg bg-primary px-5 text-sm font-semibold text-white"
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
