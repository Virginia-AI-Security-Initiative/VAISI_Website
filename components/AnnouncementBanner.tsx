"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { X, Megaphone, ArrowRight } from "lucide-react";

// Announcements array - update this to change the banner content
const announcements: {
    id: string;
    title: string;
    summary: string;
    link: string;
    linkText: string;
}[] = [
    {
        id: "summer-reading-group-eoi-2026",
        title: "Summer Reading Group",
        summary: "Interested in joining our summer reading group? Fill out our expression of interest form.",
        link: "https://forms.gle/niHJ5AvKRZW51uHR7",
        linkText: "Express Interest",
    },
    {
        id: "fellowship-applications-open-2026",
        title: "Fellowship Applications Open",
        summary: "Apply by September 6 for our upcoming Intro to AI Safety and AI Policy fellowships!",
        link: "https://docs.google.com/document/d/10HcHGxPJ5VpnWoK1sq2nQQ6N85vsy95vgF_T9XGw3Es/edit?usp=sharing",
        linkText: "Fellowship Syllabi",
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

        const timeoutId = window.setTimeout(() => {
            setDismissedIds((prev) => new Set([...prev, ...exitingIds]));
            setExitingIds(new Set());
        }, 160);

        return () => window.clearTimeout(timeoutId);
    }, [exitingIds]);

    if (visibleAnnouncements.length === 0) return null;

    const handleDismiss = (id: string) => {
        setExitingIds((prev) => new Set(prev).add(id));
    };

    return (
        <div className="flex flex-col" aria-live="polite">
            {visibleAnnouncements.map((announcement, index) => (
                <div
                    key={announcement.id}
                    className={`grid overflow-hidden transition-[grid-template-rows,opacity,transform] duration-150 ease-in ${
                        exitingIds.has(announcement.id)
                            ? "grid-rows-[0fr] -translate-y-3 opacity-0"
                            : "grid-rows-[1fr] translate-y-0 opacity-100"
                    }`}
                >
                    <div className="min-h-0 overflow-hidden">
                        <div className={`bg-gradient-to-r from-primary to-primary/90 text-white relative ${index > 0 ? "border-t border-white/20" : ""}`}>
                            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                                <div className="flex items-center justify-between py-2.5 gap-3">
                                    <div className="flex items-center gap-3 flex-1 min-w-0">
                                        <Megaphone className="text-secondary flex-shrink-0" size={20} />
                                        <p className="text-sm md:text-base font-medium truncate">
                                            <span className="font-bold">{announcement.title}</span>
                                            <span className="hidden sm:inline"> — {announcement.summary}</span>
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                                        {announcement.link && (
                                            <Link
                                                href={announcement.link}
                                                target={announcement.link.startsWith("http") ? "_blank" : undefined}
                                                rel={announcement.link.startsWith("http") ? "noopener noreferrer" : undefined}
                                                aria-label={announcement.linkText}
                                                className="tap-scale flex min-h-10 items-center gap-1 whitespace-nowrap px-2 text-sm font-semibold text-secondary hover:text-orange-300"
                                            >
                                                <span className="hidden sm:inline">{announcement.linkText}</span>
                                                <ArrowRight size={16} />
                                            </Link>
                                        )}
                                        <button
                                            onClick={() => handleDismiss(announcement.id)}
                                            className="tap-scale flex size-11 items-center justify-center rounded-xl hover:bg-white/10"
                                            aria-label={`Dismiss ${announcement.title} announcement`}
                                        >
                                            <X size={20} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
