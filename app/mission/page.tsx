import Section from "@/components/Section";
import { Globe } from "lucide-react";
import { DiscordIcon, GroupMeIcon } from "@/components/Icons";

export default function MissionPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <Section className="bg-slate-50">
                <div className="prose prose-lg max-w-4xl mx-auto text-gray-700">
                    <div className="mb-12">
                        <h1 className="text-5xl font-bold text-primary mb-4 text-left">Mission</h1>
                        <p className="mb-14 text-lg font-bold text-gray-900 text-left">
                            Mitigate catastrophic risks from advanced AI.
                        </p>
                        <h3 className="text-xl font-bold text-gray-900 mb-6">Our Path Forward</h3>
                        <p className="mb-4">
                            <span className="font-semibold text-primary">Short-term:</span> Further establish our presence at UVA and build a core group of active and dedicated members. Internally, expand operational capacity to support future programs.
                        </p>
                        <p>
                            <span className="font-semibold text-primary">Long-term:</span> Maintain a thriving organization that provides the UVA community with opportunities to upskill, discuss, research, and meaningfully contribute to AI safety's most pressing challenges in governance and technical alignment.
                        </p>
                    </div>
                </div>
            </Section>

            <Section className="bg-white border-t border-gray-100">
                <h2 className="text-3xl font-bold text-center text-primary mb-10">Connect With Us</h2>
                <div className="flex justify-center gap-6 flex-wrap">
                    <a
                        href="https://discord.gg/CNrRYtbtAu"
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
                </div>
            </Section>
        </div>
    );
}
