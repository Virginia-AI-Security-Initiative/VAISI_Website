import Section from "@/components/Section";
import { Instagram, Globe } from "lucide-react";
import { DiscordIcon, GroupMeIcon } from "@/components/Icons";
import Link from "next/link";

export default function AboutPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <Section className="bg-slate-50">
                <h1 className="text-4xl font-bold text-primary mb-8 text-center">About VAISI</h1>

                <div className="prose prose-lg max-w-4xl mx-auto text-gray-700">
                    <div className="mb-12">
                        <h2 className="text-2xl font-bold text-primary mb-4 flex items-center gap-2">
                            <Globe className="text-secondary" /> Mission Statement
                        </h2>
                        <p>
                            The Virginia AI Safety Initiative (VAISI) aims to equip students at the University of Virginia with the knowledge and resources to contribute to the safety and alignment of advanced artificial intelligence systems. We believe AI safety is one of the most pressing issues facing our society, and we strive to foster a community of critical thinkers who can navigate the technical, ethical, and societal challenges posed by transformative AI.
                        </p>
                    </div>

                    <div className="mb-12">
                        <h2 className="text-2xl font-bold text-primary mb-4">History</h2>
                        <p className="mb-4">
                            Founded in Fall 2025, VAISI emerged from a shared conviction that ensuring the safe development of AI is one of the most important challenges of our time.
                        </p>
                        <p className="mb-4">
                            We are proud to be part of the <a href="https://pathfinder.kairos-project.org/" target="_blank" rel="noopener noreferrer" className="text-secondary hover:underline font-medium">Kairos Pathfinder Fellowship</a>, which has helped guide our growth and connect us with the broader AI safety community.
                        </p>
                        <p>
                            In our first semester, we held weekly meetings exploring core AI safety concepts. This semester, we&apos;re expanding our offerings to include a weekly AI governance fellowship, deepening our engagement with both the technical and policy dimensions of AI safety.
                        </p>
                    </div>
                </div>
            </Section>

            <Section className="bg-white border-t border-gray-100">
                <h2 className="text-3xl font-bold text-center text-primary mb-10">Connect With Us</h2>
                <div className="flex justify-center gap-6 flex-wrap">
                    <a
                        href="https://discord.gg/XyqmJE5emc"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 px-6 py-4 bg-[#5865F2] text-white rounded-lg hover:opacity-90 transition-opacity font-bold shadow-sm"
                    >
                        <DiscordIcon size={24} />
                        Discord
                    </a>
                    <a
                        href="https://groupme.com/join_group/110490963/bxseYw8L"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 px-6 py-4 bg-[#00AFF0] text-white rounded-lg hover:opacity-90 transition-opacity font-bold shadow-sm"
                    >
                        <GroupMeIcon size={24} />
                        GroupMe
                    </a>
                    <div
                        className="flex items-center gap-3 px-6 py-4 bg-gray-300 text-gray-500 rounded-lg font-bold shadow-sm cursor-not-allowed relative"
                        title="Coming Soon"
                    >
                        <Instagram size={24} />
                        Instagram
                        <span className="absolute -top-2 -right-2 bg-secondary text-white text-xs px-2 py-0.5 rounded-full">Soon</span>
                    </div>
                </div>
            </Section>
        </div>
    );
}
