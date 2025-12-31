import Section from "@/components/Section";
import { Calendar, MapPin, Users, BookOpen, Clock } from "lucide-react";

// Mock Data for Schedule
const schedule = [
    { week: "Week 1", topic: "Intro to AI Safety", date: "Sept 5", location: "Rice Hall 130" },
    { week: "Week 2", topic: "Neural Networks Overview", date: "Sept 12", location: "Rice Hall 130" },
    { week: "Week 3", topic: "Alignment Failure Modes", date: "Sept 19", location: "Rice Hall 130" },
    { week: "Week 4", topic: "Guest Speaker: Research Agenda", date: "Sept 26", location: "Rice Hall 130" },
];

export default function GetInvolvedPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <Section className="bg-primary text-white py-20">
                <div className="max-w-3xl mx-auto text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">Get Involved</h1>
                    <p className="text-xl text-blue-100">
                        Join a community of students dedicated to ensuring the safe development of AI.
                    </p>
                </div>
            </Section>

            {/* Meeting Info */}
            <Section className="bg-white transform -translate-y-8 pt-0">
                <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 text-center">
                        <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Clock className="text-primary w-6 h-6" />
                        </div>
                        <h3 className="font-bold text-lg mb-2">Time</h3>
                        <p className="text-gray-600">Thursdays, 6:00 PM</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 text-center">
                        <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <MapPin className="text-secondary w-6 h-6" />
                        </div>
                        <h3 className="font-bold text-lg mb-2">Location</h3>
                        <p className="text-gray-600">Rice Hall, Room 130</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 text-center">
                        <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Users className="text-primary w-6 h-6" />
                        </div>
                        <h3 className="font-bold text-lg mb-2">Open to All</h3>
                        <p className="text-gray-600">No prior experience required</p>
                    </div>
                </div>
            </Section>

            {/* Schedule */}
            <Section className="bg-slate-50">
                <h2 className="text-3xl font-bold text-primary mb-8 text-center">Upcoming Schedule</h2>
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden max-w-4xl mx-auto">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-4 font-semibold text-gray-700">Week</th>
                                    <th className="px-6 py-4 font-semibold text-gray-700">Topic</th>
                                    <th className="px-6 py-4 font-semibold text-gray-700">Date</th>
                                    <th className="px-6 py-4 font-semibold text-gray-700">Location</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {schedule.map((event, idx) => (
                                    <tr key={idx} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 text-primary font-medium">{event.week}</td>
                                        <td className="px-6 py-4 text-gray-800 font-medium">{event.topic}</td>
                                        <td className="px-6 py-4 text-gray-600">{event.date}</td>
                                        <td className="px-6 py-4 text-gray-600">{event.location}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </Section>

            {/* Fellowship */}
            <Section className="bg-white border-t border-gray-100">
                <div className="max-w-4xl mx-auto">
                    <div className="flex items-center gap-3 mb-6">
                        <BookOpen className="text-secondary w-8 h-8" />
                        <h2 className="text-3xl font-bold text-primary">VAISI Fellowship</h2>
                    </div>
                    <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                        For students who want to dive deeper, we offer an 8-week structured reading group aimed at understanding the core arguments in AI safety. Fellows meet weekly to discuss key papers and complete a final project proposal.
                    </p>
                    <div className="bg-blue-50 border-l-4 border-primary p-6 rounded-r-lg">
                        <h3 className="font-bold text-primary text-xl mb-2">Apply for Fall 2024</h3>
                        <p className="text-gray-700 mb-4">
                            Applications are currently open for the upcoming cohort. We are looking for motivated students from all majors.
                        </p>
                        <button className="px-6 py-2 bg-primary text-white font-bold rounded-md hover:bg-blue-900 transition-colors">
                            Apply Now
                        </button>
                    </div>
                </div>
            </Section>
        </div>
    );
}
