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

                    <div className="mb-12">
                        <h2 className="text-2xl font-bold text-primary mb-4 text-left">History</h2>
                        <p className="mb-4">
                            VAISI was founded in Summer 2025 by UVA students who recognized that UVA lacked a dedicated community for students passionate about AI risk and alignment. With support from the <a href="https://pathfinder.kairos-project.org/" target="_blank" rel="noopener noreferrer" className="text-secondary hover:underline font-medium">Kairos Pathfinders Fellowship</a>, they secured the mentorship, funding, and global network to establish a meaningful and enduring initiative.
                        </p>
                        <p className="mb-4">
                            We launched in Fall 2025 with weekly discussions exploring core concepts in AI governance, risk, and alignment. This semester, we&apos;re expanding with a dedicated AI governance fellowship, deepening our engagement with both the technical and policy dimensions of this critical field.
                        </p>
                        <p className="mb-4">
                            We are in the process of becoming a UVA Contracted Independent Organization (CIO).
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
