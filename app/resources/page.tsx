import Section from "@/components/Section";
import { Lightbulb, Newspaper, Briefcase, ExternalLink, Play, FileText, Mail } from "lucide-react";

// Resource data organized by section
const introResources = [
    { title: "A Case for AI Safety - AI Safety.info", url: "https://aisafety.info/questions/NM3T/", type: "article" as const },
    { title: "An Overview of Catastrophic AI Risks - Center for AI Safety", url: "https://safe.ai/ai-risk", type: "article" as const },
    { title: "Intro to AI Safety - Rob Miles", url: "https://www.youtube.com/watch?v=pYXy-A4siMw&t=1s", type: "video" as const },
    { title: "The Catastrophic Risks of AI — and a Safer Path - Yoshua Bengio", url: "https://www.youtube.com/watch?v=qe9QSCF-d88", type: "video" as const },
    { title: "We're Not Ready for Superintelligence - AI in Context", url: "https://www.youtube.com/watch?v=5KVDDfAkRgc", type: "video" as const },
    //{ title: "Unresolved Debates About the Future of AI - Helen Toner", url: "https://open.substack.com/pub/helentoner/p/unresolved-debates-about-the-future?utm_campaign=post-expanded-share&utm_medium=web", type: "article" as const },
    //{ title: "Long Timelines to Advanced AI Have Been Overestimated - Helen Toner", url: "https://open.substack.com/pub/helentoner/p/long-timelines-to-advanced-ai-have?utm_campaign=post-expanded-share&utm_medium=web", type: "article" as const },
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
                        Curated materials on AI risk, governance, and security to help you engage with the field.
                    </p>
                </div>
            </Section>

            {/* Section 1: Understanding AI Risk */}
            <Section className="bg-white">
                <div className="max-w-4xl mx-auto">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center">
                            <Lightbulb className="w-6 h-6 text-secondary" />
                        </div>
                        <h2 className="text-3xl font-bold text-primary">Understanding AI Risk</h2>
                    </div>
                    <p className="text-lg text-gray-600 mb-8 ml-15">
                        Accessible introductions to the technical and policy challenges posed by advanced AI systems.
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

            {/* Section 2: AI Policy & Risk News */}
            <Section className="bg-slate-50 border-t border-gray-100">
                <div className="max-w-4xl mx-auto">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
                            <Newspaper className="w-6 h-6 text-primary" />
                        </div>
                        <h2 className="text-3xl font-bold text-primary">AI Policy & Risk News</h2>
                    </div>
                    <p className="text-lg text-gray-600 mb-8">
                        Stay up to date with the latest developments in AI governance, risk research, and policy.
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
                                        {/*{resource.type === "video" ? (
                                            <Play size={16} className="text-red-500 flex-shrink-0" />
                                        ) : (
                                            <FileText size={16} className="text-blue-500 flex-shrink-0" />
                                        )}*/}
                                        <FileText size={16} className="text-blue-500 flex-shrink-0" />
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
                        Explore career paths in AI governance, technical research, and policy. Find fellowships, job boards, and guidance.
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

            {/* Contact CTA */}
            <Section className="bg-primary text-white border-t border-blue-800">
                <div className="max-w-3xl mx-auto text-center">
                    <div className="flex justify-center mb-4">
                        <div className="w-12 h-12 bg-blue-800 rounded-full flex items-center justify-center">
                            <Mail className="w-6 h-6 text-white" />
                        </div>
                    </div>
                    <h2 className="text-2xl font-bold mb-3">Get in Touch</h2>
                    <p className="text-lg text-blue-100 mb-6">
                        Interested in learning more or exploring opportunities in AI governance and technical research?
                        Reach out with your background and interests.
                    </p>
                    <a
                        href="mailto:vaisi.club@gmail.com"
                        className="inline-flex items-center gap-2 bg-white text-primary font-semibold px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors"
                    >
                        <Mail size={18} />
                        vaisi.club@gmail.com
                    </a>
                </div>
            </Section>
        </div>
    );
}
