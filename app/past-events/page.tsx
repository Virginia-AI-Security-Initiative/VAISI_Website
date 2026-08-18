'use client';

import Section from "@/components/Section";
import PageHero from "@/components/PageHero";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/motion";
import { sectionTitleClass } from "@/components/sectionTitle";
import Image from "next/image";
import { createPortal } from "react-dom";
import { Calendar, Camera, ChevronLeft, ChevronRight, ExternalLink, X } from "lucide-react";
import { ReactNode, useCallback, useEffect, useState } from "react";

interface EventLink {
    label: string;
    url: string;
    emphasis?: "primary" | "subtle";
}

interface UpcomingEvent {
    title: string;
    dateRange: string;
    location?: string;
    description: string | ReactNode;
    imageSrc?: string;
    links?: EventLink[];
}

interface PastEvent {
    title: string;
    date: string;
    description: string | ReactNode;
    imageSrc?: string;
    photos?: string[];
    links?: EventLink[];
}

const upcomingEvents: UpcomingEvent[] = [
    {
        title: "AI Fair",
        dateRange: "August 26, 2026 from 3:00 to 6:00 PM",
        location: "Ern Commons",
        description: "VAISI will have a table at the AI Fair! Stop by to chat and learn more about what we do.",
        links: [
            {
                label: "See all participating organizations",
                url: "http://saiuva.com/pages/fall-ai-fair.html",
                emphasis: "subtle",
            },
            {
                label: "RSVP",
                url: "https://docs.google.com/forms/d/e/1FAIpQLSc_D3s053QVjZ6HQcSa6hglI_pr_mOXrlP9lfZ5NvtZ_pu4Rw/viewform",
                emphasis: "primary",
            },
        ],
    },
    {
        title: "Interest Meeting",
        dateRange: "August 26, 2026 at 6:30 PM",
        location: "Location TBD",
        description: "Come to learn more about VAISI's mission and ways to get involved. The VAISI team will stay to chat with interested students after the event. Pizza will be served.",
        links: [
            {
                label: "RSVP",
                url: "https://airtable.com/appM8XoHX2voW3LQe/pag8klHsnJ1stf23q/form",
                emphasis: "primary",
            },
        ],
    },
    {
        title: "Estimathon",
        dateRange: "September 1, 2026 at 6:30 PM",
        location: "Location TBD",
        description: "Come to test your estimation and calibration on AI-related questions! Pizza will be served. There will be $300 in prizes.",
        links: [
            {
                label: "RSVP",
                url: "https://airtable.com/appM8XoHX2voW3LQe/pag3tTTnen7yZU0yN/form",
                emphasis: "primary",
            },
        ],
    },
];

const pastEvents: PastEvent[] = [
    {
        title: "AI Policy Hackathon",
        date: "March 28 – April 4, 2026",
        description:
            "A week-long hackathon focused on AI policy. Participants will work in teams to develop policy proposals and solutions to pressing AI governance challenges.",
        imageSrc: "/images/past-events/VAISI Policy Hackathon.png",
        links: [
            { label: "Event details", url: "https://docs.google.com/document/d/1OMX8OoSnwxvP-Hb9O4aZ58GOCFGYL2svoEdk3f4MPjE/edit?tab=t.0" },
        ],
    },
    {
        title: "Future of AI Panel",
        date: "March 24, 2026",
        description: (
            <>
                Professors{" "}
                <a href="https://www.korinek.com/" target="_blank" rel="noopener noreferrer" className="text-primary underline decoration-secondary hover:text-primary transition-colors">Anton Korinek</a>
                ,{" "}
                <a href="https://www.cs.virginia.edu/~evans/" target="_blank" rel="noopener noreferrer" className="text-primary underline decoration-secondary hover:text-primary transition-colors">David Evans</a>
                , and{" "}
                <a href="https://www.daviddanks.org/" target="_blank" rel="noopener noreferrer" className="text-primary underline decoration-secondary hover:text-primary transition-colors">David Danks</a>
                {" "}discussed the future of AI, moderated by VAISI president Jason Chin. Format: 5–6pm guided panel discussion, 6–6:30pm audience Q&A.
            </>
        ),
        imageSrc: "/images/past-events/AI Future Panel.png",
        photos: [
            "/images/past-events/Future of AI Panel/IMG_4366.JPG",
            "/images/past-events/Future of AI Panel/IMG_2316.jpg",
            "/images/past-events/Future of AI Panel/IMG_7741.JPG",
            "/images/past-events/Future of AI Panel/IMG_7743.JPG",
        ],
    },
    {
        title: "HooHacks",
        date: "March 21–22, 2026",
        description: "Virginia's biggest hackathon and one of the top 50 collegiate hackathons in the US. VAISI sponsored the AI Safety and Alignment Evaluations track, challenging participants to build projects focused on the safe creation and deployment of AI models.",
        imageSrc: "/images/past-events/hoohacks.png",
        photos: [
            "/images/past-events/HooHacks/IMG_4264.JPG",
            "/images/past-events/HooHacks/IMG_4291.JPG",
            "/images/past-events/HooHacks/IMG_4292.JPG",
            "/images/past-events/HooHacks/IMG_4295.JPG",
            "/images/past-events/HooHacks/IMG_4297.JPG",
            "/images/past-events/HooHacks/IMG_4301.JPG",
            "/images/past-events/HooHacks/IMG_4303.JPG",
            "/images/past-events/HooHacks/IMG_4306.JPG",
            "/images/past-events/HooHacks/IMG_4310.JPG",
            "/images/past-events/HooHacks/IMG_4349.JPG",
            "/images/past-events/HooHacks/IMG_4353.JPG",
        ],
        links: [
            { label: "hoohacks.io", url: "https://hoohacks.io/" },
        ],
    },
    {
        title: "AI Progress Estimation Game",
        date: "February 3, 2026",
        description:
            "A team-based competition where groups competed to answer AI-related estimation questions. Teams vied for hundreds of dollars in prizes in a fast-paced, collaborative format.",
        imageSrc: "/images/past-events/ai-progress-estimation-game-flyer.png",
        photos: [
            "/images/past-events/estimation-game-1.jpg",
            "/images/past-events/estimation-game-3.jpg",
        ],
    },
    {
        title: "Eli Lifland Speaker Event",
        date: "October 7, 2025",
        description: (
            <>
                Eli Lifland, co-author of{" "}
                <a href="https://ai-2027.com/" target="_blank" rel="noopener noreferrer" className="text-primary underline decoration-secondary hover:text-primary transition-colors">
                    AI 2027
                </a>
                , spoke about his research, current projects in AI safety, and advice for students looking to contribute to the field. The talk was followed by an open Q&A session.
            </>
        ),
        imageSrc: "/images/past-events/eli-lifland-flyer.PNG",
        photos: [
            "/images/past-events/eli-lifland-1.jpg",
        ],
        links: [
            { label: "Watch the recording", url: "https://youtu.be/bXSP2OMexdM?si=TRvVyP1AdpR2Rkuh" },
        ],
    },
];

function PhotoLightbox({ photos, eventTitle, onClose }: { photos: string[]; eventTitle: string; onClose: () => void }) {
    const [currentIndex, setCurrentIndex] = useState(0);

    const goNext = useCallback(() => {
        setCurrentIndex((i) => (i + 1) % photos.length);
    }, [photos.length]);

    const goPrev = useCallback(() => {
        setCurrentIndex((i) => (i - 1 + photos.length) % photos.length);
    }, [photos.length]);

    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
            if (e.key === "ArrowRight") goNext();
            if (e.key === "ArrowLeft") goPrev();
        };
        document.body.style.overflow = "hidden";
        window.addEventListener("keydown", handleKey);
        return () => {
            document.body.style.overflow = "";
            window.removeEventListener("keydown", handleKey);
        };
    }, [onClose, goNext, goPrev]);

    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90" onClick={onClose} role="dialog" aria-modal="true" aria-label={`${eventTitle} photo gallery`}>
            <button
                onClick={onClose}
                className="tap-scale fixed top-6 right-6 z-10 flex size-11 items-center justify-center rounded-xl text-white/80 hover:bg-white/10 hover:text-white"
                aria-label="Close photo gallery"
            >
                <X size={28} />
            </button>

            {photos.length > 1 && (
                <>
                    <button
                        onClick={(e) => { e.stopPropagation(); goPrev(); }}
                        className="tap-scale fixed left-2 sm:left-6 top-1/2 z-10 flex size-11 -translate-y-1/2 items-center justify-center rounded-xl text-white/80 hover:bg-white/10 hover:text-white"
                        aria-label="Previous photo"
                    >
                        <ChevronLeft size={36} />
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); goNext(); }}
                        className="tap-scale fixed right-2 sm:right-6 top-1/2 z-10 flex size-11 -translate-y-1/2 items-center justify-center rounded-xl text-white/80 hover:bg-white/10 hover:text-white"
                        aria-label="Next photo"
                    >
                        <ChevronRight size={36} />
                    </button>
                </>
            )}

            <div
                className="relative w-[90vw] h-[80vh] max-w-6xl"
                onClick={(e) => e.stopPropagation()}
            >
                <Image
                    src={photos[currentIndex]}
                    alt={`${eventTitle} photo ${currentIndex + 1}`}
                    fill
                    className="object-contain"
                />
            </div>

            <p className="fixed bottom-6 left-1/2 -translate-x-1/2 text-sm text-white/70 tabular-nums">
                {currentIndex + 1} / {photos.length}
            </p>
        </div>,
        document.body
    );
}

function UpcomingEventCard({ event }: { event: UpcomingEvent }) {
    return (
        <div className="surface-card overflow-hidden rounded-2xl bg-white border border-gray-200">
            {event.imageSrc && (
                <div className="bg-gray-100 flex items-center justify-center relative overflow-hidden" style={{ aspectRatio: '8.5 / 11' }}>
                    <Image
                        src={event.imageSrc}
                        alt={event.title}
                        fill
                        className="image-outline object-cover"
                    />
                </div>
            )}

            <div className="p-4">
                <h3 className="text-base font-bold text-gray-900 mb-1">{event.title}</h3>
                <p className="text-xs font-medium text-secondary mb-1">{event.dateRange}</p>
                {event.location && (
                    <p className="text-xs font-medium text-secondary mb-2">{event.location}</p>
                )}
                <p className="text-sm text-gray-500">{event.description}</p>

                {event.links && event.links.length > 0 && (
                    <div className="mt-4 flex flex-col items-start gap-2 border-t border-gray-100 pt-3">
                        {event.links.map((link) => {
                            const isPrimary = link.emphasis === "primary";

                            return (
                                <a
                                    key={link.url}
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={isPrimary
                                        ? "tap-scale inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-primary/8 px-3.5 py-2 text-sm font-medium text-primary hover:bg-primary/12"
                                        : "text-link-subtle inline-flex min-h-11 items-center gap-2 text-sm font-medium text-gray-600 hover:text-primary"
                                    }
                                >
                                    {link.label}
                                    <ExternalLink size={isPrimary ? 14 : 13} aria-hidden="true" />
                                </a>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}

function PastEventCard({ event }: { event: PastEvent }) {
    const [lightboxOpen, setLightboxOpen] = useState(false);

    return (
        <>
            <div className="surface-card overflow-hidden rounded-2xl bg-white border border-gray-200">
                <div className="bg-gray-100 flex items-center justify-center relative overflow-hidden" style={{ aspectRatio: '8.5 / 11' }}>
                    {event.imageSrc ? (
                        <Image
                            src={event.imageSrc}
                            alt={event.title}
                            fill
                            className="image-outline object-cover"
                        />
                    ) : (
                        <Calendar className="w-12 h-12 text-gray-400" />
                    )}
                </div>

                <div className="p-4">
                    <span className="inline-block text-xs font-semibold text-primary bg-primary/8 px-2 py-0.5 rounded-full mb-2">
                        {event.date}
                    </span>
                    <h3 className="text-base font-bold text-gray-900 mb-1">
                        {event.title}
                    </h3>
                    <p className="text-sm text-gray-500">{event.description}</p>

                    {event.links && event.links.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-4">
                            {event.links.map((link, idx) => (
                                <a
                                    key={idx}
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-link-subtle inline-flex items-center gap-1.5 text-xs text-gray-500"
                                >
                                    <ExternalLink size={12} />
                                    {link.label}
                                </a>
                            ))}
                        </div>
                    )}

                    {event.photos && event.photos.length > 0 && (
                        <div className="mt-2">
                            <button
                                onClick={() => setLightboxOpen(true)}
                                className="text-link-subtle inline-flex items-center gap-1.5 text-xs text-gray-500"
                            >
                                <Camera size={12} />
                                View photos ({event.photos.length})
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {lightboxOpen && event.photos && (
                <PhotoLightbox
                    photos={event.photos}
                    eventTitle={event.title}
                    onClose={() => setLightboxOpen(false)}
                />
            )}
        </>
    );
}

export default function EventsPage() {
    return (
        <div className="flex flex-col min-h-screen bg-white">
            <PageHero
                title="Events"
                subtitle="Upcoming and past talks, workshops, and competitions."
            />

            {/* Upcoming Events */}
            <Section className="bg-gray-50 border-b border-gray-200">
                <div className="max-w-6xl mx-auto">
                    <Reveal>
                        <h2 className={`${sectionTitleClass} text-gray-900 mb-6`}>Upcoming Events</h2>
                    </Reveal>
                    <StaggerGroup className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {upcomingEvents.map((event, idx) => (
                            <StaggerItem key={idx}>
                                <UpcomingEventCard event={event} />
                            </StaggerItem>
                        ))}
                    </StaggerGroup>
                </div>
            </Section>

            {/* Past Events */}
            <Section className="bg-white">
                <div className="max-w-6xl mx-auto">
                    <Reveal>
                        <h2 className={`${sectionTitleClass} text-gray-900 mb-6`}>Past Events</h2>
                    </Reveal>
                    <StaggerGroup className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {pastEvents.map((event, idx) => (
                            <StaggerItem key={idx}>
                                <PastEventCard event={event} />
                            </StaggerItem>
                        ))}
                    </StaggerGroup>
                </div>
            </Section>
        </div>
    );
}
