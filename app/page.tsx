import Link from "next/link";
import Section from "@/components/Section";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-background py-20 md:py-28 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            {/* Text Content */}
            <div className="text-left">
              <h1 className="font-[family-name:var(--font-playfair)] text-4xl md:text-5xl lg:text-6xl font-medium leading-tight text-[#1a1a1a] mb-8">
                We are UVA students dedicated to researching the{" "}
                <span className="text-secondary">safe development</span> of advanced AI.
              </h1>
              <p className="text-lg md:text-xl text-gray-600 max-w-xl mb-8">
                The Virginia AI Safety Initiative (VAISI) fosters critical thinking and technical research on the responsible development of artificial intelligence.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/get-involved"
                  className="px-8 py-3 bg-secondary text-white font-bold rounded-md hover:bg-orange-600 transition-colors shadow-lg flex items-center gap-2"
                >
                  Get Involved <ArrowRight size={20} />
                </Link>
                <Link
                  href="/about"
                  className="px-8 py-3 bg-transparent border-2 border-primary text-primary font-bold rounded-md hover:bg-primary/5 transition-colors"
                >
                  Learn More
                </Link>
              </div>
            </div>

            {/* Hero Graphic */}
            <div className="flex justify-center lg:justify-end">
              <Image
                src="/AISI_Logo.png"
                alt="VAISI Logo"
                width={500}
                height={500}
                className="w-full max-w-md lg:max-w-lg"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Club Info Section */}
      <Section className="bg-slate-50 border-t border-slate-200">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-primary mb-6">About VAISI</h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-8">
            The Virginia AI Safety Initiative (VAISI) is a student-run organization dedicated to understanding and mitigating the risks associated with advanced artificial intelligence. We believe that as AI systems become more powerful, ensuring they are{" "}
            <span className="text-primary font-semibold">aligned with human values</span> is one of the most important challenges of our time.
          </p>
          <div className="grid md:grid-cols-2 gap-8 text-left mt-12">
            <div>
              <h3 className="text-xl font-bold text-primary mb-2">Education</h3>
              <p className="text-gray-600">
                We run semester-long fellowships, reading groups, and workshops to help students engage with the technical and strategic landscapes of AI safety.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold text-primary mb-2">Research</h3>
              <p className="text-gray-600">
                We support students in conducting original research, connecting with mentors in the field, and contributing to the broader AI safety community.
              </p>
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
}
