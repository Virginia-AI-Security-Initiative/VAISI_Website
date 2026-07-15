import Section from "@/components/Section";
import TeamSection from "@/components/TeamSection";
import { teamMembers, facultyAdvisors, formerMembers } from "./members";

export default function AboutPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <Section className="bg-slate-50">
                <div className="prose prose-lg max-w-4xl mx-auto text-gray-700">
                    <div className="mb-12">
                        <h1 className="text-5xl font-bold text-primary mb-4 text-center">Mission</h1>
                        <p className="mb-14 text-lg font-bold text-gray-900 text-center">
                            Mitigate catastrophic risks from advanced AI.
                        </p>
                        <h2 className="text-2xl font-bold text-primary mb-4 text-left">Our Path Forward</h2>
                        <p className="mb-4">
                            <span className="font-semibold text-primary">Short-term:</span> Further establish our presence at UVA and build a core group of active and dedicated members. Internally, expand operational capacity to support future programs.
                        </p>
                        <p>
                            <span className="font-semibold text-primary">Long-term:</span> Maintain a thriving organization that provides the UVA community with opportunities to upskill, discuss, research, and meaningfully contribute to the most pressing challenges in AI governance and technical alignment.
                        </p>
                    </div>
                </div>

                <TeamSection
                    currentMembers={teamMembers}
                    facultyAdvisors={facultyAdvisors}
                    formerMembers={formerMembers}
                />
            </Section>
        </div>
    );
}
