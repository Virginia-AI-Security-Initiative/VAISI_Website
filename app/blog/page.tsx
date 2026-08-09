import Section from "@/components/Section";

export default function BlogPage() {
    return (
        <div className="flex flex-col min-h-screen bg-white">
            <Section className="flex flex-col items-center justify-center flex-grow text-center py-32">
                <div className="max-w-xl">
                    <h1 className="text-4xl font-bold text-gray-900 mb-5">Our Blog</h1>
                    <p className="text-lg text-gray-500 mb-8 leading-relaxed">
                        We publish our latest thoughts, research summaries, and event recaps on our Substack.
                    </p>
                    <a
                        href="https://substack.com/@vaisi"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-link text-base text-gray-800"
                    >
                        Read on Substack →
                    </a>
                </div>
            </Section>
        </div>
    );
}
