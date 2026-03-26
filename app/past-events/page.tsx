'use client';

import Section from "@/components/Section";
import Image from "next/image";
import { Calendar, Camera, ChevronLeft, ChevronRight, ExternalLink, X } from "lucide-react";
import { ReactNode, useCallback, useEffect, useState } from "react";

interface EventLink {
    label: string;
    url: string;
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
        title: "AI Policy Hackathon",
        dateRange: "March 28 – April 4, 2026",
        description:
            "A week-long hackathon focused on AI policy. Participants will work in teams to develop policy proposals and solutions to pressing AI governance challenges.",
        imageSrc: "/images/past-events/VAISI Policy Hackathon.png",
        links: [
            { label: "Event details", url: "https://docs.google.com/document/d/1OMX8OoSnwxvP-Hb9O4aZ58GOCFGYL2svoEdk3f4MPjE/edit?tab=t.0" },
            { label: "Sign up / Interest form", url: "https://docs.google.com/forms/d/e/1FAIpQLScvmH8Vh1h-Hnbwa5_vKD5E_fl4J9dKVTRud-xmLO2RbNbEbQ/viewform" },
        ],
    },
];

const pastEvents: PastEvent[] = [
    {
        title: "Future of AI Panel",
        date: "March 24, 2026",
        description: (
            <>
                Professors{" "}
                <a href="https://www.korinek.com/" target="_blank" rel="noopener noreferrer" className="text-secondary underline hover:text-primary transition-colors">Anton Korinek</a>
                ,{" "}
                <a href="https://www.cs.virginia.edu/~evans/" target="_blank" rel="noopener noreferrer" className="text-secondary underline hover:text-primary transition-colors">David Evans</a>
                , and{" "}
                <a href="https://www.daviddanks.org/" target="_blank" rel="noopener noreferrer" className="text-secondary underline hover:text-primary transition-colors">David Danks</a>
                {" "}discussed the future of AI, moderated by VAISI president Jason Chin. Format: 5–6pm guided panel discussion, 6–6:30pm audience Q&A.
            </>
        ),
        imageSrc: "/images/past-events/AI Future Panel.png",
        photos: [],
    },
    {
        title: "HooHacks",
        date: "March 21–22, 2026",
        description: "Virginia's biggest hackathon and one of the top 50 collegiate hackathons in the US. VAISI sponsored the AI Safety and Alignment Evaluations track, challenging participants to build projects focused on the safe creation and deployment of AI models.",
        imageSrc: "/images/past-events/hoohacks.png",
        photos: [
            //"/images/past-events/hoohacks.png",
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
                <a href="https://ai-2027.com/" target="_blank" rel="noopener noreferrer" className="text-secondary underline hover:text-primary transition-colors">
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

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80" onClick={onClose}>
            <div className="relative w-full max-w-3xl mx-4" onClick={(e) => e.stopPropagation()}>
                <button
                    onClick={onClose}
                    className="absolute -top-12 right-0 text-white/80 hover:text-white transition-colors"
                >
                    <X size={28} />
                </button>

                <div className="bg-black rounded-lg overflow-hidden">
                    <Image
                        src={photos[currentIndex]}
                        alt={`${eventTitle} photo ${currentIndex + 1}`}
                        width={800}
                        height={600}
                        className="w-full h-auto"
                    />
                </div>

                {photos.length > 1 && (
                    <>
                        <button
                            onClick={goPrev}
                            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 text-white/80 hover:text-white transition-colors"
                        >
                            <ChevronLeft size={36} />
                        </button>
                        <button
                            onClick={goNext}
                            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 text-white/80 hover:text-white transition-colors"
                        >
                            <ChevronRight size={36} />
                        </button>
                    </>
                )}

                <p className="text-center text-white/70 text-sm mt-3">
                    {currentIndex + 1} / {photos.length}
                </p>
            </div>
        </div>
    );
}

function UpcomingEventCard({ event }: { event: UpcomingEvent }) {
    return (
        <div className="bg-white rounded-lg border-2 border-secondary overflow-hidden hover:shadow-lg transition-shadow">
            {event.imageSrc && (
                <div className="bg-slate-100 flex items-center justify-center relative overflow-hidden" style={{ aspectRatio: '8.5 / 11' }}>
                    <Image
                        src={event.imageSrc}
                        alt={event.title}
                        fill
                        className="object-cover"
                    />
                </div>
            )}

            <div className="p-6">
                <h3 className="text-xl font-bold text-primary mb-1">{event.title}</h3>
                <p className="text-sm font-medium text-secondary mb-1">{event.dateRange}</p>
                {event.location && (
                    <p className="text-sm font-medium text-secondary mb-3">{event.location}</p>
                )}
                <p className="text-gray-600">{event.description}</p>

                {event.links && event.links.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-3">
                        {event.links.map((link, idx) => (
                            <a
                                key={idx}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 text-sm font-semibold text-secondary hover:text-primary transition-colors"
                            >
                                <ExternalLink size={14} />
                                {link.label}
                            </a>
                        ))}
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
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
                <div className="bg-slate-100 flex items-center justify-center relative overflow-hidden" style={{ aspectRatio: '8.5 / 11' }}>
                    {event.imageSrc ? (
                        <Image
                            src={event.imageSrc}
                            alt={event.title}
                            fill
                            className="object-cover"
                        />
                    ) : (
                        <Calendar className="w-12 h-12 text-gray-300" />
                    )}
                </div>

                <div className="p-6">
                    <span className="inline-block text-xs font-semibold text-secondary bg-orange-50 px-2.5 py-1 rounded-full mb-3">
                        {event.date}
                    </span>
                    <h3 className="text-xl font-bold text-primary mb-2">
                        {event.title}
                    </h3>
                    <p className="text-gray-600">{event.description}</p>

                    {event.links && event.links.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-3">
                            {event.links.map((link, idx) => (
                                <a
                                    key={idx}
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 text-sm font-medium text-secondary hover:text-primary transition-colors"
                                >
                                    <ExternalLink size={14} />
                                    {link.label}
                                </a>
                            ))}
                        </div>
                    )}

                    {event.photos && event.photos.length > 0 && (
                        <div className="mt-3">
                            <button
                                onClick={() => setLightboxOpen(true)}
                                className="inline-flex items-center gap-1.5 text-sm font-medium text-secondary hover:text-primary transition-colors"
                            >
                                <Camera size={14} />
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
        <div className="flex flex-col min-h-screen">
            {/* Page Header */}
            <Section className="bg-primary text-white py-16">
                <div className="max-w-3xl mx-auto text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Events</h1>
                    <p className="text-xl text-blue-100">
                        Upcoming and past talks, workshops, and competitions.
                    </p>
                </div>
            </Section>

            {/* Upcoming Events */}
            <Section className="bg-slate-100">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-2xl font-bold text-primary mb-6">Upcoming Events</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {upcomingEvents.map((event, idx) => (
                            <UpcomingEventCard key={idx} event={event} />
                        ))}
                    </div>
                </div>
            </Section>

            {/* Past Events */}
            <Section className="bg-white">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-2xl font-bold text-primary mb-6">Past Events</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {pastEvents.map((event, idx) => (
                            <PastEventCard key={idx} event={event} />
                        ))}
                    </div>
                </div>
            </Section>
        </div>
    );
}
