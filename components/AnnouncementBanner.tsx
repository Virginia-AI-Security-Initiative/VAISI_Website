"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { X } from "lucide-react";

const announcements: {
    id: string;
    title: string;
    summary: string;
    linkText: string;
    link: string;
}[] = [
    {
        id: "interest-meeting-2026",
        title: "Interest Meeting",
        summary: "RSVP to our interest meeting on Wednesday, August 26 to learn more about our club! Dinner provided.",
        link: "https://airtable.com/appM8XoHX2voW3LQe/pagic9ccJ72AZhRsF/form",
        linkText: "RSVP here →",
    },
    {
        id: "fellowship-applications-open-2026",
        title: "Fellowship Applications Open",
        summary: "Apply by September 6 for our upcoming Intro to AI Safety and AI Policy fellowships!",
        link: "https://airtable.com/appM8XoHX2voW3LQe/pag7pdRcPx9uhaRnF/form",
        linkText: "Apply here →",
    },
];

export default function AnnouncementBanner() {
    const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());
    const [exitingIds, setExitingIds] = useState<Set<string>>(new Set());

    const visibleAnnouncements = announcements.filter(
        (a) => !dismissedIds.has(a.id)
    );

    useEffect(() => {
        if (exitingIds.size === 0) return;
        const t = window.setTimeout(() => {
            setDismissedIds((prev) => new Set([...prev, ...exitingIds]));
            setExitingIds(new Set());
        }, 250);
        return () => window.clearTimeout(t);
    }, [exitingIds]);

    if (visibleAnnouncements.length === 0) return null;

    return (
        <div className="flex flex-col" aria-live="polite">
            {visibleAnnouncements.map((announcement, idx) => (
                <div
                    key={announcement.id}
                    className={`w-full bg-primary transition-all duration-250 ease-out overflow-hidden ${
                        idx < visibleAnnouncements.length - 1 ? "border-b border-white/20" : ""
                    } ${
                        exitingIds.has(announcement.id)
                            ? "opacity-0 max-h-0 pointer-events-none"
                            : "opacity-100 max-h-24"
                    }`}
                >
                    <div className="px-6 py-3 flex items-center">
                        <div className="flex-1" />
                        <div className="flex items-center gap-3">
                            <span className="text-sm font-semibold text-white whitespace-nowrap">
                                {announcement.title}
                            </span>
                            <span className="hidden sm:block w-px h-3.5 bg-white/30 flex-shrink-0" />
                            <span className="hidden sm:inline text-sm text-white/75 whitespace-nowrap">
                                {announcement.summary}
                            </span>
                            <span className="hidden sm:block w-px h-3.5 bg-white/30 flex-shrink-0" />
                            <Link
                                href={announcement.link}
                                target={announcement.link.startsWith("http") ? "_blank" : undefined}
                                rel={announcement.link.startsWith("http") ? "noopener noreferrer" : undefined}
                                className="text-sm font-semibold text-white underline underline-offset-2 decoration-white/50 hover:decoration-white whitespace-nowrap transition-colors"
                            >
                                {announcement.linkText}
                            </Link>
                        </div>
                        <div className="flex-1 flex justify-end">
                            <button
                                onClick={() => setExitingIds((prev) => new Set(prev).add(announcement.id))}
                                className="flex size-6 items-center justify-center rounded-full text-white/60 hover:bg-white/15 hover:text-white transition-colors"
                                aria-label={`Dismiss ${announcement.title}`}
                            >
                                <X size={12} />
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
