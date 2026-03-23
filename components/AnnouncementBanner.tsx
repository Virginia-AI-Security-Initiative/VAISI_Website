"use client";

import { useState } from "react";
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
        id: "future-of-ai-panel",
        title: "Future of AI Panel",
        summary: "Tuesday, March 24 · 5:00–6:30pm · Clark 108",
        link: "https://docs.google.com/forms/d/e/1FAIpQLSelw5_D-VHhiYYlErqxmW7oDctG6C3i9ms9_Pg2Gv6ZZvPnhQ/viewform?usp=dialog",
        linkText: "RSVP",
    },
    {
        id: "ai-policy-hackathon",
        title: "AI Policy Hackathon",
        summary: "March 28 – April 4, 2026",
        link: "https://docs.google.com/forms/d/e/1FAIpQLScvmH8Vh1h-Hnbwa5_vKD5E_fl4J9dKVTRud-xmLO2RbNbEbQ/viewform",
        linkText: "Sign up",
    },
];

export default function AnnouncementBanner() {
    const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());

    const visibleAnnouncements = announcements.filter(
        (a) => !dismissedIds.has(a.id)
    );

    if (visibleAnnouncements.length === 0) return null;

    const handleDismiss = (id: string) => {
        setDismissedIds((prev) => new Set(prev).add(id));
    };

    return (
        <div className="flex flex-col">
            {visibleAnnouncements.map((announcement, index) => (
                <div
                    key={announcement.id}
                    className={`bg-gradient-to-r from-primary to-primary/90 text-white relative ${index > 0 ? "border-t border-white/20" : ""
                        }`}
                >
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between py-3 gap-4">
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                                <Megaphone className="text-secondary flex-shrink-0" size={20} />
                                <p className="text-sm md:text-base font-medium truncate">
                                    <span className="font-bold">{announcement.title}</span>
                                    <span className="hidden sm:inline"> — {announcement.summary}</span>
                                </p>
                            </div>
                            <div className="flex items-center gap-3 flex-shrink-0">
                                {announcement.link && (
                                    <Link
                                        href={announcement.link}
                                        target={announcement.link.startsWith("http") ? "_blank" : undefined}
                                        rel={announcement.link.startsWith("http") ? "noopener noreferrer" : undefined}
                                        className="text-sm font-semibold text-secondary hover:text-orange-300 transition-colors flex items-center gap-1 whitespace-nowrap"
                                    >
                                        {announcement.linkText} <ArrowRight size={16} />
                                    </Link>
                                )}
                                <button
                                    onClick={() => handleDismiss(announcement.id)}
                                    className="p-1 hover:bg-white/10 rounded-full transition-colors"
                                    aria-label="Dismiss announcement"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
