'use client';

import { useState } from "react";
import Section from "@/components/Section";
import { FileText, ExternalLink, ScrollText, ChevronUp, ChevronDown, ChevronsUpDown, Search } from "lucide-react";

type PolicyBrief = {
    title: string;
    url: string;
    authors: string;
    source: string;
    date: string; // YYYY-MM-DD
};

const policyBriefs: PolicyBrief[] = [
    {
        title: "AI Market Structure Reform Act",
        url: "/research/AI Policy Hackathon (3) - Ricardo Bruinton.pdf",
        authors: "Ricardo Bruinton",
        source: "AI Policy Hackathon",
        date: "2026-04-04",
    },
    {
        title: "The AI Safety Investigation Act: A Federal AI Incident Investigation and Reporting Authority",
        url: "/research/Logan Bradley, Ishan Ajwani - AI Safety Investigation Act Brief - Logan Bradley.pdf",
        authors: "Logan Bradley, Ishan Ajwani",
        source: "AI Policy Hackathon",
        date: "2026-04-04",
    },
    {
        title: "The Making AI Governable for Americans Act (MAGA Act)",
        url: "/research/MAGA_Act_Policy_Brief (3) - Owen Watzlavick.pdf",
        authors: "Owen Watzlavick",
        source: "AI Policy Hackathon",
        date: "2026-04-04",
    },
    {
        title: "Regulating Frontier AI Through A Modular Risk-Based Approach",
        url: "/research/Policy Brief_VAISI AI Policy Hackathon - Aashka Vyas.pdf",
        authors: "Aashka Vyas",
        source: "AI Policy Hackathon",
        date: "2026-04-04",
    },
    {
        title: "Establishing a National \“Digital Letters of Marque\” Framework for Frontier AI Enforcement",
        url: "/research/Revised_Policy_Submission - Leah.pdf",
        authors: "Leah Huff",
        source: "AI Policy Hackathon",
        date: "2026-04-04",
    },
    {
        title: "Proposal for the National AI Security Organization (NASO)",
        url: "/research/Untitled document - Binit M.pdf",
        authors: "Binit Maharjan",
        source: "AI Policy Hackathon",
        date: "2026-04-04",
    },
];

type SortDir = 'asc' | 'desc' | null;

function SortIcon({ dir }: { dir: SortDir }) {
    if (dir === 'asc') return <ChevronUp size={14} className="inline ml-1" />;
    if (dir === 'desc') return <ChevronDown size={14} className="inline ml-1" />;
    return <ChevronsUpDown size={14} className="inline ml-1 opacity-40" />;
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
    const [sortDir, setSortDir] = useState<SortDir>(null);
    const [query, setQuery] = useState('');

    function toggleSort() {
        setSortDir((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    }

    const q = query.toLowerCase();
    const filtered = q
        ? policyBriefs.filter(
              (b) =>
                  b.title.toLowerCase().includes(q) ||
                  b.authors.toLowerCase().includes(q) ||
                  b.source.toLowerCase().includes(q)
          )
        : policyBriefs;

    const sorted = [...filtered].sort((a, b) => {
        if (!sortDir) return 0;
        return sortDir === 'asc'
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

            {/* Policy Briefs */}
            <Section className="bg-white">
                <div className="max-w-5xl mx-auto">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center">
                            <ScrollText className="w-6 h-6 text-secondary" />
                        </div>
                        <h2 className="text-3xl font-bold text-primary">Policy Briefs</h2>
                    </div>
                    <p className="text-lg text-gray-600 mb-4">
                        Policy briefs authored by VAISI members through competitions and independent research.
                    </p>

                    {/* Search bar */}
                    <div className="relative mb-6">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        <input
                            type="text"
                            placeholder="Search by title, author, or source…"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                        />
                    </div>

                    {policyBriefs.length === 0 ? (
                        <p className="text-gray-400 italic">Policy briefs coming soon.</p>
                    ) : (
                        <div className="border border-gray-200 rounded-lg overflow-hidden">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-slate-50 border-b border-gray-200 text-xs font-semibold uppercase tracking-wide text-gray-500">
                                        <th className="px-4 py-3 text-left font-semibold">Title &amp; Authors</th>
                                        <th className="px-4 py-3 text-center font-semibold">Source</th>
                                        <th className="px-4 py-3 text-left font-semibold">
                                            <button
                                                onClick={toggleSort}
                                                className="flex items-center gap-1 hover:text-primary transition-colors cursor-pointer whitespace-nowrap"
                                            >
                                                Published <SortIcon dir={sortDir} />
                                            </button>
                                        </th>
                                        <th className="px-4 py-3" />
                                    </tr>
                                </thead>
                                <tbody>
                                    {sorted.length === 0 && (
                                        <tr>
                                            <td colSpan={4} className="px-4 py-6 text-sm text-gray-400 italic">
                                                No briefs match your search.
                                            </td>
                                        </tr>
                                    )}
                                    {sorted.map((brief, idx) => (
                                        <tr
                                            key={idx}
                                            onClick={() => window.open(brief.url, '_blank')}
                                            className="group cursor-pointer hover:bg-slate-50 transition-colors border-b border-gray-100 last:border-0"
                                        >
                                            <td className="px-4 py-4">
                                                <div className="flex items-start gap-3">
                                                    <FileText size={16} className="text-blue-500 flex-shrink-0 mt-0.5" />
                                                    <div>
                                                        <span className="font-medium text-gray-800 group-hover:text-primary transition-colors block">
                                                            {brief.title}
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
                    )}
                </div>
            </Section>
        </div>
    );
}
