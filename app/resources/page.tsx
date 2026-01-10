import Section from "@/components/Section";
import { Lightbulb, Newspaper, Briefcase, ExternalLink, Play } from "lucide-react";

// Resource data organized by section
const introResources = [
    { title: "Article on catastrophic AI risk", url: "https://safe.ai/ai-risk" },
    { title: "Why AI Safety? (80,000 Hours)", url: "https://80000hours.org/problem-profiles/artificial-intelligence/" },
    { title: "AI Alignment: Why It's Hard, and Where to Start", url: "https://www.cold-takes.com/ai-safety-seems-hard-to-measure/" },
    { title: "The AI Safety Landscape (BlueDot Impact)", url: "https://bluedot.org/courses/governance" },
];

const newsResources = [
    { title: "The New York Times: AI Coverage", url: "https://www.nytimes.com/spotlight/artificial-intelligence" },
    { title: "MIT Technology Review: AI", url: "https://www.technologyreview.com/topic/artificial-intelligence/" },
    { title: "The AI Policy Newsletter", url: "https://www.governance.ai/" },
    { title: "Import AI Newsletter (Jack Clark)", url: "https://importai.substack.com/" },
];

const careerResources = [
    { title: "80,000 Hours AI Safety Career Guide", url: "https://80000hours.org/career-guide/how-to-find-technical-ai-safety-jobs/" },
    { title: "AI Safety Career Opportunities (Alignment Forum)", url: "https://www.alignmentforum.org/" },
    { title: "BlueDot Impact Courses", url: "https://bluedot.org/" },
    { title: "AI Safety Camp", url: "https://aisafety.camp/" },
    { title: "MATS (ML Alignment Theory Scholars)", url: "https://www.matsprogram.org/" },
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

                    {/* Embedded Video */}
                    <div className="mb-8 rounded-xl overflow-hidden shadow-lg">
                        <iframe
                            className="w-full aspect-video"
                            src="https://www.youtube.com/embed/pYXy-A4siMw"
                            title="AI Safety Video"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                    </div>

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
                                    <span className="font-medium text-gray-700 group-hover:text-primary transition-colors">
                                        {resource.title}
                                    </span>
                                    <ExternalLink size={18} className="text-gray-400 group-hover:text-secondary transition-colors" />
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            </Section>

            {/* Section 2: AI Safety in the News */}
            <Section className="bg-slate-50 border-t border-gray-100">
                <div className="max-w-4xl mx-auto">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
                            <Newspaper className="w-6 h-6 text-primary" />
                        </div>
                        <h2 className="text-3xl font-bold text-primary">AI Safety in the News</h2>
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
                                    <span className="font-medium text-gray-700 group-hover:text-primary transition-colors">
                                        {resource.title}
                                    </span>
                                    <ExternalLink size={18} className="text-gray-400 group-hover:text-secondary transition-colors" />
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
                                    <span className="font-medium text-gray-700 group-hover:text-primary transition-colors">
                                        {resource.title}
                                    </span>
                                    <ExternalLink size={18} className="text-gray-400 group-hover:text-secondary transition-colors" />
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            </Section>
        </div>
    );
}
