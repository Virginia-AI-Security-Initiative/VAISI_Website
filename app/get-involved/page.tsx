import Section from "@/components/Section";
import { Calendar, MapPin, Clock, Users, BookOpen, Sparkles } from "lucide-react";

// Event Types Data
const eventTypes = [
    {
        id: 1,
        title: "AI Governance Fellowship",
        icon: BookOpen,
        iconBg: "bg-blue-50",
        iconColor: "text-primary",
        details: {
            day: "Mondays",
            time: "6:00 PM - 7:30 PM",
            location: "Rice Hall 130"
        },
        description: "An 8-week structured program exploring AI policy, governance frameworks, and the regulatory landscape. Fellows engage with key readings, participate in discussions, and develop policy proposals addressing real-world AI governance challenges.",
        cta: {
            text: "Apply Now",
            link: "#"
        }
    },
    {
        id: 2,
        title: "Weekly Meetings",
        icon: Users,
        iconBg: "bg-orange-50",
        iconColor: "text-secondary",
        details: {
            day: "Sundays",
            time: "4:30 PM - 5:30 PM",
            location: "Newcomb Hall 389"
        },
        description: "Our general body meetings are open to all UVA students, regardless of background or experience. Each week we explore different AI safety concepts through presentations, discussions, and interactive activities. A great way to learn and connect with like-minded peers.",
        cta: null
    },
    {
        id: 3,
        title: "Special Events",
        icon: Sparkles,
        iconBg: "bg-purple-50",
        iconColor: "text-purple-600",
        details: {
            day: "Varies",
            time: "Check calendar",
            location: "TBA"
        },
        description: "Throughout the semester, we host guest speakers, workshops, movie screenings, and collaborative events with other organizations. These events provide unique opportunities to engage with experts and explore AI safety topics in depth.",
        cta: null
    }
];

export default function GetInvolvedPage() {
    return (
        <div className="flex flex-col min-h-screen">
            {/* Hero Section */}
            <Section className="bg-primary text-white py-20">
                <div className="max-w-3xl mx-auto text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">Get Involved</h1>
                    <p className="text-xl text-blue-100">
                        Join a community of students dedicated to ensuring the safe development of AI.
                    </p>
                </div>
            </Section>

            {/* Event Types Section */}
            <Section className="bg-white">
                <h2 className="text-3xl font-bold text-primary mb-10 text-center">Our Events</h2>
                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {eventTypes.map((event) => {
                        const IconComponent = event.icon;
                        return (
                            <div key={event.id} className="bg-slate-50 rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow">
                                {/* Header */}
                                <div className="p-6 border-b border-gray-100">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className={`w-12 h-12 ${event.iconBg} rounded-full flex items-center justify-center`}>
                                            <IconComponent className={`w-6 h-6 ${event.iconColor}`} />
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-800">{event.title}</h3>
                                    </div>

                                    {/* Details */}
                                    <div className="space-y-2 text-sm">
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <Calendar className="w-4 h-4 text-gray-400" />
                                            <span>{event.details.day}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <Clock className="w-4 h-4 text-gray-400" />
                                            <span>{event.details.time}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <MapPin className="w-4 h-4 text-gray-400" />
                                            <span>{event.details.location}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Description */}
                                <div className="p-6">
                                    <p className="text-gray-600 text-sm leading-relaxed mb-4">
                                        {event.description}
                                    </p>
                                    {event.cta && (
                                        <a
                                            href={event.cta.link}
                                            className="inline-block px-6 py-2 bg-primary text-white font-bold rounded-md hover:bg-blue-900 transition-colors text-sm"
                                        >
                                            {event.cta.text}
                                        </a>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </Section>

            {/* Calendar Section */}
            <Section className="bg-slate-50 border-t border-gray-100">
                <h2 className="text-3xl font-bold text-primary mb-8 text-center">Event Calendar</h2>
                <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <iframe
                        src=""
                        className="w-full border-0"
                        style={{ height: "600px" }}
                        title="VAISI Event Calendar"
                    />
                </div>
                <p className="text-center text-gray-500 text-sm mt-4">
                    Events shown in Eastern Time (ET)
                </p>
            </Section>

            {/* Join CTA */}
            <Section className="bg-primary text-white">
                <div className="max-w-3xl mx-auto text-center">
                    <h2 className="text-3xl font-bold mb-4">Ready to Join?</h2>
                    <p className="text-xl text-blue-100 mb-8">
                        No prior experience required. All UVA students are welcome!
                    </p>
                    <div className="flex justify-center gap-4 flex-wrap">
                        <a
                            href="https://discord.gg/XyqmJE5emc"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-8 py-3 bg-white text-primary font-bold rounded-md hover:bg-gray-100 transition-colors"
                        >
                            Join our Discord
                        </a>
                        <a
                            href="https://groupme.com/join_group/110490963/bxseYw8L"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-8 py-3 bg-transparent border-2 border-white text-white font-bold rounded-md hover:bg-white/10 transition-colors"
                        >
                            Join our GroupMe
                        </a>
                    </div>
                </div>
            </Section>
        </div>
    );
}
