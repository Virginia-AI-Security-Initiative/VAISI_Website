'use client';

import { useState, useRef } from "react";
import Section from "@/components/Section";
import {
    FileText, ExternalLink, ScrollText, FlaskConical,
    ChevronUp, ChevronDown, ChevronsUpDown, Search, Plus, Minus, X,
} from "lucide-react";

import {
    policyBriefs,
    techPapers,
    fellowshipProjects,
    allPublications,
    KIND_LABELS,
    tagGroups,
} from './data';

type SortDir = 'asc' | 'desc' | null;

const MEDALS: Record<string, string> = {
    '1st': '🥇',
    '2nd': '🥈',
    '3rd': '🥉',
};

function SortIcon({ dir }: { dir: SortDir }) {
    if (dir === 'asc') return <ChevronUp size={14} className="inline ml-1" />;
    if (dir === 'desc') return <ChevronDown size={14} className="inline ml-1" />;
    return <ChevronsUpDown size={14} className="inline ml-1 opacity-40" />;
}

function SectionToggleIcon({ open }: { open: boolean }) {
    return (
        <span className="relative flex size-4 items-center justify-center" aria-hidden="true">
            <span
                className={`absolute inset-0 flex items-center justify-center transition-[opacity,filter,scale] duration-300 ease-[cubic-bezier(0.2,0,0,1)] ${
                    open ? 'scale-100 opacity-100 blur-0' : 'scale-[0.25] opacity-0 blur-[4px]'
                }`}
            >
                <Minus size={14} />
            </span>
            <span
                className={`flex items-center justify-center transition-[opacity,filter,scale] duration-300 ease-[cubic-bezier(0.2,0,0,1)] ${
                    open ? 'scale-[0.25] opacity-0 blur-[4px]' : 'scale-100 opacity-100 blur-0'
                }`}
            >
                <Plus size={14} />
            </span>
        </span>
    );
}

function formatDate(dateStr: string) {
    const [year, month, day] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
}

export default function ResearchPage() {
    const [openSections, setOpenSections] = useState<Set<string>>(new Set());
    const [policyQuery, setPolicyQuery] = useState('');
    const [policySortDir, setPolicySortDir] = useState<SortDir>(null);
    const [recentQuery, setRecentQuery] = useState('');
    const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());
    const [tagDropdownOpen, setTagDropdownOpen] = useState(false);

    const policyRef = useRef<HTMLDivElement>(null);
    const techRef = useRef<HTMLDivElement>(null);
    const fellowshipRef = useRef<HTMLDivElement>(null);

    function toggleSection(id: string) {
        setOpenSections((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    }

    function toggleTag(tag: string) {
        setSelectedTags((prev) => {
            const next = new Set(prev);
            if (next.has(tag)) next.delete(tag);
            else next.add(tag);
            return next;
        });
    }

    const rq = recentQuery.toLowerCase();
    const recentFiltered = allPublications.filter((pub) => {
        const matchesText =
            !rq ||
            pub.item.title.toLowerCase().includes(rq) ||
            pub.item.authors.toLowerCase().includes(rq);
        const contentTag =
            pub.kind === 'policy'
                ? pub.item.source
                : pub.kind === 'tech'
                ? pub.item.venue
                : pub.item.fellowship;
        const matchesTag =
            selectedTags.size === 0 ||
            selectedTags.has(KIND_LABELS[pub.kind]) ||
            selectedTags.has(contentTag);
        return matchesText && matchesTag;
    });
    const recentDisplayed =
        rq || selectedTags.size > 0 ? recentFiltered : recentFiltered.slice(0, 6);

    function quickAccess(id: string, ref: React.RefObject<HTMLDivElement | null>) {
        setOpenSections((prev) => new Set([...prev, id]));
        setTimeout(() => {
            ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 50);
    }

    const q = policyQuery.toLowerCase();
    const filteredBriefs = q
        ? policyBriefs.filter(
              (b) =>
                  b.title.toLowerCase().includes(q) ||
                  b.authors.toLowerCase().includes(q) ||
                  b.source.toLowerCase().includes(q)
          )
        : policyBriefs;

    const sortedBriefs = [...filteredBriefs].sort((a, b) => {
        if (!policySortDir) return 0;
        return policySortDir === 'asc'
            ? a.date.localeCompare(b.date)
            : b.date.localeCompare(a.date);
    });

    return (
        <div className="flex flex-col min-h-screen">
            {/* Page Header */}
            <Section className="bg-primary text-white py-16">
                <div className="max-w-3xl mx-auto text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Research</h1>
                    <p className="text-xl text-blue-100">
                        Original policy work and research produced by VAISI members.
                    </p>
                </div>
            </Section>

            <Section className="bg-white">
                <div className="max-w-5xl mx-auto space-y-10">

                    {/* Quick Access */}
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">
                            Quick Access
                        </p>
                        <div className="flex flex-wrap gap-3">
                            <button
                                onClick={() => quickAccess('policy-briefs', policyRef)}
                                className="tap-scale button-outline flex min-h-10 items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:text-primary"
                            >
                                <ScrollText size={15} />
                                Policy Briefs
                                <span className="text-xs text-gray-400 tabular-nums">({policyBriefs.length})</span>
                            </button>
                            <button
                                onClick={() => quickAccess('tech-research', techRef)}
                                className="tap-scale button-outline flex min-h-10 items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:text-primary"
                            >
                                <FlaskConical size={15} />
                                Technical Team Research
                                <span className="text-xs text-gray-400 tabular-nums">({techPapers.length})</span>
                            </button>
                            <button
                                onClick={() => quickAccess('fellowship-projects', fellowshipRef)}
                                className="tap-scale button-outline flex min-h-10 items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:text-primary"
                            >
                                <FileText size={15} />
                                Fellowship Capstone Projects
                                <span className="text-xs text-gray-400 tabular-nums">({fellowshipProjects.length})</span>
                            </button>
                        </div>
                    </div>

                    {/* Recently Published */}
                    {allPublications.length > 0 && (
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">
                                Recently Published
                            </p>

                            {/* Search + tag filter */}
                            <div className="mb-4">
                                {selectedTags.size > 0 && (
                                    <div className="flex flex-wrap items-center gap-1.5 mb-2">
                                        {[...selectedTags].map((tag) => (
                                            <span key={tag} className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                                                {tag}
                                                <button onClick={() => toggleTag(tag)} className="hover:text-secondary transition-colors">
                                                    <X size={11} />
                                                </button>
                                            </span>
                                        ))}
                                        <button
                                            onClick={() => setSelectedTags(new Set())}
                                            className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
                                        >
                                            Clear all
                                        </button>
                                    </div>
                                )}
                                <div className="relative">
                                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                    <input
                                        type="text"
                                        placeholder="Search by title or author…"
                                        value={recentQuery}
                                        onChange={(e) => setRecentQuery(e.target.value)}
                                        onFocus={() => setTagDropdownOpen(true)}
                                        onBlur={() => setTimeout(() => setTagDropdownOpen(false), 150)}
                                        className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                                    />
                                    {tagDropdownOpen && !recentQuery && tagGroups.length > 0 && (
                                        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 p-4">
                                            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-3">Filter by tag</p>
                                            <div className="space-y-3">
                                                {tagGroups.map((group) => (
                                                    <div key={group.label}>
                                                        <p className="text-xs text-gray-400 mb-1.5">{group.label}</p>
                                                        <div className="flex flex-wrap gap-1.5">
                                                            {group.tags.map((tag) => (
                                                                <button
                                                                    key={tag}
                                                                    onMouseDown={() => toggleTag(tag)}
                                                                    className={`tap-scale min-h-10 rounded-full px-2.5 py-1 text-xs font-medium ${
                                                                        selectedTags.has(tag)
                                                                            ? 'bg-primary text-white shadow-sm'
                                                                            : 'button-outline bg-slate-50 text-gray-600 hover:text-primary'
                                                                    }`}
                                                                >
                                                                    {tag}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="h-56 overflow-y-auto">
                            {recentDisplayed.length === 0 ? (
                                <div className="h-full flex items-center justify-center">
                                    <p className="text-sm text-gray-400 italic">No publications match your search.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {recentDisplayed.map((pub, idx) => (
                                        <a
                                            key={idx}
                                            href={pub.item.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="group flex flex-col p-4 rounded-lg border border-gray-200 hover:border-primary/40 hover:bg-slate-50 transition-colors"
                                        >
                                            <div className="flex items-center justify-between mb-3">
                                                <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${
                                                    pub.kind === 'policy'
                                                        ? 'bg-blue-50 text-primary border-blue-100'
                                                        : pub.kind === 'tech'
                                                        ? 'bg-green-50 text-green-700 border-green-100'
                                                        : 'bg-purple-50 text-purple-700 border-purple-100'
                                                }`}>
                                                    {pub.kind === 'policy' ? 'Policy Brief' : pub.kind === 'tech' ? 'Tech Paper' : 'Fellowship'}
                                                </span>
                                                <ExternalLink size={14} className="text-gray-300 group-hover:text-secondary transition-colors" />
                                            </div>
                                            <p className="text-sm font-medium text-gray-800 group-hover:text-primary transition-colors line-clamp-3 flex-1 mb-3">
                                                {pub.item.title}
                                            </p>
                                            <div className="text-xs text-gray-400 space-y-0.5">
                                                <p className="truncate">{pub.item.authors}</p>
                                                <p>{formatDate(pub.item.date)}</p>
                                            </div>
                                        </a>
                                    ))}
                                </div>
                            )}
                            </div>
                        </div>
                    )}

                    {/* Accordion Sections */}
                    <div className="border-t border-gray-200">

                        {/* Policy Briefs */}
                        <div ref={policyRef} className="border-b border-gray-200">
                            <button
                                onClick={() => toggleSection('policy-briefs')}
                                className="w-full flex items-center justify-between py-5 text-left group"
                                aria-expanded={openSections.has('policy-briefs')}
                            >
                                <div className="flex items-center gap-3">
                                    <ScrollText size={18} className="text-secondary flex-shrink-0" />
                                    <span className="text-lg font-semibold text-gray-800 group-hover:text-primary transition-colors">
                                        Policy Briefs
                                    </span>
                                    <span className="text-sm text-gray-400">
                                        <span className="tabular-nums">{policyBriefs.length}</span> {policyBriefs.length === 1 ? 'entry' : 'entries'}
                                    </span>
                                </div>
                                <div className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center text-gray-400 group-hover:border-primary group-hover:text-primary transition-colors flex-shrink-0">
                                    <SectionToggleIcon open={openSections.has('policy-briefs')} />
                                </div>
                            </button>

                            {openSections.has('policy-briefs') && (
                                <div className="pb-6">
                                    <div className="relative mb-4">
                                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                        <input
                                            type="text"
                                            placeholder="Search by title, author, or source…"
                                            value={policyQuery}
                                            onChange={(e) => setPolicyQuery(e.target.value)}
                                            className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                                        />
                                    </div>
                                    <div className="border border-gray-200 rounded-lg overflow-y-auto max-h-80">
                                        <table className="w-full">
                                            <thead>
                                                <tr className="bg-slate-50 border-b border-gray-200 text-xs font-semibold uppercase tracking-wide text-gray-500">
                                                    <th className="px-4 py-3 text-left font-semibold">Title &amp; Authors</th>
                                                    <th className="px-4 py-3 text-center font-semibold">Source</th>
                                                    <th className="px-4 py-3 text-left font-semibold">
                                                        <button
                                                            onClick={() => setPolicySortDir((prev) => (prev === 'asc' ? 'desc' : 'asc'))}
                                                            className="flex items-center gap-1 hover:text-primary transition-colors cursor-pointer whitespace-nowrap"
                                                        >
                                                            Published <SortIcon dir={policySortDir} />
                                                        </button>
                                                    </th>
                                                    <th className="px-4 py-3" />
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {sortedBriefs.length === 0 && (
                                                    <tr>
                                                        <td colSpan={4} className="px-4 py-6 text-sm text-gray-400 italic">
                                                            No briefs match your search.
                                                        </td>
                                                    </tr>
                                                )}
                                                {sortedBriefs.map((brief, idx) => (
                                                    <tr
                                                        key={idx}
                                                        onClick={() => window.open(brief.url, '_blank')}
                                                        className="group cursor-pointer hover:bg-slate-50 transition-colors border-b border-gray-100 last:border-0"
                                                    >
                                                        <td className="px-4 py-4">
                                                            <div className="flex items-start gap-3">
                                                                <FileText size={16} className="text-blue-500 flex-shrink-0 mt-0.5" />
                                                                <div>
                                                                    <span className="block font-medium text-gray-800 group-hover:text-primary transition-colors">
                                                                        {brief.title}
                                                                        {brief.award && (
                                                                            <span className="ml-2 inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 align-middle text-xs font-semibold text-amber-700 whitespace-nowrap">
                                                                                <span aria-hidden="true">{MEDALS[brief.award] ?? '🏅'}</span>
                                                                                {brief.award} Place
                                                                            </span>
                                                                        )}
                                                                    </span>
                                                                    <span className="text-sm text-gray-500">{brief.authors}</span>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-4 text-center">
                                                            <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-blue-50 text-primary border border-blue-100 whitespace-nowrap">
                                                                {brief.source}
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-4 text-sm text-gray-500 whitespace-nowrap">
                                                            {formatDate(brief.date)}
                                                        </td>
                                                        <td className="px-4 py-4">
                                                            <ExternalLink size={16} className="text-gray-300 group-hover:text-secondary transition-colors" />
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Technical Team Research */}
                        <div ref={techRef} className="border-b border-gray-200">
                            <button
                                onClick={() => toggleSection('tech-research')}
                                className="w-full flex items-center justify-between py-5 text-left group"
                                aria-expanded={openSections.has('tech-research')}
                            >
                                <div className="flex items-center gap-3">
                                    <FlaskConical size={18} className="text-green-600 flex-shrink-0" />
                                    <span className="text-lg font-semibold text-gray-800 group-hover:text-primary transition-colors">
                                        Technical Team Research
                                    </span>
                                    <span className="text-sm text-gray-400">
                                        <span className="tabular-nums">{techPapers.length}</span> {techPapers.length === 1 ? 'entry' : 'entries'}
                                    </span>
                                </div>
                                <div className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center text-gray-400 group-hover:border-primary group-hover:text-primary transition-colors flex-shrink-0">
                                    <SectionToggleIcon open={openSections.has('tech-research')} />
                                </div>
                            </button>

                            {openSections.has('tech-research') && (
                                <div className="pb-6">
                                    {techPapers.length === 0 ? (
                                        <p className="text-sm text-gray-400 italic">Research papers coming soon.</p>
                                    ) : (
                                        <div className="border border-gray-200 rounded-lg overflow-y-auto max-h-80">
                                            <table className="w-full">
                                                <thead className="sticky top-0 z-10">
                                                    <tr className="bg-slate-50 border-b border-gray-200 text-xs font-semibold uppercase tracking-wide text-gray-500">
                                                        <th className="px-4 py-3 text-left font-semibold">Title &amp; Authors</th>
                                                        <th className="px-4 py-3 text-center font-semibold">Venue</th>
                                                        <th className="px-4 py-3 text-left font-semibold">Published</th>
                                                        <th className="px-4 py-3" />
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {techPapers.map((paper, idx) => (
                                                        <tr
                                                            key={idx}
                                                            onClick={() => window.open(paper.url, '_blank')}
                                                            className="group cursor-pointer hover:bg-slate-50 transition-colors border-b border-gray-100 last:border-0"
                                                        >
                                                            <td className="px-4 py-4">
                                                                <div className="flex items-start gap-3">
                                                                    <FileText size={16} className="text-green-500 flex-shrink-0 mt-0.5" />
                                                                    <div>
                                                                        <span className="font-medium text-gray-800 group-hover:text-primary transition-colors block">
                                                                            {paper.title}
                                                                        </span>
                                                                        <span className="text-sm text-gray-500">{paper.authors}</span>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="px-4 py-4 text-center">
                                                                <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-green-50 text-green-700 border border-green-100 whitespace-nowrap">
                                                                    {paper.venue}
                                                                </span>
                                                            </td>
                                                            <td className="px-4 py-4 text-sm text-gray-500 whitespace-nowrap">
                                                                {formatDate(paper.date)}
                                                            </td>
                                                            <td className="px-4 py-4">
                                                                <ExternalLink size={16} className="text-gray-300 group-hover:text-secondary transition-colors" />
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Fellowship Projects */}
                        <div ref={fellowshipRef} className="border-b border-gray-200">
                            <button
                                onClick={() => toggleSection('fellowship-projects')}
                                className="w-full flex items-center justify-between py-5 text-left group"
                                aria-expanded={openSections.has('fellowship-projects')}
                            >
                                <div className="flex items-center gap-3">
                                    <FileText size={18} className="text-purple-600 flex-shrink-0" />
                                    <span className="text-lg font-semibold text-gray-800 group-hover:text-primary transition-colors">
                                        Fellowship Capstone Projects
                                    </span>
                                    <span className="text-sm text-gray-400">
                                        <span className="tabular-nums">{fellowshipProjects.length}</span> {fellowshipProjects.length === 1 ? 'entry' : 'entries'}
                                    </span>
                                </div>
                                <div className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center text-gray-400 group-hover:border-primary group-hover:text-primary transition-colors flex-shrink-0">
                                    <SectionToggleIcon open={openSections.has('fellowship-projects')} />
                                </div>
                            </button>

                            {openSections.has('fellowship-projects') && (
                                <div className="pb-6">
                                    {fellowshipProjects.length === 0 ? (
                                        <p className="text-sm text-gray-400 italic">Fellowship projects coming soon.</p>
                                    ) : (
                                        <div className="border border-gray-200 rounded-lg overflow-y-auto max-h-80">
                                            <table className="w-full">
                                                <thead className="sticky top-0 z-10">
                                                    <tr className="bg-slate-50 border-b border-gray-200 text-xs font-semibold uppercase tracking-wide text-gray-500">
                                                        <th className="px-4 py-3 text-left font-semibold">Title &amp; Authors</th>
                                                        <th className="px-4 py-3 text-center font-semibold">Fellowship</th>
                                                        <th className="px-4 py-3 text-left font-semibold">Published</th>
                                                        <th className="px-4 py-3" />
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {fellowshipProjects.map((project, idx) => (
                                                        <tr
                                                            key={idx}
                                                            onClick={() => window.open(project.url, '_blank')}
                                                            className="group cursor-pointer hover:bg-slate-50 transition-colors border-b border-gray-100 last:border-0"
                                                        >
                                                            <td className="px-4 py-4">
                                                                <div className="flex items-start gap-3">
                                                                    <FileText size={16} className="text-purple-500 flex-shrink-0 mt-0.5" />
                                                                    <div>
                                                                        <span className="font-medium text-gray-800 group-hover:text-primary transition-colors block">
                                                                            {project.title}
                                                                        </span>
                                                                        <span className="text-sm text-gray-500">{project.authors}</span>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="px-4 py-4 text-center">
                                                                <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-100 whitespace-nowrap">
                                                                    {project.fellowship}
                                                                </span>
                                                            </td>
                                                            <td className="px-4 py-4 text-sm text-gray-500 whitespace-nowrap">
                                                                {formatDate(project.date)}
                                                            </td>
                                                            <td className="px-4 py-4">
                                                                <ExternalLink size={16} className="text-gray-300 group-hover:text-secondary transition-colors" />
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                    </div>
                </div>
            </Section>
        </div>
    );
}
