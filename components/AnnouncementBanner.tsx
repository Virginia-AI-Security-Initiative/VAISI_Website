"use client";

import { useState } from "react";
import Link from "next/link";
import { X, Megaphone, ArrowRight } from "lucide-react";

// Current announcement - update this to change the banner content
const announcement = {
    title: "Fall Semester Kickoff Meeting",
    summary: "Join us for our first meeting of the semester!",
    link: "/get-involved",
};

export default function AnnouncementBanner() {
    const [isVisible, setIsVisible] = useState(true);

    if (!isVisible) return null;

    return (
        <div className="bg-gradient-to-r from-primary to-primary/90 text-white relative">
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
                            onClick={() => setIsVisible(false)}
                            className="p-1 hover:bg-white/10 rounded-full transition-colors"
                            aria-label="Dismiss announcement"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
