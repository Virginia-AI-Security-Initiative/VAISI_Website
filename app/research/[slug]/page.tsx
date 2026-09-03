import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FileText, FlaskConical, Landmark } from "lucide-react";
import content from "../content.generated.json";
import styles from "./article.module.css";
import {
  formatPublicationDate,
  getPublication,
  KIND_LABELS,
  publications,
  type PublicationKind,
} from "../data";

type PdfBlock = {
  type: "heading" | "subheading" | "paragraph" | "listItem" | "image";
  text: string;
  page: number;
  src?: string;
  alt?: string;
  caption?: string;
  width?: number;
  height?: number;
  inlineLinks?: { text: string; url: string }[];
};

type HtmlContent = {
  format: "html";
  html: string;
  images: string[];
  wordCount: number;
};

type PdfContent = {
  format: "pdf-text";
  pages: string[];
  blocks: PdfBlock[];
  links: string[];
  wordCount: number;
};

type ResearchContent = HtmlContent | PdfContent;

const researchContent = content as Record<string, ResearchContent>;

const kindIcons = {
  technical: FlaskConical,
  fellowship: FileText,
  policy: Landmark,
} satisfies Record<PublicationKind, typeof FileText>;

const kindAccent: Record<PublicationKind, string> = {
  technical: "text-secondary",
  fellowship: "text-[#66799e]",
  policy: "text-primary",
};

export function generateStaticParams() {
  return publications.map((publication) => ({ slug: publication.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const publication = getPublication(slug);
  if (!publication) return {};

  return {
    title: `${publication.title} | VAISI Research`,
    openGraph: publication.heroImage
      ? { images: [{ url: publication.heroImage, alt: publication.heroImageAlt }] }
      : undefined,
  };
}

function AbstractArtwork({ kind }: { kind: PublicationKind }) {
  const Icon = kindIcons[kind];
  return (
    <div className="relative flex aspect-[16/8] items-center justify-center overflow-hidden bg-primary">
      <div className="absolute -left-20 top-1/2 size-72 -translate-y-1/2 rounded-full bg-secondary/20 blur-3xl" />
      <div className="relative flex size-28 items-center justify-center rounded-[2rem] bg-white/10 shadow-[0_0_0_1px_rgba(255,255,255,0.15)] backdrop-blur-sm">
        <Icon className="size-12 text-white" aria-hidden="true" />
      </div>
    </div>
  );
}

const citationGroupPattern = /\[(\d+(?:\s*[,;]\s*\d+)*)\]/g;

function renderCitationText({
  text,
  keyPrefix,
  citationCounts,
  referenceNumbers,
}: {
  text: string;
  keyPrefix: string;
  citationCounts: Map<string, number>;
  referenceNumbers?: Set<string>;
}) {
  const fragments: React.ReactNode[] = [];
  let lastIndex = 0;

  for (const match of text.matchAll(citationGroupPattern)) {
    const matchIndex = match.index ?? 0;
    const numbers = match[1].split(/\s*([,;])\s*/);

    if (matchIndex > lastIndex) {
      fragments.push(text.slice(lastIndex, matchIndex));
    }

    const numberFragments = numbers.map((part, partIndex) => {
      if (part === "," || part === ";") {
        return `${part} `;
      }

      if (referenceNumbers && !referenceNumbers.has(part)) return part;

      const occurrence = (citationCounts.get(part) ?? 0) + 1;
      citationCounts.set(part, occurrence);

      return (
        <a
          key={`${keyPrefix}-cite-${part}-${partIndex}`}
          id={`citation-${part}-${occurrence}`}
          href={`#reference-${part}`}
          className={styles.citationLink}
          aria-label={`Go to reference ${part}`}
        >
          {part}
        </a>
      );
    });

    fragments.push(
      <span key={`${keyPrefix}-group-${matchIndex}`} className={styles.citationGroup}>
        [{numberFragments}]
      </span>,
    );
    lastIndex = matchIndex + match[0].length;
  }

  if (lastIndex < text.length) fragments.push(text.slice(lastIndex));
  return fragments.length > 0 ? fragments : text;
}

function renderPdfText({
  block,
  keyPrefix,
  citationCounts,
  referenceNumbers,
}: {
  block: PdfBlock;
  keyPrefix: string;
  citationCounts: Map<string, number>;
  referenceNumbers?: Set<string>;
}) {
  const links = block.inlineLinks ?? [];
  if (links.length === 0) {
    return renderCitationText({ text: block.text, keyPrefix, citationCounts, referenceNumbers });
  }

  const fragments: React.ReactNode[] = [];
  let cursor = 0;
  links.forEach((link, index) => {
    const matchIndex = block.text.indexOf(link.text, cursor);
    if (matchIndex < 0) return;
    if (matchIndex > cursor) {
      fragments.push(renderCitationText({
        text: block.text.slice(cursor, matchIndex),
        keyPrefix: `${keyPrefix}-before-${index}`,
        citationCounts,
        referenceNumbers,
      }));
    }
    fragments.push(
      <a
        key={`${keyPrefix}-source-${index}`}
        href={link.url}
        target="_blank"
        rel="noopener noreferrer"
      >
        {link.text}
      </a>,
    );
    cursor = matchIndex + link.text.length;
  });
  if (cursor < block.text.length) {
    fragments.push(renderCitationText({
      text: block.text.slice(cursor),
      keyPrefix: `${keyPrefix}-after`,
      citationCounts,
      referenceNumbers,
    }));
  }
  return fragments.length > 0
    ? fragments
    : renderCitationText({ text: block.text, keyPrefix, citationCounts, referenceNumbers });
}

type ParsedReference = {
  number?: string;
  text: string;
  url?: string;
  unnumbered?: boolean;
};

const referencesHeadingPattern = /^(?:references|bibliography|works cited|endnotes|citations|sources)\b:?/i;

function linkMatchScore(text: string, link: string) {
  try {
    const url = new URL(link);
    const normalizedText = text.toLowerCase().replace(/[^a-z0-9]/g, "");
    const hostname = url.hostname.replace(/^www\./, "").replace(/[^a-z0-9]/g, "");
    const pathTokens = url.pathname.toLowerCase().split(/[^a-z0-9]+/).filter((token) => token.length > 4);
    const hostnameScore = normalizedText.includes(hostname) ? 100 : 0;
    return hostnameScore + pathTokens.filter((token) => normalizedText.includes(token)).length;
  } catch {
    return 0;
  }
}

function parseReferences(blocks: PdfBlock[], links: string[]): ParsedReference[] {
  if (blocks.length === 0) return [];

  const secondaryHeadingIndex = blocks.findIndex(
    (block, index) => index > 0 && referencesHeadingPattern.test(block.text.trim()),
  );
  const primaryBlocks = secondaryHeadingIndex >= 0 ? blocks.slice(0, secondaryHeadingIndex) : blocks;
  const secondaryBlocks = secondaryHeadingIndex >= 0 ? blocks.slice(secondaryHeadingIndex + 1) : [];

  const combined = primaryBlocks
    .map((block) => block.text.replace(/^(?:[●•▪◦])\s*/, ""))
    .join(" ")
    .replace(referencesHeadingPattern, "")
    .replace(/\s+/g, " ")
    .trim();
  const markers = [...combined.matchAll(/\[(\d+)\]\s*/g)];
  const usedLinks = new Set<string>();

  const addLink = (referenceText: string) => {
    const explicitUrl = referenceText
      .match(/(?:https?:\/\/|www\.)\S+/i)?.[0]
      ?.replace(/[.,;]+$/, "");
    const ranked = links
      .filter((link) => !usedLinks.has(link))
      .map((link) => ({ link, score: linkMatchScore(referenceText, link) }))
      .sort((a, b) => b.score - a.score);
    const url = ranked[0]?.score >= 2
      ? ranked[0].link
      : explicitUrl
        ? (explicitUrl.startsWith("www.") ? `https://${explicitUrl}` : explicitUrl)
        : undefined;
    if (url) usedLinks.add(url);

    const visibleText = referenceText
      .replace(explicitUrl ?? /$^/, "")
      .replace(/\s+/g, " ")
      .trim();
    return { text: visibleText || referenceText.trim(), url };
  };

  if (markers.length > 0) {
    return markers.map((marker, index) => {
      const start = (marker.index ?? 0) + marker[0].length;
      const end = markers[index + 1]?.index ?? combined.length;
      return { number: marker[1], ...addLink(combined.slice(start, end)) };
    });
  }

  const numberedMarkers = [...combined.matchAll(/(?:^|\s)(\d{1,2})[.)]\s+/g)];
  const numberedBlocks = primaryBlocks.slice(1);
  if (numberedMarkers.length > 1 && numberedMarkers[0][1] === "1") {
    const numbered: ParsedReference[] = [];
    for (const block of numberedBlocks) {
      const marker = block.text.match(/^(\d{1,2})[.)]\s+/);
      if (marker) {
        numbered.push({ number: marker[1], ...addLink(block.text.slice(marker[0].length)) });
      } else if (numbered.length > 0) {
        const previous = numbered[numbered.length - 1];
        const combinedText = `${previous.text} ${block.text}`;
        numbered[numbered.length - 1] = { number: previous.number, ...addLink(combinedText) };
      }
    }
    return numbered.concat(
      secondaryBlocks.map((block) => ({ unnumbered: true, ...addLink(block.text) })),
    );
  }

  return blocks
    .slice(blocks[0].text.replace(referencesHeadingPattern, "").trim() ? 0 : 1)
    .map((block) => block.text.replace(referencesHeadingPattern, "").trim())
    .filter(Boolean)
    .map((text) => addLink(text));
}

function ReferencesSection({
  references,
  citationCounts,
}: {
  references: ParsedReference[];
  citationCounts: Map<string, number>;
}) {
  if (references.length === 0) return null;

  return (
    <section className={styles.referencesSection} aria-labelledby="references-heading">
      <h2 id="references-heading">References</h2>
      <div className={styles.referenceList}>
        {references.map((reference, index) => {
          const number = reference.number ?? String(index + 1);
          const returnHref = !reference.unnumbered && citationCounts.has(number) ? `#citation-${number}-1` : undefined;
          const Marker = returnHref ? "a" : "span";

          return (
            <div
              key={`${number}-${reference.text.slice(0, 28)}`}
              id={reference.unnumbered ? undefined : `reference-${number}`}
              className={styles.referenceEntry}
            >
              <Marker
                href={returnHref}
                className={styles.referenceNumber}
                aria-label={returnHref ? `Return to citation ${number}` : undefined}
              >
                {reference.unnumbered ? "•" : reference.number ? `[${number}]` : `${number}.`}
              </Marker>
              <p className={styles.referenceText}>
                {reference.url ? (
                  <a href={reference.url} target="_blank" rel="noopener noreferrer">
                    {reference.text}
                  </a>
                ) : (
                  reference.text
                )}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function PdfArticle({ body }: { body: PdfContent }) {
  let listIsOpen = false;
  const citationCounts = new Map<string, number>();
  const nodes: React.ReactNode[] = [];
  const referencesIndex = body.blocks.findIndex((block) => referencesHeadingPattern.test(block.text.trim()));
  const articleBlocks = referencesIndex >= 0 ? body.blocks.slice(0, referencesIndex) : body.blocks;
  const references = referencesIndex >= 0
    ? parseReferences(body.blocks.slice(referencesIndex), body.links)
    : [];
  const referenceNumbers = new Set(
    references
      .filter((reference) => !reference.unnumbered)
      .map((reference, index) => reference.number ?? String(index + 1)),
  );

  articleBlocks.forEach((block, index) => {
    const key = `${block.page}-${index}`;

    if (block.type === "image" && block.src && block.width && block.height) {
      listIsOpen = false;
      nodes.push(
        <figure key={key}>
          <Image
            src={block.src}
            alt={block.alt ?? ""}
            width={block.width}
            height={block.height}
            sizes="(min-width: 1024px) 46rem, 100vw"
          />
          {block.caption && <figcaption>{block.caption}</figcaption>}
        </figure>,
      );
      return;
    }

    if (block.type === "listItem") {
      if (!listIsOpen) {
        listIsOpen = true;
        const items: PdfBlock[] = [];
        let cursor = index;
        while (articleBlocks[cursor]?.type === "listItem") {
          items.push(articleBlocks[cursor]);
          cursor += 1;
        }
        nodes.push(
          <ul key={`list-${key}`}>
            {items.map((item, itemIndex) => {
              const itemText = item.text.replace(/^(?:[●•▪◦]|\d+[.)])\s*/, "");
              return (
                <li key={`${key}-${itemIndex}`}>
                  {renderPdfText({
                    block: { ...item, text: itemText },
                    keyPrefix: `${key}-${itemIndex}`,
                    citationCounts,
                    referenceNumbers,
                  })}
                </li>
              );
            })}
          </ul>,
        );
      }
      return;
    }
    listIsOpen = false;
    const blockText = renderPdfText({
      block,
      keyPrefix: key,
      citationCounts,
      referenceNumbers,
    });

    if (block.type === "heading") {
      nodes.push(<h2 key={key}>{blockText}</h2>);
    } else if (block.type === "subheading") {
      nodes.push(<h3 key={key}>{blockText}</h3>);
    } else {
      nodes.push(<p key={key}>{blockText}</p>);
    }
  });

  return (
    <div className="publication-body">
      {nodes}
      <ReferencesSection references={references} citationCounts={citationCounts} />
    </div>
  );
}

export default async function PublicationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const publication = getPublication(slug);
  const body = researchContent[slug];
  if (!publication || !body) notFound();

  const readingMinutes = Math.max(1, Math.ceil(body.wordCount / 220));
  const Icon = kindIcons[publication.kind];
  const sourceIsPdf = publication.sourceLabel === "Original PDF";

  return (
    <article className="min-h-screen bg-[#f7f6f2]">
      <header className="border-b border-black/10 px-4 pb-14 pt-10 sm:px-6 sm:pb-18 sm:pt-12 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Link
            href="/research"
            className="inline-flex min-h-11 items-center text-sm font-semibold text-gray-500 transition-colors duration-150 hover:text-primary"
          >
            Research archive
          </Link>

          <div className="mt-12 max-w-5xl">
            <div>
              <div className={`flex items-center gap-2 text-sm font-bold uppercase tracking-[0.17em] ${kindAccent[publication.kind]}`}>
                <Icon className="size-4" aria-hidden="true" />
                {KIND_LABELS[publication.kind]}
                {publication.award && <span>· {publication.award} place</span>}
              </div>
              <h1 className="mt-5 max-w-5xl text-[clamp(2.1rem,4vw,3.75rem)] font-bold leading-[1.04] tracking-[-0.03em] text-primary">
                {publication.title}
              </h1>
            </div>
            <div className="mt-8 border-l-2 border-secondary pl-5">
              <p className="text-lg font-bold text-primary">{publication.authors}</p>
              <p className="mt-2 text-sm leading-relaxed text-gray-500">
                {formatPublicationDate(publication.date)}
                <span aria-hidden="true"> · </span>
                <span className="tabular-nums">{readingMinutes} min read</span>
              </p>
              <p className="mt-1 text-sm leading-relaxed text-gray-500">{publication.collection}</p>
            </div>
          </div>
        </div>
      </header>

      {!sourceIsPdf && (
        <div className="px-4 pt-8 sm:px-6 sm:pt-10 lg:px-8">
          <div className="mx-auto max-w-6xl overflow-hidden bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.08),0_18px_50px_rgba(35,45,75,0.10)]">
            {publication.heroImage ? (
              <div className="image-outline relative aspect-[16/8] bg-[#eef0f4]">
                <Image
                  src={publication.heroImage}
                  alt={publication.heroImageAlt ?? ""}
                  fill
                  priority
                  sizes="(min-width: 1280px) 1152px, 100vw"
                  className="object-contain"
                />
              </div>
            ) : (
              <AbstractArtwork kind={publication.kind} />
            )}
          </div>
        </div>
      )}

      <div className="px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[minmax(0,46rem)_16rem] lg:items-start lg:justify-between">
          <div>
            {body.format === "html" ? (
              <div
                className="publication-body"
                dangerouslySetInnerHTML={{ __html: body.html }}
              />
            ) : (
              <PdfArticle body={body} />
            )}

          </div>

          <aside className="lg:sticky lg:top-28">
            <div>
              <a
                href={publication.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="tap-scale inline-flex min-h-11 w-full items-center rounded-xl bg-primary px-4 text-sm font-semibold text-white hover:bg-[#303d63]"
              >
                {publication.sourceLabel}
              </a>
            </div>
            <div className="mt-5 border-t border-black/10 pt-5">
              <p className="text-xs font-bold uppercase tracking-[0.17em] text-gray-400">Topics</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {publication.topics.map((topic) => (
                  <span key={topic} className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-gray-600 shadow-[0_0_0_1px_rgba(0,0,0,0.07)]">
                    {topic}
                  </span>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </article>
  );
}
