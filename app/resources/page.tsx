import Section from "@/components/Section";
import { Lightbulb, Newspaper, Briefcase, ExternalLink, Play, FileText } from "lucide-react";

// Resource data organized by section
const introResources = [
    { title: "A Case for AI Safety - AI Safety.info", url: "https://aisafety.info/questions/NM3T/", type: "article" as const },
    { title: "An Overview of Catastrophic AI Risks - Center for AI Safety", url: "https://safe.ai/ai-risk", type: "article" as const },
    { title: "Intro to AI Safety - Rob Miles", url: "https://www.youtube.com/watch?v=pYXy-A4siMw&t=1s", type: "video" as const },
    { title: "The Catastrophic Risks of AI — and a Safer Path - Yoshua Bengio", url: "https://www.youtube.com/watch?v=qe9QSCF-d88", type: "video" as const },
    { title: "We're Not Ready for Superintelligence - AI in Context", url: "https://www.youtube.com/watch?v=5KVDDfAkRgc", type: "video" as const },
];

const newsResources = [
    { title: "The AI Safety Newsletter - Center for AI Safety", url: "https://safe.ai/newsletter", type: "article" as const },
    { title: "Import AI Newsletter - Jack Clark", url: "https://jack-clark.net/", type: "article" as const },
    { title: "World 'may not have time' to prepare for AI safety risks - The Guardian", url: "https://www.theguardian.com/technology/2026/jan/04/world-may-not-have-time-to-prepare-for-ai-safety-risks-says-leading-researcher", type: "article" as const },
];

const careerResources = [
    { title: "How to Use Your Career to Reduce Risks from AI - 80,000 Hours", url: "https://80000hours.org/agi/", type: "article" as const },
    { title: "AI Safety Career Advice - Rob Miles", url: "https://www.youtube.com/watch?v=OpufM6yK4Go", type: "video" as const },
    { title: "Find Your Place in the AI Safety Ecosystem - AISafety.com", url: "https://www.aisafety.com/", type: "article" as const },
    { title: "BlueDot Impact Courses", url: "https://bluedot.org/", type: "article" as const },
];

export default function ResourcesPage() {
    return (
        <div className="flex flex-col min-h-screen">
            {/* Page Header */}
            <Section className="bg-primary text-white py-16">
                <div className="max-w-3xl mx-auto text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Resources</h1>
                    <p className="text-xl text-blue-100">
                        Curated materials to help you learn about AI safety and get involved.
                    </p>
                </div>
            </Section>

            {/* Section 1: Why AI Safety Matters */}
            <Section className="bg-white">
                <div className="max-w-4xl mx-auto">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center">
                            <Lightbulb className="w-6 h-6 text-secondary" />
                        </div>
                        <h2 className="text-3xl font-bold text-primary">Why AI Safety Matters</h2>
                    </div>
                    <p className="text-lg text-gray-600 mb-8 ml-15">
                        High-level, accessible resources to understand why AI safety is one of the most important challenges of our time.
                    </p>


                    {/* Resource Links */}
                    <ul className="space-y-3">
                        {introResources.map((resource, idx) => (
                            <li key={idx}>
                                <a
                                    href={resource.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group flex items-center justify-between p-4 rounded-lg hover:bg-slate-50 transition-colors border border-gray-100 hover:border-gray-200"
                                >
                                    <div className="flex items-center gap-3">
                                        {resource.type === "video" ? (
                                            <Play size={16} className="text-red-500 flex-shrink-0" />
                                        ) : (
                                            <FileText size={16} className="text-blue-500 flex-shrink-0" />
                                        )}
                                        <span className="font-medium text-gray-700 group-hover:text-primary transition-colors">
                                            {resource.title}
                                        </span>
                                    </div>
                                    <ExternalLink size={18} className="text-gray-400 group-hover:text-secondary transition-colors flex-shrink-0" />
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            </Section>

            {/* Section 2: AI Safety News */}
            <Section className="bg-slate-50 border-t border-gray-100">
                <div className="max-w-4xl mx-auto">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
                            <Newspaper className="w-6 h-6 text-primary" />
                        </div>
                        <h2 className="text-3xl font-bold text-primary">AI Safety News</h2>
                    </div>
                    <p className="text-lg text-gray-600 mb-8">
                        Stay up to date with the latest developments, policy announcements, and media coverage of AI safety.
                    </p>

                    <ul className="space-y-3">
                        {newsResources.map((resource, idx) => (
                            <li key={idx}>
                                <a
                                    href={resource.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group flex items-center justify-between p-4 rounded-lg bg-white hover:bg-gray-50 transition-colors border border-gray-100 hover:border-gray-200"
                                >
                                    <div className="flex items-center gap-3">
                                        {resource.type === "video" ? (
                                            <Play size={16} className="text-red-500 flex-shrink-0" />
                                        ) : (
                                            <FileText size={16} className="text-blue-500 flex-shrink-0" />
                                        )}
                                        <span className="font-medium text-gray-700 group-hover:text-primary transition-colors">
                                            {resource.title}
                                        </span>
                                    </div>
                                    <ExternalLink size={18} className="text-gray-400 group-hover:text-secondary transition-colors flex-shrink-0" />
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            </Section>

            {/* Section 3: Career Resources */}
            <Section className="bg-white border-t border-gray-100">
                <div className="max-w-4xl mx-auto">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center">
                            <Briefcase className="w-6 h-6 text-green-600" />
                        </div>
                        <h2 className="text-3xl font-bold text-primary">Career Resources</h2>
                    </div>
                    <p className="text-lg text-gray-600 mb-8">
                        Interested in pursuing AI safety as a career? Explore job boards, fellowship programs, and career guidance.
                    </p>

                    <ul className="space-y-3">
                        {careerResources.map((resource, idx) => (
                            <li key={idx}>
                                <a
                                    href={resource.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group flex items-center justify-between p-4 rounded-lg hover:bg-slate-50 transition-colors border border-gray-100 hover:border-gray-200"
                                >
                                    <div className="flex items-center gap-3">
                                        {resource.type === "video" ? (
                                            <Play size={16} className="text-red-500 flex-shrink-0" />
                                        ) : (
                                            <FileText size={16} className="text-blue-500 flex-shrink-0" />
                                        )}
                                        <span className="font-medium text-gray-700 group-hover:text-primary transition-colors">
                                            {resource.title}
                                        </span>
                                    </div>
                                    <ExternalLink size={18} className="text-gray-400 group-hover:text-secondary transition-colors flex-shrink-0" />
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            </Section>
        </div>
    );
}
