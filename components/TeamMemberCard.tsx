import Image from 'next/image';
import { CalendarDays } from 'lucide-react';

interface TeamMemberCardProps {
    name: string;
    title: string;
    imageSrc?: string;
    personalWebsiteUrl?: string;
    linkedinUrl?: string;
    chatUrl?: string;
    graduatingYear?: string;
}

export default function TeamMemberCard({ name, title, imageSrc, personalWebsiteUrl, linkedinUrl, chatUrl, graduatingYear }: TeamMemberCardProps) {
    return (
        <div className={`surface-card group relative flex items-center gap-4 rounded-3xl bg-white border border-gray-200 p-4 ${personalWebsiteUrl ? 'cursor-pointer hover:border-gray-300' : ''}`}>
            {personalWebsiteUrl && (
                <a
                    href={personalWebsiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute inset-0 z-10 rounded-3xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
                    aria-label={`Visit ${name}'s personal website`}
                />
            )}
            <div className="image-outline relative size-28 shrink-0 overflow-hidden rounded-xl bg-gray-100 shadow-[0_8px_24px_rgba(0,0,0,0.10)]">
                {imageSrc ? (
                    <Image
                        src={imageSrc}
                        alt={name}
                        fill
                        sizes="112px"
                        className="object-cover object-top"
                    />
                ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                        <span className="text-3xl font-light">?</span>
                    </div>
                )}
            </div>

            <div className="flex flex-col justify-center min-w-0">
                <h3 className={`text-base font-bold text-gray-900 leading-tight ${personalWebsiteUrl ? 'group-hover:text-primary' : ''}`}>{name}</h3>
                <p className="text-sm text-gray-500 mt-1">{title}</p>
                {graduatingYear && (
                    <p className="text-xs text-gray-400 mt-0.5">{graduatingYear}</p>
                )}
                {(linkedinUrl || chatUrl) && (
                    <div className="mt-2 flex items-center gap-2">
                        {linkedinUrl && (
                            <a
                                href={linkedinUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="tap-scale relative z-20 flex size-10 items-center justify-center rounded-lg hover:bg-gray-100"
                                aria-label={`${name}'s LinkedIn profile`}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    className="w-5 h-5"
                                    fill="#232D4B"
                                >
                                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                </svg>
                            </a>
                        )}
                        {chatUrl && (
                            <a
                                href={chatUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="tap-scale relative z-20 flex min-h-10 items-center gap-1.5 whitespace-nowrap rounded-lg border border-gray-200 px-3 text-xs font-semibold text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                                aria-label={`Schedule a chat with ${name}`}
                            >
                                <CalendarDays className="w-3.5 h-3.5" />
                                Chat with me
                            </a>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
