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
                            <Globe className="text-secondary" /> Mission
                        </h2>
                        <p className="mb-4 text-lg font-medium text-gray-800">
                            Managing risks from advanced AI is one of the most important issues of our time, yet it lacks the attention it urgently requires.
                        </p>
                        <p className="mb-4">
                            <span className="font-semibold text-primary">Short-term:</span> Bring together UVA students to learn, discuss, and take action on AI safety.
                        </p>
                        <p>
                            <span className="font-semibold text-primary">Long-term:</span> Maintain a thriving community that equips talented individuals at UVA to ultimately contribute in meaningful ways to AI safety&apos;s most pressing problems in policy/governance and technical alignment.
                        </p>
                    </div>

                    <div className="mb-12">
                        <h2 className="text-2xl font-bold text-primary mb-4">History</h2>
                        <p className="mb-4">
                            VAISI was founded in Summer 2025 by Jason Chin and Andrew Broughton, who recognized that UVA lacked a dedicated community for students passionate about AI safety. With support from the <a href="https://pathfinder.kairos-project.org/" target="_blank" rel="noopener noreferrer" className="text-secondary hover:underline font-medium">Kairos Pathfinders Fellowship</a>, they secured the mentorship, funding, and global network to build something lasting.
                        </p>
                        <p className="mb-4">
                            We launched in Fall 2025 with weekly discussions exploring core AI safety concepts including technical alignment and governance challenges. This semester, we&apos;re expanding with a dedicated AI governance fellowship, deepening our engagement with both the technical and policy dimensions of this critical field.
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
