import Section from "@/components/Section";
import TeamMemberCard from "@/components/TeamMemberCard";

// Mock Data for Team Members
const teamMembers = [
    {
        id: 1,
        name: "Alex Johnson",
        title: "President",
        imageSrc: "" // Placeholder
    },
    {
        id: 2,
        name: "Samantha Lee",
        title: "Vice President of Research",
        imageSrc: ""
    },
    {
        id: 3,
        name: "David Chen",
        title: "Vice President of Operations",
        imageSrc: ""
    },
    {
        id: 4,
        name: "Sarah Williams",
        title: "Head of Communications",
        imageSrc: ""
    },
    {
        id: 5,
        name: "Michael Brown",
        title: "Technical Lead",
        imageSrc: ""
    },
    {
        id: 6,
        name: "Emily Davis",
        title: "Fellowship Coordinator",
        imageSrc: ""
    }
];

export default function TeamPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <Section className="bg-slate-50">
                <h1 className="text-4xl font-bold text-primary mb-4 text-center">Our Team</h1>
                <p className="text-xl text-gray-600 text-center max-w-2xl mx-auto mb-12">
                    Meet the students driving the Virginia AI Safety Initiative forward.
                </p>

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
