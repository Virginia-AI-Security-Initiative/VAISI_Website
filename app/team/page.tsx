import Section from "@/components/Section";
import TeamMemberCard from "@/components/TeamMemberCard";

// Mock Data for Team Members
const teamMembers = [
    {
        id: 1,
        name: "Jason Chin",
        title: "President",
        imageSrc: "/team/jason.jpg"
    },
    {
        id: 2,
        name: "Seth Lifland",
        title: "Vice President",
        imageSrc: "/team/seth.jpeg"
    },
    {
        id: 3,
        name: "Andrew Broughton",
        title: "Operations Lead",
        imageSrc: "/team/andrew.png"
    },
    {
        id: 4,
        name: "Lily Egenrieder",
        title: "Lead Editor",
        imageSrc: "/team/AISI_Logo.png"
    },
    {
        id: 5,
        name: "Elias Krasny",
        title: "Event Coordinator",
        imageSrc: "/team/AISI_Logo.png"
    }
];

export default function TeamPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <Section className="bg-slate-50">
                <h1 className="text-4xl font-bold text-primary mb-4 text-center">Our Team</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {teamMembers.map((member) => (
                        <TeamMemberCard
                            key={member.id}
                            name={member.name}
                            title={member.title}
                            imageSrc={member.imageSrc}
                        />
                    ))}
                </div>
            </Section>
        </div>
    );
}
