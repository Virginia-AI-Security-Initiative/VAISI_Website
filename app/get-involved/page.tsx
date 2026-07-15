import Section from "@/components/Section";
import { Calendar, Clock, BookOpen, Check, Users } from "lucide-react";

// Event Types Data
const eventTypes = [
    {
        id: 1,
        title: "Intro to AI Safety Fellowship",
        icon: BookOpen,
        iconBg: "bg-blue-50",
        iconColor: "text-primary",
        details: {
            schedule: "Monday, Tuesday, and Wednesday",
            time: "6:15-8:15 PM",
            duration: "8 weeks"
        },
        description: "Build a foundation in AI safety through a weekly reading and discussion group covering advanced AI risks and current safety research. Dinner is provided, there is no mandatory reading outside the fellowship, and participants may complete an optional capstone project.",
        cta: {
            text: "Apply by September 13",
            link: "https://airtable.com/appM8XoHX2voW3LQe/pag7pdRcPx9uhaRnF/form"
        },
        syllabus: {
            text: "Syllabus",
            link: "https://docs.google.com/document/d/10HcHGxPJ5VpnWoK1sq2nQQ6N85vsy95vgF_T9XGw3Es/edit?tab=t.0"
        }
    },
    {
        id: 2,
        title: "AI Policy Fellowship",
        icon: BookOpen,
        iconBg: "bg-orange-50",
        iconColor: "text-secondary",
        details: {
            schedule: "Monday, Tuesday, and Thursday",
            time: "6:15-8:15 PM",
            duration: "10 weeks"
        },
        description: "Explore AI policy and governance in a weekly cohort covering technical foundations, frontier policy, national security, safety regulation, corporate governance, and careers. Dinner is provided, with 0-30 minutes of weekly reading and an optional capstone project.",
        cta: {
            text: "Apply by September 13",
            link: "https://airtable.com/appM8XoHX2voW3LQe/pag7pdRcPx9uhaRnF/form"
        },
        syllabus: {
            text: "Syllabus",
            link: "https://docs.google.com/document/d/10HcHGxPJ5VpnWoK1sq2nQQ6N85vsy95vgF_T9XGw3Es/edit?tab=t.uuornxg83lhk"
        }
    }
];

const membershipBenefits = [
    "Members-only Slack",
    "1:1 career advising and mentorship",
    "Preferential access to travel grants for conferences such as EA Global and ControlConf",
    "Applications for compute grants",
    "Biweekly exclusive socials with catered food, games, movies, discussions, and occasional special guests",
    "Member-only talks and networking opportunities",
    "Weekly member meetings discussing recent news and papers in AI safety, security, and policy",
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
                                    <div className="flex flex-wrap gap-3">
                                        <a
                                            href={event.cta.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-block px-6 py-2 bg-primary text-white font-bold rounded-md hover:bg-blue-900 transition-colors text-sm"
                                        >
                                            {event.cta.text}
                                        </a>
                                        <a
                                            href={event.syllabus.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-block px-6 py-2 border border-primary text-primary font-bold rounded-md hover:bg-primary/5 transition-colors text-sm"
                                        >
                                            {event.syllabus.text}
                                        </a>
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                    <div className="md:col-span-2 bg-slate-50 rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow">
                        <div className="p-6 border-b border-gray-100">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center shrink-0">
                                    <Users className="w-6 h-6 text-emerald-700" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-800">VAISI Membership</h3>
                            </div>
                            <div className="grid sm:grid-cols-3 gap-2 text-sm">
                                <div className="flex items-center gap-2 text-gray-600">
                                    <Calendar className="w-4 h-4 text-gray-400 shrink-0" />
                                    <span>Applications reviewed on a rolling basis</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-600">
                                    <Clock className="w-4 h-4 text-gray-400 shrink-0" />
                                    <span>Ongoing</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-600">
                                    <BookOpen className="w-4 h-4 text-gray-400 shrink-0" />
                                    <span>Active membership</span>
                                </div>
                            </div>
                        </div>

                        <div className="p-6">
                            <p className="text-gray-600 text-sm leading-relaxed mb-6">
                                Join VAISI&apos;s core community. Strong applicants will have completed a VAISI fellowship or have equivalent experience. Members are expected to remain active through events, socials, co-working, workshops, and competitions.
                            </p>
                            <h4 className="text-sm font-bold text-gray-800 mb-3">Membership benefits</h4>
                            <ul className="grid md:grid-cols-2 gap-x-8 gap-y-3 mb-6">
                                {membershipBenefits.map((benefit) => (
                                    <li key={benefit} className="flex items-start gap-2.5 text-sm text-gray-600 leading-relaxed">
                                        <Check className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                                        <span>{benefit}</span>
                                    </li>
                                ))}
                            </ul>
                            <a
                                href="https://airtable.com/appM8XoHX2voW3LQe/pagzBI6YepuXbbfBr/form"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-block px-6 py-2 bg-primary text-white font-bold rounded-md hover:bg-blue-900 transition-colors text-sm"
                            >
                                Apply for Membership
                            </a>
                        </div>
                    </div>
                </div>
            </Section>

            {/* Stay Updated Section */}
            <Section className="bg-white border-t border-gray-100">
                <div className="max-w-3xl mx-auto text-center">
                    <h2 className="text-2xl font-bold text-primary mb-3">Stay Updated</h2>
                    <p className="text-gray-700 mb-6">
                        Get announcements about upcoming programs, events, and opportunities.
                    </p>
                    <div className="flex justify-center gap-4 flex-wrap">
                        <a
                            href="https://groupme.com/join_group/110490963/bxseYw8L"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-8 py-3 bg-primary text-white font-bold rounded-md hover:bg-blue-900 transition-colors"
                        >
                            Join our GroupMe
                        </a>
                        <a
                            href="https://lists.virginia.edu/sympa/subscribe/vaisi_announcements"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-8 py-3 border-2 border-primary text-primary font-bold rounded-md hover:bg-slate-50 transition-colors"
                        >
                            Join Mailing List
                        </a>
                    </div>
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
