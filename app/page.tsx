import Link from "next/link";
import Section from "@/components/Section";
import ShieldParticles from "@/components/ShieldParticles";
import { ArrowRight, Calendar, Megaphone } from "lucide-react";

// Mock Data for Announcements
const announcements = [
  {
    id: 1,
    title: "Fall Semester Kickoff Meeting",
    date: "August 28, 2024",
    summary: "Join us for our first meeting of the semester! We'll be discussing our plans for the year and introducing the executive board.",
    link: "/get-involved"
  },
  {
    id: 2,
    title: "Guest Speaker: Dr. Jane Smith",
    date: "September 15, 2024",
    summary: "Dr. Smith from the Future of Humanity Institute will be joining us via Zoom to discuss AI Governance.",
    link: "/get-involved"
  },
  {
    id: 3,
    title: "AI Safety Fellowship Applications Open",
    date: "September 1, 2024",
    summary: "Apply now for our semester-long fellowship program. Learn the fundamentals of AI alignment and safety.",
    link: "/get-involved"
  }
];

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="pt-4 pb-16 md:pt-12 md:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="font-serif text-5xl md:text-7xl text-gray-900 leading-tight mb-8">
                We are University of Virginia students dedicated to researching the risks of <span className="text-secondary italic">advanced AI.</span>
              </h1>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/get-involved"
                  className="px-8 py-3 bg-primary text-white font-bold rounded-full hover:bg-blue-900 transition-colors shadow-lg flex items-center gap-2"
                >
                  Get Involved <ArrowRight size={20} />
                </Link>
                <Link
                  href="/about"
                  className="px-8 py-3 bg-transparent border-2 border-primary text-primary font-bold rounded-full hover:bg-primary/5 transition-colors"
                >
                  Learn More
                </Link>
              </div>
            </div>

            <div className="hidden md:block h-[600px] w-[600px] mx-auto">
              <ShieldParticles />
            </div>
          </div>
        </div>
      </section>

      {/* Mission/Info Section with High Contrast Typography */}
      <Section className="border-t border-gray-200">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-2xl md:text-3xl font-serif leading-relaxed text-gray-900 mb-12">
            The Virginia AI Safety Initiative (VAISI) aims to study <span className="text-primary font-bold">anything involving AI safety</span> — from governance, to international policy, to technical alignment.
          </p>

          <div className="grid md:grid-cols-2 gap-12 text-left">
            <div>
              <h3 className="text-xl font-bold text-primary mb-3 uppercase tracking-wider text-sm">Education</h3>
              <p className="text-lg text-gray-700 leading-relaxed">
                We run semester-long fellowships, reading groups, and workshops to help students engage with the technical and strategic landscapes of AI safety.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold text-primary mb-3 uppercase tracking-wider text-sm">Research</h3>
              <p className="text-lg text-gray-700 leading-relaxed">
                We support students in conducting original research, connecting with mentors in the field, and contributing to the broader AI safety community.
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* Announcements Section */}
      <Section className="bg-white">
        <div className="flex items-center gap-2 mb-8 border-b pb-4 border-gray-100">
          <Megaphone className="text-secondary" size={24} />
          <h2 className="text-2xl font-bold text-primary">Latest Announcements</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {announcements.map((announcement) => (
            <div key={announcement.id} className="group cursor-pointer">
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                <Calendar size={14} />
                <span>{announcement.date}</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-secondary transition-colors">{announcement.title}</h3>
              <p className="text-gray-600 mb-4 text-sm leading-relaxed">{announcement.summary}</p>
              <Link href={announcement.link} className="text-primary font-bold text-sm hover:underline flex items-center gap-1">
                Read full announcement <ArrowRight size={14} />
              </Link>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}
