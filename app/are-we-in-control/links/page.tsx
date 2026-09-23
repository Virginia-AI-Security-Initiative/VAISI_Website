import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Are We in Control? Links | VAISI",
  description: "Group chats and reading for VAISI's Are We in Control? discussion.",
  robots: { index: false, follow: false },
};

const links = [
  {
    heading: "Join the conversation",
    items: [
      {
        label: "VAISI GroupMe",
        detail: "Join the Virginia AI Security Initiative GroupMe",
        href: "https://groupme.com/join_group/110490963/bxseYw8L",
      },
      {
        label: "Societal AI GroupMe",
        detail: "Join the Societal AI GroupMe",
        href: "https://groupme.com/join_group/103135952/Hm23l608",
      },
    ],
  },
  {
    heading: "Learn more",
    items: [
      {
        label: "Ajeya Cotra on the Dwarkesh Podcast",
        detail: "Conversation and transcript on Dwarkesh's site",
        href: "https://www.dwarkesh.com/p/ajeya-cotra",
      },
      {
        label: "METR's full Hugging Face incident report",
        detail: "The independent investigation",
        href: "https://metr.org/blog/2026-08-26-openai-hugging-face-incident-investigation/",
      },
    ],
  },
];

export default function AreWeInControlLinksPage() {
  return (
    <div className="min-h-[70vh] bg-white px-5 py-16 sm:py-20">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-4xl font-bold leading-tight text-primary sm:text-5xl">
          Are We in Control?
        </h1>
        <p className="mt-4 max-w-xl text-lg leading-relaxed text-gray-600">
          Links to stay involved and learn more about the incident discussed today.
        </p>

        <div className="mt-12 space-y-12">
          {links.map((section) => (
            <section key={section.heading} aria-label={section.heading}>
              <h2 className="mb-3 text-xl font-bold text-primary">{section.heading}</h2>
              <ul className="border-t border-gray-200">
                {section.items.map((item) => (
                  <li key={item.href} className="border-b border-gray-200">
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex min-h-20 items-center justify-between gap-5 py-4 text-primary transition-colors duration-150 hover:text-secondary"
                    >
                      <span>
                        <span className="block text-lg font-medium leading-snug underline decoration-transparent underline-offset-4 group-hover:decoration-current">
                          {item.label}
                        </span>
                        <span className="mt-1 block text-sm leading-snug text-gray-500">
                          {item.detail}
                        </span>
                      </span>
                      <span aria-hidden="true" className="shrink-0 text-xl leading-none">↗</span>
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
