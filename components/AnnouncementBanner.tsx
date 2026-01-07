"use client";

import { useState } from "react";
import Link from "next/link";
import { X, Megaphone, ArrowRight } from "lucide-react";

// Announcements array - update this to change the banner content
const announcements = [
    {
        id: "fellowship-apps",
        title: "Fellowship Applications Open!",
        summary: "Apply now until next Friday to join the AI Governance Fellowship.",
        link: "/get-involved",
    },
    {
        id: "socials-position",
        title: "We're Hiring!",
        summary: "Looking for someone to run our social media accounts.",
        link: "/get-involved",
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
                                <Link
                                    href={announcement.link}
                                    className="text-sm font-semibold text-secondary hover:text-orange-300 transition-colors flex items-center gap-1 whitespace-nowrap"
                                >
                                    Learn More <ArrowRight size={16} />
                                </Link>
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
