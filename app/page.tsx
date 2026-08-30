'use client';

import { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import FlipCardSection from "@/components/FlipCardSection";
import { Reveal, fadeSlideUp, fadeSlideRight, staggerContainer, heroTransition } from "@/components/motion";
import { teamMembers } from "@/app/about/members";

const chatContacts = teamMembers
  .flatMap((group) => group.members)
  .filter((member) => ["Seth Lifland", "Nia Mucher", "Shubhrangshu Debsarkar"].includes(member.name));

function CornerAccents({ tone = "white" }: { tone?: "white" | "primary" }) {
  const border = tone === "white" ? "border-white/25" : "border-primary/15";
  return (
    <>
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className={`pointer-events-none absolute top-6 right-6 w-16 h-16 border-t-2 border-r-2 ${border}`}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className={`pointer-events-none absolute bottom-6 left-6 w-16 h-16 border-b-2 border-l-2 ${border}`}
      />
    </>
  );
}

export default function Home() {
  const heroRef = useRef<HTMLElement>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 40]);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Hero Banner */}
      <section ref={heroRef} className="relative flex items-center min-h-[75vh] overflow-hidden">
        <motion.div
          className="absolute inset-0"
          style={reducedMotion ? undefined : { scale: heroScale, y: heroY }}
        >
          <Image
            src="/vaisi_banner.JPG"
            alt="VAISI Banner"
            fill
            className="object-cover"
            priority
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-br from-[#232D4B]/80 via-[#0c0c0c]/60 to-black/70" />
        <CornerAccents tone="white" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 w-full">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer(0.12)}
            className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-12"
          >
            <motion.div variants={fadeSlideUp} transition={heroTransition} className="max-w-2xl">
              <h1 className="text-[2.75rem] md:text-[3.5rem] lg:text-6xl font-bold leading-[1.08] text-white">
                A community at the University of Virginia dedicated to mitigating the{" "}
                <span className="text-secondary">risks of advanced AI</span>.
              </h1>
            </motion.div>

            <motion.div
              variants={fadeSlideRight}
              transition={heroTransition}
              className="flex flex-col gap-6 lg:items-start"
            >
              <Link
                href="/get-involved"
                className="group inline-flex items-center gap-3 border-b-2 border-white pb-1.5 text-white hover:border-secondary hover:text-secondary transition-colors duration-150"
              >
                <span className="text-3xl font-semibold leading-none">Get Involved</span>
                <ArrowRight className="size-7 flex-shrink-0 transition-transform duration-150 group-hover:translate-x-1" />
              </Link>
              <button
                type="button"
                onClick={() => setIsChatOpen(true)}
                className="group inline-flex items-center gap-3 border-b-2 border-white pb-1.5 text-white transition-colors duration-150 hover:border-secondary hover:text-secondary"
              >
                <span className="text-3xl font-semibold leading-none">Chat with us</span>
                <ArrowRight className="size-7 flex-shrink-0 transition-transform duration-150 group-hover:translate-x-1" />
              </button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <AnimatePresence initial={false}>
        {isChatOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsChatOpen(false)}
          >
            <motion.section
              role="dialog"
              aria-modal="true"
              aria-labelledby="chat-with-us-heading"
              className="relative w-full max-w-6xl rounded-3xl bg-white p-8 shadow-[0_24px_80px_rgba(0,0,0,0.28)] sm:p-10"
              initial={{ opacity: 0, y: reducedMotion ? 0 : 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: reducedMotion ? 0 : 8 }}
              transition={{ duration: reducedMotion ? 0 : 0.2, ease: [0.2, 0, 0, 1] }}
              onClick={(event) => event.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setIsChatOpen(false)}
                className="tap-scale absolute right-4 top-4 flex size-11 items-center justify-center rounded-xl text-gray-500 hover:bg-gray-100 hover:text-gray-900 sm:right-6 sm:top-6"
                aria-label="Close chat options"
              >
                <X className="size-5" aria-hidden="true" />
              </button>
              <div className="pr-12">
                <h2 id="chat-with-us-heading" className="text-4xl font-bold text-gray-900 sm:text-5xl">Chat with us</h2>
                <p className="mt-4 text-xl leading-relaxed text-gray-500">
                  Have a question about VAISI or want to talk through how to get involved? Book a time with one of us.
                </p>
              </div>
              <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {chatContacts.map((contact) => (
                  <article key={contact.name} className="flex flex-col items-start gap-5 rounded-2xl bg-gray-50 p-6 shadow-[0_8px_24px_rgba(0,0,0,0.06)]">
                    <div className="image-outline relative size-24 shrink-0 overflow-hidden rounded-xl bg-gray-100">
                      <Image src={contact.imageSrc} alt={`Portrait of ${contact.name}`} fill sizes="96px" className="object-cover object-top" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="whitespace-nowrap text-xl font-bold leading-tight text-gray-900">{contact.name}</h3>
                      <p className="mt-2 text-lg text-gray-500">{contact.title}</p>
                      <a
                        href={contact.chatUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-4 inline-flex min-h-10 items-center text-lg font-semibold text-primary underline decoration-secondary decoration-2 underline-offset-4 transition-colors duration-150 hover:text-secondary"
                      >
                        Book a chat <span aria-hidden="true">→</span>
                      </a>
                    </div>
                  </article>
                ))}
              </div>
            </motion.section>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Flip Cards */}
      <section className="relative bg-white border-t border-gray-200 py-16 md:py-20">
        <CornerAccents tone="primary" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <FlipCardSection />
          </Reveal>
        </div>
      </section>

      {/* Event Calendar */}
      <section className="relative bg-white border-t border-gray-200 py-16 md:py-20">
        <CornerAccents tone="primary" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <h2 className="text-4xl md:text-5xl font-bold leading-tight text-gray-900 mb-8">Event Calendar</h2>
            <div className="overflow-hidden rounded-2xl border border-gray-200">
              <iframe
                src="https://calendar.google.com/calendar/embed?src=vaisi.club%40gmail.com&ctz=America%2FNew_York"
                className="h-[420px] w-full border-0 md:h-[480px]"
                title="VAISI Event Calendar"
                scrolling="no"
              />
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
