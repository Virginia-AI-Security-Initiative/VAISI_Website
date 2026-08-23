'use client';

import Image from "next/image";
import { ArrowRight, ArrowUpRight, ChevronDown } from "lucide-react";
import Section from "@/components/Section";
import PageHero from "@/components/PageHero";
import TeamSection from "@/components/TeamSection";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/motion";
import { teamMembers, facultyAdvisors, formerMembers } from "./members";

const pathForward = [
    {
        title: "Short-term",
        iconSrc: "/short_term_icon.png",
        description: "Further establish our presence at UVA and build a core group of active and dedicated members. Internally, expand operational capacity to support future programs.",
    },
    {
        title: "Long-term",
        iconSrc: "/long_term_icon.png",
        description: "Maintain a thriving organization that provides the UVA community with opportunities to upskill, discuss, research, and meaningfully contribute to the most pressing challenges in AI governance and technical alignment.",
    },
];

export default function AboutPage() {
    return (
        <div className="flex flex-col min-h-screen bg-white">
            <PageHero
                title="Mission"
                subtitle="Mitigate catastrophic risks from advanced AI."
            />
            <Section className="bg-white">
                <div className="max-w-6xl mx-auto">
                    <Reveal className="mb-20 md:mb-24">
                        <div className="surface-panel relative overflow-hidden rounded-2xl bg-[#F7F8FB] px-7 py-8 sm:px-10 sm:py-10">
                            <div className="absolute inset-y-0 left-0 w-1.5 bg-secondary" aria-hidden="true" />
                            <div className="flex flex-col gap-7 md:flex-row md:items-end md:justify-between md:gap-12">
                                <div className="max-w-3xl">
                                    <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-secondary">
                                        Our motivation
                                    </p>
                                    <h2 className="text-balance text-3xl font-bold leading-tight text-gray-900 sm:text-4xl">
                                        Why VAISI Exists
                                    </h2>
                                    <p className="mt-4 text-pretty text-lg leading-relaxed text-gray-500">
                                        An explanation of why VAISI exists, the problem we&apos;re responding to, and what we do about it.
                                    </p>
                                </div>
                                <a
                                    href="https://vaisi.substack.com/p/why-vaisi-exists"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="tap-scale inline-flex min-h-11 shrink-0 items-center justify-center gap-2 self-start rounded-full bg-primary pl-5 pr-[18px] text-sm font-semibold text-white hover:bg-primary/90 md:self-auto"
                                >
                                    Read the post
                                    <ArrowUpRight size={17} aria-hidden="true" />
                                </a>
                            </div>
                        </div>
                    </Reveal>

                    <div className="mb-16">
                        <Reveal>
                            <h2 className="text-[40px] md:text-[64px] font-bold text-gray-900 leading-tight mb-14">Our Path Forward</h2>
                        </Reveal>

                        <div className="relative">
                            {/* Timeline line: vertical on mobile, horizontal on desktop */}
                            <div className="md:hidden absolute left-7 top-7 bottom-7 w-0.5 bg-gray-200" />
                            <div className="hidden md:block absolute top-7 left-0 right-0 h-0.5 bg-gray-200" />

                            <StaggerGroup
                                className="flex flex-col md:flex-row md:items-start md:justify-between gap-10 md:gap-6"
                                stagger={0.2}
                            >
                                {/* "Today" starting point */}
                                <StaggerItem className="relative flex items-center gap-5 md:flex-col md:items-center md:text-center">
                                    <div className="relative z-10 flex-shrink-0 w-14 h-14 flex items-center justify-center">
                                        <div className="w-3.5 h-3.5 rounded-full bg-primary ring-4 ring-primary/15" />
                                    </div>
                                    <span className="text-xs font-semibold uppercase tracking-widest text-gray-400 md:mt-1">
                                        Today
                                    </span>
                                </StaggerItem>

                                {pathForward.map((item) => (
                                    <StaggerItem
                                        key={item.title}
                                        className="relative flex items-start gap-5 md:flex-col md:items-center md:text-center md:max-w-xs"
                                    >
                                        <div className="relative z-10 flex-shrink-0 w-14 h-14 rounded-full bg-white border-2 border-primary flex items-center justify-center">
                                            <Image src={item.iconSrc} alt="" width={28} height={28} className="object-contain" />
                                        </div>
                                        <div className="md:mt-5">
                                            <h3 className="text-xl font-bold text-gray-900 mb-1">{item.title}</h3>
                                            <p className="text-gray-500 text-sm leading-relaxed">{item.description}</p>
                                        </div>
                                    </StaggerItem>
                                ))}

                                {/* Continues into the future */}
                                <StaggerItem className="relative flex items-center gap-5 md:flex-col md:items-center md:text-center">
                                    <div className="relative z-10 flex-shrink-0 w-14 h-14 flex items-center justify-center">
                                        <ArrowRight size={22} className="hidden md:block text-gray-300" />
                                        <ChevronDown size={22} className="md:hidden text-gray-300" />
                                    </div>
                                </StaggerItem>
                            </StaggerGroup>
                        </div>
                    </div>

                    <TeamSection
                        currentMembers={teamMembers}
                        facultyAdvisors={facultyAdvisors}
                        formerMembers={formerMembers}
                    />
                </div>
            </Section>
        </div>
    );
}
