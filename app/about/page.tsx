import Section from "@/components/Section";
import TeamMemberCard from "@/components/TeamMemberCard";

const teamMembers = [
    {
        id: 1,
        name: "Jason Chin",
        title: "President",
        imageSrc: "/team/jason.jpg",
        linkedinUrl: "https://www.linkedin.com/in/jasonchin9/"
    },
    {
        id: 2,
        name: "Seth Lifland",
        title: "Vice President",
        imageSrc: "/team/seth.jpeg",
        linkedinUrl: "https://www.linkedin.com/in/seth-lifland-8a604b326/"
    },
    {
        id: 3,
        name: "Andrew Broughton",
        title: "Operations Co-Lead",
        imageSrc: "/team/andrew.png",
        linkedinUrl: "https://www.linkedin.com/in/andrewmbroughton/"
    },
    {
        id: 4,
        name: "Lily Egenrieder",
        title: "Operations Co-Lead",
        imageSrc: "/team/lily.jpeg",
        linkedinUrl: "https://www.linkedin.com/in/lily-egenrieder/"
    },
    {
        id: 5,
        name: "Elias Krasny",
        title: "Event Coordinator",
        imageSrc: "/team/elias.jpeg",
        linkedinUrl: "https://www.linkedin.com/in/elias-krasny-82b433305/"
    },
    {
        id: 6,
        name: "Shubhrangshu Debsarkar",
        title: "Outreach Lead",
        imageSrc: "/team/shubs.JPG",
        linkedinUrl: "https://www.linkedin.com/in/shubhrangshu-debsarkar-204683257/"
    },
    {
        id: 7,
        name: "Open Position",
        title: "Media Lead",
        imageSrc: "/team/VAISI_Logo.jpg"
    }
];

export default function AboutPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <Section className="bg-slate-50">
                <div className="prose prose-lg max-w-4xl mx-auto text-gray-700">
                    <div className="mb-12">
                        <h1 className="text-5xl font-bold text-primary mb-4 text-left">Mission</h1>
                        <p className="mb-14 text-lg font-bold text-gray-900 text-left">
                            Mitigate catastrophic risks from advanced AI.
                        </p>
                        <h2 className="text-2xl font-bold text-primary mb-4 text-center">Our Path Forward</h2>
                        <p className="mb-4">
                            <span className="font-semibold text-primary">Short-term:</span> Further establish our presence at UVA and build a core group of active and dedicated members. Internally, expand operational capacity to support future programs.
                        </p>
                        <p>
                            <span className="font-semibold text-primary">Long-term:</span> Maintain a thriving organization that provides the UVA community with opportunities to upskill, discuss, research, and meaningfully contribute to AI safety's most pressing challenges in governance and technical alignment.
                        </p>
                    </div>

                    <div className="mb-12">
                        <h2 className="text-2xl font-bold text-primary mb-4 text-center">History</h2>
                        <p className="mb-4">
                            VAISI was founded in Summer 2025 by UVA students who recognized that UVA lacked a dedicated community for students passionate about AI safety. With support from the <a href="https://pathfinder.kairos-project.org/" target="_blank" rel="noopener noreferrer" className="text-secondary hover:underline font-medium">Kairos Pathfinders Fellowship</a>, they secured the mentorship, funding, and global network to establish a meaningful and enduring initiative.
                        </p>
                        <p className="mb-4">
                            We launched in Fall 2025 with weekly discussions exploring core AI safety concepts including technical alignment and governance challenges. This semester, we&apos;re expanding with a dedicated AI governance fellowship, deepening our engagement with both the technical and policy dimensions of this critical field.
                        </p>
                        <p className="mb-4">
                            We are in the process of becoming a UVA Contracted Independent Organization (CIO).
                        </p>
                    </div>
                </div>

                <h2 className="text-2xl font-bold text-primary mb-4 text-center">Meet the Team</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                    {teamMembers.map((member) => (
                        <TeamMemberCard
                            key={member.id}
                            name={member.name}
                            title={member.title}
                            imageSrc={member.imageSrc}
                            linkedinUrl={member.linkedinUrl}
                        />
                    ))}
                </div>
            </Section>
        </div>
    );
}
