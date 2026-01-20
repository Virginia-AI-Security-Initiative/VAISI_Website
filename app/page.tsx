import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-background pt-8 pb-20 md:pt-12 md:pb-28 lg:pt-16 lg:pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-5 gap-12 lg:gap-8 items-center">
            {/* Text Content - takes more space (3/5) */}
            <div className="text-left lg:col-span-3">
              <h1 className="font-[family-name:var(--font-playfair)] text-4xl md:text-5xl lg:text-6xl font-medium leading-tight text-[#1a1a1a] mb-8">
                A community at the University of Virginia dedicated to mitigating the{" "}
                <span className="text-secondary">risks of advanced AI</span>.
              </h1>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/get-involved"
                  className="px-8 py-3 bg-secondary text-white font-bold rounded-md hover:bg-orange-600 transition-colors shadow-lg flex items-center gap-2"
                >
                  Get Involved <ArrowRight size={20} />
                </Link>
              </div>
            </div>

            {/* Hero Graphic - takes less space (2/5) */}
            <div className="flex justify-center lg:justify-end lg:col-span-2">
              <Image
                src="/Cropped_VAISI_Logo-Picsart-BackgroundRemover.jpg"
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

      {/* Problem & What We Do Section */}
      <section className="bg-slate-50 border-t border-slate-200 py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-16">
            {/* Why AI Safety? */}
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-primary mb-6">An Under-Discussed Challenge</h2>
              <ul className="space-y-4 text-gray-700">
                <li className="flex gap-3">
                  <span className="text-secondary font-bold">•</span>
                  <span>
                    Managing risks from advanced AI is one of the <a href="https://arxiv.org/pdf/2310.17688" target="_blank" rel="noopener noreferrer" className="text-secondary hover:underline">most important issues</a> of our time.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-secondary font-bold">•</span>
                  <span>
                    Advanced AI could <a href="https://ai-2027.com/" target="_blank" rel="noopener noreferrer" className="text-secondary hover:underline">arrive sooner</a> <a href="https://open.substack.com/pub/helentoner/p/long-timelines-to-advanced-ai-have?utm_campaign=post-expanded-share&utm_medium=web" target="_blank" rel="noopener noreferrer" className="text-secondary hover:underline">than expected</a>, bringing transformative benefits but also existential risks if developed without adequate safety measures and governance.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-secondary font-bold">•</span>
                  <span>
                    The field desperately needs more researchers, policymakers, and bridge-builders to tackle technical alignment challenges and create robust governance frameworks.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-secondary font-bold">•</span>
                  <span>
                    We're racing to ensure AI goes well for humanity during this critical window when thoughtful action can meaningfully influence our future.
                  </span>
                </li>
              </ul>
            </div>

            {/* Our Approach */}
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-primary mb-6">Our Approach</h2>
              <ul className="space-y-4 text-gray-700">
                <li className="flex gap-3">
                  <span className="text-secondary font-bold">•</span>
                  <span>
                    Equip the UVA community with the knowledge and skills needed to contribute to AI safety through structured learning programs, research opportunities, and public discourse.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-secondary font-bold">•</span>
                  <span>
                    Create clear pathways from interest to impact by connecting members with mentors, career opportunities, and projects in both technical alignment and AI governance.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-secondary font-bold">•</span>
                  <span>
                    Develop both technical expertise and policy fluency in our members, preparing them to be the bridge-builders between researchers and decision-makers that the field lacks.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-secondary font-bold">•</span>
                    <span>
                    In short, we're UVA's home for talented, motivated individuals committed to making AI go well for humanity.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
