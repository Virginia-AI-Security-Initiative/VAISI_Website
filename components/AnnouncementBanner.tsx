"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, X } from "lucide-react";

// Site-wide announcement that drops down under the navbar on every page.
// To retire one, delete its entry. Changing `id` shows it again to people who dismissed an earlier one.
const announcements: {
    id: string;
    title: string;
    summary: string;
    linkText: string;
    link: string;
    hideOn?: string; // don't show on this page (the page it links to)
}[] = [
    {
        id: "policy-hackathon-2026",
        title: "2026 AI Policy Competition",
        summary: "November 15–21, with $1,000 in prizes for teams of up to 3",
        linkText: "Learn more & register",
        link: "/2026policyhackathon",
        hideOn: "/2026policyhackathon",
    },
];

const STORAGE_KEY = "vaisi-dismissed-announcements";

function readDismissed(): string[] {
    try {
        return JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "[]");
    } catch {
        return [];
    }
}

function saveDismissed(ids: string[]) {
    try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
    } catch {
        // Storage can be unavailable (private mode); the bar simply returns next visit.
    }
}

export default function AnnouncementBanner() {
    const pathname = usePathname();
    const reducedMotion = useReducedMotion();
    // null until mounted, so dismissed bars never flash in on load.
    const [dismissed, setDismissed] = useState<string[] | null>(null);

    useEffect(() => {
        const timer = window.setTimeout(() => setDismissed(readDismissed()), reducedMotion ? 0 : 500);
        return () => window.clearTimeout(timer);
    }, [reducedMotion]);

    const visible = (dismissed ? announcements : []).filter(
        (announcement) => !dismissed?.includes(announcement.id) && !(announcement.hideOn && pathname?.startsWith(announcement.hideOn))
    );

    const dismiss = (id: string) => {
        const next = [...(dismissed ?? []), id];
        setDismissed(next);
        saveDismissed(next);
    };

    return (
        <div aria-live="polite">
            <AnimatePresence initial={!reducedMotion}>
                {visible.map((announcement) => (
                    <motion.div
                        key={announcement.id}
                        initial={reducedMotion ? false : { height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ type: "spring", duration: 0.5, bounce: 0.15 }}
                        className="overflow-hidden bg-primary text-white"
                    >
                        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-2.5 sm:px-6 lg:px-8">
                            <div className="flex min-w-0 flex-1 flex-wrap items-center gap-x-3 gap-y-1 sm:justify-center">
                                <span className="text-sm font-semibold">{announcement.title}</span>
                                <span className="hidden h-3.5 w-px bg-white/30 md:block" />
                                <span className="hidden text-sm text-white/75 md:inline">{announcement.summary}</span>
                                <Link
                                    href={announcement.link}
                                    className="tap-scale group inline-flex min-h-8 items-center gap-1.5 rounded-lg bg-secondary px-3 text-sm font-semibold text-white hover:bg-secondary/90"
                                >
                                    {announcement.linkText}
                                    <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
                                </Link>
                            </div>
                            <button
                                type="button"
                                onClick={() => dismiss(announcement.id)}
                                className="flex size-8 shrink-0 items-center justify-center rounded-full text-white/60 transition-colors hover:bg-white/15 hover:text-white"
                                aria-label={`Dismiss ${announcement.title} announcement`}
                            >
                                <X size={14} />
                            </button>
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
}
