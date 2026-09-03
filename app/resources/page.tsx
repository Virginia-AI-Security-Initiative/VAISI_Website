'use client';

import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";
import { RotateCcw } from "lucide-react";
import Section from "@/components/Section";
import PageHero from "@/components/PageHero";
import { Reveal, StaggerGroup, StaggerItem, hoverLift } from "@/components/motion";

const introResources = [
    { title: "An Overview of Catastrophic AI Risks - CAIS", url: "https://safe.ai/ai-risk", type: "article" as const },
    { title: "The Catastrophic Risks of AI — and a Safer Path - Yoshua Bengio", url: "https://www.youtube.com/watch?v=qe9QSCF-d88", type: "video" as const },
    { title: "The Operational Risks of AI in Large-Scale Biological Attacks - RAND Corporation", url: "https://www.rand.org/pubs/research_reports/RRA2977-2.html", type: "article" as const },
];

const newsResources = [
    { title: "CSET Georgetown Newsletter", url: "https://cset.georgetown.edu/newsletters/", type: "article" as const },
    { title: "Import AI Newsletter - Jack Clark", url: "https://jack-clark.net/", type: "article" as const },
    { title: "ChinAI Newsletter - Jeffrey Ding", url: "https://chinai.substack.com/", type: "article" as const },
];

const careerResources = [
    { title: "Emerging Technology Policy Careers - Horizon Institute", url: "https://emergingtechpolicy.org/", type: "article" as const },
    { title: "Upskilling Courses - BlueDot Impact", url: "https://bluedot.org/", type: "article" as const },
];

const resourceSections = [
    {
        id: "understanding-ai-risk",
        title: "Understanding AI Risk",
        description: "Accessible introductions to the technical and policy challenges posed by advanced AI systems.",
        imageSrc: "/ai_risk.png",
        imagePosition: "center top",
        imagePaddingBottom: "1.5rem",
        resources: introResources,
        note: null as React.ReactNode,
    },
    {
        id: "ai-policy-risk-news",
        title: "AI Policy & Risk News",
        description: "Stay up to date with the latest developments in AI governance, risk research, and policy.",
        imageSrc: "/ai_news2.png",
        resources: newsResources,
        note: (
            <>
                <span className="font-semibold text-gray-800">UVA Students:</span> We highly recommend <span className="font-medium text-gray-800">Inside AI Policy&apos;s Weekly Report</span> (accessible via ProQuest).
            </>
        ),
    },
    {
        id: "career-resources",
        title: "Career Resources",
        description: "Explore career paths in AI governance, technical research, and policy.",
        imageSrc: "/career_resources2.png",
        imagePosition: "60% center",
        resources: careerResources,
        note: null as React.ReactNode,
    },
];

function ResourceList({ resources }: { resources: typeof introResources }) {
    return (
        <StaggerGroup className="space-y-2.5" stagger={0.04}>
            {resources.map((resource, idx) => (
                <StaggerItem key={idx}>
                    <a
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-link text-base text-gray-700 block"
                    >
                        {resource.title}
                    </a>
                </StaggerItem>
            ))}
        </StaggerGroup>
    );
}

function ResourceFlipCard({ section }: { section: typeof resourceSections[0] }) {
    const [flipped, setFlipped] = useState(false);

    return (
        <motion.div
            className="cursor-pointer"
            style={{ perspective: "1200px" }}
            onClick={() => setFlipped((f) => !f)}
            {...hoverLift}
        >
            <div
                className="relative w-full aspect-[3/4] md:aspect-[4/5]"
                style={{
                    transformStyle: "preserve-3d",
                    transition: "transform 0.65s cubic-bezier(0.4, 0, 0.2, 1)",
                    transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
                }}
            >
                {/* Front */}
                <div
                    className="absolute inset-0 rounded-2xl border-2 border-primary bg-white overflow-hidden flex flex-col"
                    style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}
                >
                    <div className="p-6 flex-shrink-0">
                        <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight mb-2">{section.title}</h3>
                        <p className="flex items-center gap-1.5 text-sm text-gray-400 select-none">
                            <RotateCcw size={12} />
                            Flip to see resources
                        </p>
                    </div>
                    <div
                        className="flex-1 relative"
                        style={{ marginBottom: section.imagePaddingBottom ?? 0 }}
                    >
                        <Image
                            src={section.imageSrc}
                            alt=""
                            fill
                            className="object-cover"
                            style={{ objectPosition: section.imagePosition ?? "center" }}
                        />
                    </div>
                </div>

                {/* Back */}
                <div
                    className="absolute inset-0 rounded-2xl border-2 border-primary bg-white overflow-y-auto"
                    style={{
                        backfaceVisibility: "hidden",
                        WebkitBackfaceVisibility: "hidden",
                        transform: "rotateY(180deg)",
                    }}
                >
                    <div className="p-6 pb-12">
                        <p className="text-gray-500 text-base leading-relaxed mb-4">{section.description}</p>
                        <ResourceList resources={section.resources} />
                        {section.note && (
                            <p className="mt-4 text-sm text-gray-500 leading-relaxed">{section.note}</p>
                        )}
                    </div>
                    <p className="absolute bottom-4 left-6 flex items-center gap-1.5 text-sm text-gray-400 select-none">
                        <RotateCcw size={12} />
                        Flip back
                    </p>
                </div>
            </div>
        </motion.div>
    );
}

export default function ResourcesPage() {
    return (
        <div className="flex flex-col min-h-screen bg-white">
            <PageHero
                title="Resources"
            />

            <Section>
                <div className="max-w-6xl mx-auto space-y-16">
                    <StaggerGroup className="grid grid-cols-1 md:grid-cols-3 gap-8" stagger={0.15}>
                        {resourceSections.map((section) => (
                            <StaggerItem key={section.id}>
                                <ResourceFlipCard section={section} />
                            </StaggerItem>
                        ))}
                    </StaggerGroup>

                    <hr className="border-gray-200" />

                    {/* Contact CTA */}
                    <Reveal className="text-center py-4">
                        <h2 className="text-[40px] md:text-[64px] font-bold leading-tight text-gray-900 mb-3">Get in Touch</h2>
                        <p className="text-gray-500 mb-5">
                            Interested in learning more or exploring opportunities in AI governance and technical research?
                        </p>
                        <a
                            href="mailto:vaisi.club@gmail.com"
                            className="font-semibold underline underline-offset-4 text-gray-700 decoration-gray-300 hover:decoration-secondary hover:text-secondary transition-all"
                        >
                            vaisi.club@gmail.com
                        </a>
                    </Reveal>
                </div>
            </Section>
        </div>
    );
}
