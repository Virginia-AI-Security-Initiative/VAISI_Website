import Section from "@/components/Section";
import { Twitter, Linkedin, MessageSquare, Globe } from "lucide-react";
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
                            The Virginia AI Safety Initiative (VAISI) aims to equip students at the University of Virginia with the knowledge and resources to contribute to the safety and alignment of advanced artificial intelligence systems. We strive to foster a community of critical thinkers who can navigate the technical, ethical, and societal challenges posed by transformative AI.
                        </p>
                    </div>

                    <div className="mb-12">
                        <h2 className="text-2xl font-bold text-primary mb-4">History</h2>
                        <p className="mb-4">
                            Founded in 2023, VAISI emerged from a growing recognition of the urgent need for AI safety research and education at UVA. Started by a small group of computer science and philosophy students, the club has arguably grown to become a hub for interdisciplinary discussion on campus.
                        </p>
                        <p>
                            We have hosted numerous workshops, reading groups, and guest speakers, connecting UVA students with the global AI safety community.
                        </p>
                    </div>
                </div>
            </Section>

            <Section className="bg-white border-t border-gray-100">
                <h2 className="text-3xl font-bold text-center text-primary mb-10">Connect With Us</h2>
                <div className="flex justify-center gap-6 flex-wrap">
                    <a
                        href="https://twitter.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 px-6 py-4 bg-[#1DA1F2] text-white rounded-lg hover:opacity-90 transition-opacity font-bold shadow-sm"
                    >
                        <Twitter size={24} />
                        Twitter / X
                    </a>
                    <a
                        href="https://linkedin.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 px-6 py-4 bg-[#0A66C2] text-white rounded-lg hover:opacity-90 transition-opacity font-bold shadow-sm"
                    >
                        <Linkedin size={24} />
                        LinkedIn
                    </a>
                    <a
                        href="https://discord.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 px-6 py-4 bg-[#5865F2] text-white rounded-lg hover:opacity-90 transition-opacity font-bold shadow-sm"
                    >
                        <MessageSquare size={24} />
                        Discord Community
                    </a>
                </div>
            </Section>
        </div>
    );
}
