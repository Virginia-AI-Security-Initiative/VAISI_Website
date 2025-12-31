import Section from "@/components/Section";
import { BookOpen, FileText, ExternalLink, Video } from "lucide-react";

// Mock Data for Resources
const resources = [
    {
        category: "Introductory Courses",
        icon: <BookOpen className="text-secondary" />,
        items: [
            { title: "BlueDot AI Safety Curriculum", url: "https://course.bluedot.org/" },
            { title: "AGI Safety Fundamentals", url: "https://www.aisafetyfundamentals.com/" },
            { title: "Intro to ML Safety (Dan Hendrycks)", url: "https://course.mlsafety.org/" }
        ]
    },
    {
        category: "Key Papers",
        icon: <FileText className="text-secondary" />,
        items: [
            { title: "The Alignment Problem from a Deep Learning Perspective", url: "#" },
            { title: "Concrete Problems in AI Safety", url: "#" },
            { title: "Risks from Learned Optimization", url: "#" }
        ]
    },
    {
        category: "Videos & Talks",
        icon: <Video className="text-secondary" />,
        items: [
            { title: "Robert Miles AI Safety Channel", url: "https://www.youtube.com/c/RobertMilesAI" },
            { title: "Misalignment, Fake News, and the 2024 Election", url: "#" }
        ]
    }
];

export default function ResourcesPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <Section className="bg-slate-50">
                <h1 className="text-4xl font-bold text-primary mb-4 text-center">Resources</h1>
                <p className="text-xl text-gray-600 text-center max-w-2xl mx-auto mb-12">
                    Curated materials to help you get up to speed with AI safety technical research and governance.
                </p>

                <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    {resources.map((category, idx) => (
                        <div key={idx} className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
                            <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
                                {category.icon}
                                <h2 className="text-2xl font-bold text-primary">{category.category}</h2>
                            </div>
                            <ul className="space-y-4">
                                {category.items.map((item, itemIdx) => (
                                    <li key={itemIdx}>
                                        <a
                                            href={item.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="group flex items-center justify-between p-3 rounded-md hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-200"
                                        >
                                            <span className="font-medium text-gray-700 group-hover:text-primary transition-colors">
                                                {item.title}
                                            </span>
                                            <ExternalLink size={16} className="text-gray-400 group-hover:text-secondary opacity-0 group-hover:opacity-100 transition-all" />
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </Section>
        </div>
    );
}
