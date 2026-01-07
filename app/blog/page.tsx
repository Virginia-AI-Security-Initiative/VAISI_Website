import Section from "@/components/Section";
import { ArrowRight, BookOpen } from "lucide-react";

export default function BlogPage() {
    return (
        <div className="flex flex-col min-h-screen bg-slate-50">
            <Section className="flex flex-col items-center justify-center flex-grow text-center py-20">
                <div className="bg-white p-12 rounded-2xl shadow-sm border border-gray-100 max-w-2xl w-full">
                    <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <BookOpen className="text-primary w-8 h-8" />
                    </div>

                    <h1 className="text-4xl font-bold text-primary mb-6">Our Blog</h1>
                    <p className="text-xl text-gray-600 mb-10 leading-relaxed">
                        We publish our latest thoughts, research summaries, and event recaps on our Substack.
                    </p>

                    <a
                        href="https://substack.com/@vaisi"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white font-bold rounded-lg hover:bg-blue-900 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-1"
                    >
                        Read on Substack
                        <ArrowRight size={20} />
                    </a>
                </div>
            </Section>
        </div>
    );
}
