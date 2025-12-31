import Link from "next/link";
import Section from "@/components/Section";
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
      <section className="bg-gradient-to-br from-primary to-[#1a233b] text-white py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
            Virginia AI Safety Initiative
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto mb-10">
            Fostering critical thinking and technical research on the safe development of artificial intelligence at the University of Virginia.
          </p>
          <div className="flex justify-center space-x-4">
            <Link
              href="/get-involved"
              className="px-8 py-3 bg-secondary text-white font-bold rounded-md hover:bg-orange-600 transition-colors shadow-lg flex items-center gap-2"
            >
              Get Involved <ArrowRight size={20} />
            </Link>
            <Link
              href="/about"
              className="px-8 py-3 bg-transparent border-2 border-white text-white font-bold rounded-md hover:bg-white/10 transition-colors"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Announcements Section */}
      <Section className="bg-white">
        <div className="flex items-center gap-2 mb-8">
          <Megaphone className="text-primary" size={28} />
          <h2 className="text-3xl font-bold text-primary">Latest Announcements</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {announcements.map((announcement) => (
            <div key={announcement.id} className="bg-slate-50 p-6 rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                <Calendar size={16} />
                <span>{announcement.date}</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">{announcement.title}</h3>
              <p className="text-gray-600 mb-4">{announcement.summary}</p>
              <Link href={announcement.link} className="text-secondary font-medium hover:underline flex items-center gap-1">
                Read more <ArrowRight size={16} />
              </Link>
            </div>
          ))}
        </div>
      </Section>

      {/* Club Info Section */}
      <Section className="bg-slate-50 border-t border-slate-200">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-primary mb-6">About VAISI</h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-8">
            The Virginia AI Safety Initiative (VAISI) is a student-run organization dedicated to understanding and mitigating the risks associated with advanced artificial intelligence. We believe that as AI systems become more powerful, ensuring they are aligned with human values is one of the most important challenges of our time.
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
