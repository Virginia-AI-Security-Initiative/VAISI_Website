import Section from "@/components/Section";
import { Calendar, Clock, BookOpen, Sparkles, Users } from "lucide-react";

// Event Types Data
const eventTypes = [
    {
        id: 1,
        title: "Intro to AI Safety Fellowship",
        icon: BookOpen,
        iconBg: "bg-blue-50",
        iconColor: "text-primary",
        details: {
            schedule: "Monday, Tuesday, or Wednesday",
            time: "6:15-8:15 PM",
            duration: "8 weeks"
        },
        description: "Build a foundation in AI safety through a weekly reading and discussion group covering advanced AI risks and current safety research. Dinner is provided, there is no mandatory reading outside the fellowship, and participants may complete an optional capstone project.",
        cta: {
            text: "Apply here by September 13",
            link: "https://airtable.com/appM8XoHX2voW3LQe/pag7pdRcPx9uhaRnF/form"
        }
    },
    {
        id: 2,
        title: "AI Policy Fellowship",
        icon: BookOpen,
        iconBg: "bg-orange-50",
        iconColor: "text-secondary",
        details: {
            schedule: "Monday, Tuesday, or Thursday",
            time: "6:15-8:15 PM",
            duration: "10 weeks"
        },
        description: "Explore AI policy and governance in a weekly cohort covering technical foundations, frontier policy, national security, safety regulation, corporate governance, and careers. Dinner is provided, with 0-30 minutes of weekly reading and an optional capstone project.",
        cta: {
            text: "Apply here by September 13",
            link: "https://airtable.com/appM8XoHX2voW3LQe/pag7pdRcPx9uhaRnF/form"
        }
    },
    {
        id: 3,
        title: "VAISI Membership",
        icon: Users,
        iconBg: "bg-emerald-50",
        iconColor: "text-emerald-700",
        details: {
            schedule: "Applications reviewed on a rolling basis",
            time: "Ongoing",
            duration: "Active membership"
        },
        description: "Join VAISI's core community for members-only Slack, career advising and mentorship, travel and compute grant opportunities, exclusive socials, talks, networking, and weekly discussions. Strong applicants will have completed a VAISI fellowship or have equivalent experience; members are expected to participate actively.",
        cta: {
            text: "Apply for Membership",
            link: "https://airtable.com/appM8XoHX2voW3LQe/pagzBI6YepuXbbfBr/form"
        }
    },
    {
        id: 4,
        title: "Special Events",
        icon: Sparkles,
        iconBg: "bg-purple-50",
        iconColor: "text-purple-600",
        details: {
            schedule: "Event dependent",
            time: "Event dependent",
            duration: "Event dependent"
        },
        description: "Throughout the semester, we will host special events including guest speakers, hackathons (both technical and policy-focused), collaborations with other student organizations, and fun community activities. Stay tuned for announcements!",
        cta: {
            text: "View Events",
            link: "/past-events"
        }
    }
];

export default function GetInvolvedPage() {
    return (
        <div className="flex flex-col min-h-screen">
            {/* Hero Section */}
            <Section className="bg-primary text-white py-20">
                <div className="max-w-3xl mx-auto text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">Get Involved</h1>
                </div>
            </Section>

            {/* General Interest Form Section */}
            <Section className="bg-white">
                <div className="max-w-3xl mx-auto text-center">
                    {/* <h2 className="text-3xl font-bold text-primary mb-4">Join VAISI</h2> */}
                    <p className="text-gray-700 font-semibold mb-3 text-center">
                        Interested in joining VAISI?
                    </p>
                    <p className="text-gray-700 mb-6">
                        Fill out this form to express your interest and stay updated on opportunities, events, and more!
                    </p>
                    <a
                        href="https://forms.gle/tMM3iyH7us1emrGr6"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block px-8 py-3 bg-primary text-white font-bold rounded-md hover:bg-blue-900 transition-colors"
                    >
                        Express Interest
                    </a>
                </div>
            </Section>

            {/* Event Types Section */}
            <Section className="bg-slate-50 border-t border-gray-100">
                <h2 className="text-3xl font-bold text-primary mb-10 text-center">Ways to Get Involved</h2>
                <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
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
                                            <span>{event.details.schedule}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <Clock className="w-4 h-4 text-gray-400" />
                                            <span>{event.details.time}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <BookOpen className="w-4 h-4 text-gray-400" />
                                            <span>{event.details.duration}</span>
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
                                            target={event.cta.link.startsWith("http") ? "_blank" : undefined}
                                            rel={event.cta.link.startsWith("http") ? "noopener noreferrer" : undefined}
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
                        src="https://calendar.google.com/calendar/embed?src=vaisi.club%40gmail.com&ctz=America%2FNew_York"
                        className="w-full border-0"
                        style={{ height: "600px" }}
                        title="VAISI Event Calendar"
                        scrolling="no"
                    />
                </div>
            </Section>

            {/* Join CTA */}
            <Section className="bg-primary text-white">
                <div className="max-w-3xl mx-auto text-center">
                    <h2 className="text-3xl font-bold mb-4">Ready to Join?</h2>
                    <div className="flex justify-center gap-4 flex-wrap">
                        <a
                            href="https://lists.virginia.edu/sympa/subscribe/vaisi_announcements"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-8 py-3 bg-white text-primary font-bold rounded-md hover:bg-gray-100 transition-colors"
                        >
                            Join Mailing List
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

            {/* Faculty Call to Action */}
            <Section className="bg-slate-50 border-t border-gray-100">
                <div className="max-w-3xl mx-auto text-center">
                    <h2 className="text-2xl font-bold text-primary mb-4">Faculty & Advisors</h2>
                    <p className="text-gray-700 mb-6">
                        Are you a UVA professor or faculty member interested in AI governance and alignment? We are looking for passionate advisors and faculty champions to help guide our mission. Your expertise and mentorship would be invaluable to our community.
                    </p>
                    <p className="text-gray-700">
                        Contact us at{" "}
                        <a href="mailto:vaisi.club@gmail.com" className="text-secondary font-semibold hover:underline">
                            vaisi.club@gmail.com
                        </a>
                    </p>
                </div>
            </Section>
        </div>
    );
}
