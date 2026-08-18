'use client';

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Section from "@/components/Section";
import PageHero from "@/components/PageHero";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/motion";
import { Calendar, Clock, BookOpen, Check, Mail, Instagram, ChevronLeft, ChevronRight } from "lucide-react";
import { LinkedInIcon } from "@/components/Icons";

const stayUpdatedCards = [
    {
        id: "mailing-list",
        title: "Mailing List",
        link: "https://lists.virginia.edu/sympa/subscribe/vaisi_announcements",
        bg: "bg-secondary",
    },
    {
        id: "groupme",
        title: "GroupMe",
        link: "https://groupme.com/join_group/110490963/bxseYw8L",
        bg: "bg-[#00AFF0]",
    },
    {
        id: "instagram",
        title: "Instagram",
        link: "https://www.instagram.com/vaisi_atuva/",
        bg: "bg-[#E1306C]",
    },
    {
        id: "linkedin",
        title: "LinkedIn",
        link: "https://www.linkedin.com/company/vaisi/",
        bg: "bg-[#0A66C2]",
    },
];

const eventTypes = [
    {
        id: 1,
        title: "Intro to AI Safety Fellowship",
        details: {
            schedule: "Monday, Tuesday, or Wednesday",
            time: "6:15-8:15 PM",
            duration: "8 weeks"
        },
        description: "Build a foundation in AI safety through a weekly reading and discussion group covering advanced AI risks and current safety research. Dinner is provided, there is no mandatory reading outside the fellowship, and participants may complete an optional capstone project. No technical background required.",
        applicationNote: "Applications are reviewed on a rolling basis.",
        cta: {
            text: "Apply by September 6",
            link: "https://airtable.com/appM8XoHX2voW3LQe/pag7pdRcPx9uhaRnF/form"
        },
        syllabus: {
            text: "Syllabus",
            link: "https://docs.google.com/document/d/10HcHGxPJ5VpnWoK1sq2nQQ6N85vsy95vgF_T9XGw3Es/edit?tab=t.0"
        }
    },
    {
        id: 2,
        title: "AI Policy Fellowship",
        details: {
            schedule: "Monday, Tuesday, or Thursday",
            time: "6:15-8:15 PM",
            duration: "10 weeks"
        },
        description: "Explore AI policy and governance in a weekly cohort covering technical foundations, frontier policy, national security, safety regulation, corporate governance, and careers. Dinner is provided, with 0-30 minutes of weekly reading and an optional capstone project. No technical background required.",
        applicationNote: "Applications are reviewed on a rolling basis.",
        cta: {
            text: "Apply by September 6",
            link: "https://airtable.com/appM8XoHX2voW3LQe/pag7pdRcPx9uhaRnF/form"
        },
        syllabus: {
            text: "Syllabus",
            link: "https://docs.google.com/document/d/10HcHGxPJ5VpnWoK1sq2nQQ6N85vsy95vgF_T9XGw3Es/edit?tab=t.uuornxg83lhk"
        }
    }
];

const fellowshipTestimonials = [
    {
        before: "VAISI's fellowship is an amazing opportunity to bridge your interest in AI with your interest in politics, governance, social science... everything! [...] it helped me turn my curiosity about AI into ",
        emphasis: "concrete, actionable career steps that open doors into Washington, DC.",
        after: "",
        name: "Hovsep Seferian",
        image: "/testimonials/hovsep-seferian.png",
        published: false,
    },
    {
        before: "VAISI connected me to people who showed me opportunities in AI Safety that might ",
        emphasis: "dramatically change my career trajectory for the better!",
        after: " 10/10 would recommend.",
        name: "Vincent Trang",
        image: "/testimonials/vincent-trang.png",
        published: true,
    },
    {
        before: "This fellowship gave me a grounding in AI that was immensely helpful. As a public policy major, I didn't know much about the field going in, but finished the program much ",
        emphasis: "more confident in my approach to regulation and safety.",
        after: "",
        name: "Maeve Myers",
        image: "/testimonials/maeve-myers.png",
        published: false,
    },
    {
        before: "It was great learn more about the governance and policy sphere, coming from a more technical background!",
        emphasis: "",
        after: "",
        name: "Andrew Broughton",
        image: "/testimonials/andrew-broughton.png",
        published: true,
    },
];

const publishedFellowshipTestimonials = fellowshipTestimonials.filter(({ published }) => published);

const membershipAccessBenefits = [
    "Members-only Slack",
    "1:1 career advising and mentorship",
    "Applications for compute grants and other research expense funding",
    "Free merch",
];

const membershipInvitationBenefits = [
    "Bi-weekly exclusive socials: catered food, games, movies, activities, and occasional special guests",
    "Member-only talks and networking opportunities with professionals, faculty, and researchers",
    "Weekly member meetings discussing recent news and papers in AI safety, security, and policy",
];

function FellowshipTestimonialCarousel() {
    const [activeIndex, setActiveIndex] = useState(0);
    const reducedMotion = useReducedMotion();
    const testimonial = publishedFellowshipTestimonials[activeIndex];

    const showPrevious = () => {
        setActiveIndex((current) => (current - 1 + publishedFellowshipTestimonials.length) % publishedFellowshipTestimonials.length);
    };

    const showNext = () => {
        setActiveIndex((current) => (current + 1) % publishedFellowshipTestimonials.length);
    };

    return (
        <section
            className="rounded-2xl bg-primary p-5 text-white shadow-[0_18px_48px_rgba(35,45,75,0.18)] sm:p-6"
            aria-labelledby="fellowship-testimonials-heading"
        >
            <div className="flex items-center justify-between gap-4">
                <h3 id="fellowship-testimonials-heading" className="text-lg font-bold">Fellowship testimonials</h3>
                <span className="text-sm tabular-nums text-white/70" aria-live="polite">
                    {activeIndex + 1} / {publishedFellowshipTestimonials.length}
                </span>
            </div>

            <div className="mt-5 overflow-hidden rounded-lg bg-white/[0.08] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.12)]">
                <AnimatePresence initial={false} mode="wait">
                    <motion.figure
                        key={testimonial.name}
                        initial={{ opacity: 0, x: reducedMotion ? 0 : 12 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: reducedMotion ? 0 : -8 }}
                        transition={{ duration: reducedMotion ? 0 : 0.22, ease: [0.2, 0, 0, 1] }}
                        className="flex min-h-56 flex-col justify-between p-5 sm:min-h-52 sm:p-6"
                    >
                        <blockquote className="text-lg leading-relaxed text-white/85">
                            &ldquo;{testimonial.before}{testimonial.emphasis && <strong className="font-bold text-white">{testimonial.emphasis}</strong>}{testimonial.after}&rdquo;
                        </blockquote>
                        <figcaption className="mt-5 flex items-center gap-3">
                            <span className="shrink-0 rounded-full shadow-[0_0_0_1px_rgba(255,255,255,0.16)]">
                                <Image
                                    src={testimonial.image}
                                    alt={`Portrait of ${testimonial.name}`}
                                    width={56}
                                    height={56}
                                    className="size-14 rounded-full object-cover"
                                />
                            </span>
                            <span className="text-base font-bold text-white">{testimonial.name}</span>
                        </figcaption>
                    </motion.figure>
                </AnimatePresence>
            </div>

            <div className="mt-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-2" aria-label="Choose a testimonial">
                    {publishedFellowshipTestimonials.map((item, index) => (
                        <button
                            key={item.name}
                            type="button"
                            onClick={() => setActiveIndex(index)}
                            className="tap-scale flex size-10 items-center justify-center rounded-full"
                            aria-label={`Show testimonial from ${item.name}`}
                            aria-current={index === activeIndex ? "true" : undefined}
                        >
                            <span className={`block size-2 rounded-full ${index === activeIndex ? "bg-white" : "bg-white/35"}`} />
                        </button>
                    ))}
                </div>
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={showPrevious}
                        className="tap-scale flex size-11 items-center justify-center rounded-full bg-white/10 text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.12)] hover:bg-white/15"
                        aria-label="Show previous testimonial"
                    >
                        <ChevronLeft className="size-5" aria-hidden="true" />
                    </button>
                    <button
                        type="button"
                        onClick={showNext}
                        className="tap-scale flex size-11 items-center justify-center rounded-full bg-white/10 text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.12)] hover:bg-white/15"
                        aria-label="Show next testimonial"
                    >
                        <ChevronRight className="size-5" aria-hidden="true" />
                    </button>
                </div>
            </div>
        </section>
    );
}

export default function GetInvolvedPage() {
    return (
        <div className="flex flex-col min-h-screen bg-white">
            <PageHero
                title="Get Involved"
                subtitle="Explore our fellowships, become a member, or stay connected through our community channels."
                titleClassName="text-4xl md:text-5xl"
            />

            {/* Socials */}
            <Section className="bg-white">
                <div className="max-w-5xl mx-auto flex flex-col lg:flex-row items-center gap-8 lg:gap-0">
                    <div className="lg:w-80 flex-shrink-0 lg:pr-12">
                        <Reveal>
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-3">Socials</h2>
                            <p className="text-base text-gray-500">Stay up to date with everything we&apos;re involved in.</p>
                        </Reveal>
                    </div>
                    <div className="hidden lg:block w-px self-stretch bg-gray-200 flex-shrink-0" />
                    <StaggerGroup className="lg:pl-12 w-full flex-1 grid grid-cols-2 sm:grid-cols-4 gap-3" stagger={0.15}>
                        {stayUpdatedCards.map((card) => (
                            <StaggerItem key={card.id}>
                                <a
                                    href={card.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`${card.bg} tap-scale flex h-full flex-col items-center justify-center gap-2 rounded-xl p-4 text-center`}
                                >
                                    {card.id === "groupme" && (
                                        <Image src="/groupme.png" alt="" width={28} height={28} className="invert object-contain" />
                                    )}
                                    {card.id === "mailing-list" && (
                                        <Mail className="size-7 text-white" />
                                    )}
                                    {card.id === "instagram" && (
                                        <Instagram className="size-7 text-white" />
                                    )}
                                    {card.id === "linkedin" && (
                                        <LinkedInIcon size={28} className="text-white" />
                                    )}
                                    <h3 className="text-sm font-bold text-white">{card.title}</h3>
                                </a>
                            </StaggerItem>
                        ))}
                    </StaggerGroup>
                </div>
            </Section>

            {/* Event Types Section */}
            <Section className="bg-white border-t border-gray-200">
                <div className="mx-auto max-w-6xl">
                    <StaggerGroup className="flex flex-col divide-y divide-gray-200">
                            {eventTypes.map((event) => {
                                return (
                                    <StaggerItem key={event.id} className="py-8 first:pt-0">
                                        <div className="mb-4">
                                            <h3 className="text-2xl font-bold text-gray-900 mb-4">{event.title}</h3>

                                            <div className="space-y-2 text-base">
                                                <div className="flex items-center gap-2 text-gray-500">
                                                    <Calendar className="w-4 h-4" />
                                                    <span>{event.details.schedule}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-gray-500">
                                                    <Clock className="w-4 h-4" />
                                                    <span>{event.details.time}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-gray-500">
                                                    <BookOpen className="w-4 h-4" />
                                                    <span>{event.details.duration}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <p className="text-gray-500 text-base leading-relaxed mb-4">
                                            {event.description}
                                        </p>
                                        <div className="mb-4 rounded-lg bg-gray-100 border border-gray-200 px-3 py-2.5 text-base leading-relaxed text-gray-700">
                                            {event.applicationNote}
                                        </div>
                                        <div className="flex flex-wrap gap-6 items-center">
                                            <a
                                                href={event.cta.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-link text-base text-gray-800"
                                            >
                                                {event.cta.text} →
                                            </a>
                                            <a
                                                href={event.syllabus.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-link-subtle text-base text-gray-500"
                                            >
                                                {event.syllabus.text}
                                            </a>
                                        </div>
                                    </StaggerItem>
                                );
                            })}
                    </StaggerGroup>

                    <Reveal className="mt-10">
                        <FellowshipTestimonialCarousel />
                    </Reveal>

                    <Reveal className="mt-12 border-t border-gray-200 pt-12">
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">VAISI Membership</h3>

                        <p className="text-gray-500 text-base leading-relaxed mb-4">
                            Join VAISI&apos;s core community. Strong applicants will have completed a VAISI fellowship or have equivalent experience. Members are expected to remain active through events, socials, co-working, workshops, and competitions.
                        </p>
                        <h4 className="text-base font-bold text-gray-900 mb-3">Access to:</h4>
                        <ul className="grid md:grid-cols-2 gap-x-8 gap-y-3 mb-5">
                            {membershipAccessBenefits.slice(0, 2).map((benefit) => (
                                <li key={benefit} className="flex items-start gap-2.5 text-base text-gray-500 leading-relaxed">
                                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                                    <span>{benefit}</span>
                                </li>
                            ))}
                            <li className="flex items-start gap-2.5 text-base text-gray-500 leading-relaxed">
                                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                                <span>
                                    Eligibility for conference and travel funding to events such as{" "}
                                    <a href="https://www.effectivealtruism.org/ea-global" target="_blank" rel="noopener noreferrer" className="text-link-subtle text-gray-700">EA Global</a>
                                    {" "}and{" "}
                                    <a href="https://controlconf.org/" target="_blank" rel="noopener noreferrer" className="text-link-subtle text-gray-700">ControlConf</a>
                                </span>
                            </li>
                            {membershipAccessBenefits.slice(2).map((benefit) => (
                                <li key={benefit} className="flex items-start gap-2.5 text-base text-gray-500 leading-relaxed">
                                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                                    <span>{benefit}</span>
                                </li>
                            ))}
                        </ul>
                        <h4 className="text-base font-bold text-gray-900 mb-3">Invitation to:</h4>
                        <ul className="grid md:grid-cols-2 gap-x-8 gap-y-3 mb-6">
                            {membershipInvitationBenefits.map((benefit) => (
                                <li key={benefit} className="flex items-start gap-2.5 text-base text-gray-500 leading-relaxed">
                                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                                    <span>{benefit}</span>
                                </li>
                            ))}
                        </ul>
                        <div className="mb-4 rounded-lg bg-gray-100 border border-gray-200 px-3 py-2.5 text-base leading-relaxed text-gray-700">
                            Applications are reviewed on a rolling basis.
                        </div>
                        <a
                            href="https://airtable.com/appM8XoHX2voW3LQe/pagzBI6YepuXbbfBr/form"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-link text-base text-gray-800"
                        >
                            Apply for Membership →
                        </a>
                    </Reveal>
                </div>
            </Section>

            {/* Faculty Call to Action */}
            <Section className="bg-white border-t border-gray-200">
                <Reveal className="max-w-6xl mx-auto text-center">
                    <h2 className="text-4xl md:text-5xl font-bold leading-tight text-gray-900 mb-4">Faculty & Advisors</h2>
                    <p className="text-gray-500 mb-6">
                        Are you a UVA professor or faculty member interested in AI governance and alignment? We are looking for passionate advisors and faculty champions to help guide our mission. Your expertise and mentorship would be invaluable to our community.
                    </p>
                    <p className="text-gray-500">
                        Contact us at{" "}
                        <a href="mailto:vaisi.club@gmail.com" className="text-primary font-semibold underline decoration-transparent hover:decoration-secondary transition-colors duration-200">
                            vaisi.club@gmail.com
                        </a>
                    </p>
                </Reveal>
            </Section>
        </div>
    );
}
