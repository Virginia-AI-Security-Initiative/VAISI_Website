import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-background py-20 md:py-28 lg:py-32">
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
                src="/VAISI_Logo.jpg"
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
              <h2 className="text-2xl md:text-3xl font-bold text-primary mb-6">Why AI Safety?</h2>
              <ul className="space-y-4 text-gray-700">
                <li className="flex gap-3">
                  <span className="text-secondary font-bold">•</span>
                  <span>
                    Lorem ipsum dolor sit amet, <strong>consectetur adipiscing</strong> elit, sed do <strong>eiusmod tempor</strong>.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-secondary font-bold">•</span>
                  <span>
                    Ut enim ad minim veniam, quis nostrud <strong>exercitation ullamco</strong> laboris nisi ut <strong>aliquip ex ea</strong>.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-secondary font-bold">•</span>
                  <span>
                    Duis aute irure dolor in <strong>reprehenderit</strong> in voluptate velit esse cillum <strong>dolore eu fugiat</strong> nulla pariatur.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-secondary font-bold">•</span>
                  <span>
                    Excepteur sint occaecat <strong>cupidatat non proident</strong>, sunt in culpa qui officia <strong>deserunt mollit</strong> anim id est laborum.
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
                    Lorem ipsum dolor sit amet, <strong>consectetur adipiscing</strong> elit sed do <strong>eiusmod</strong>.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-secondary font-bold">•</span>
                  <span>
                    Ut enim ad minim veniam, quis <strong>nostrud exercitation</strong> ullamco laboris <strong>nisi ut aliquip</strong>.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-secondary font-bold">•</span>
                  <span>
                    Duis aute irure dolor in reprehenderit in <strong>voluptate velit</strong> esse cillum dolore eu <strong>fugiat nulla</strong>.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-secondary font-bold">•</span>
                  <span>
                    Excepteur sint <strong>occaecat cupidatat</strong> non proident sunt in culpa qui <strong>officia deserunt</strong>.
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
