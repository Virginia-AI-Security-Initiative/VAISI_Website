import type { Metadata } from "next";
import Image from "next/image";

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
        visual: "groupme",
      },
      {
        label: "Societal AI GroupMe",
        detail: "Join the Societal AI GroupMe",
        href: "https://groupme.com/join_group/103135952/Hm23l608",
        visual: "groupme",
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
        visual: "podcast",
      },
      {
        label: "METR's full Hugging Face incident report",
        detail: "The independent investigation",
        href: "https://metr.org/blog/2026-08-26-openai-hugging-face-incident-investigation/",
        visual: "report",
      },
    ],
  },
];

function LinkVisual({ visual }: { visual: string }) {
  if (visual === "podcast") {
    return (
      <Image
        src="/images/are-we-in-control/ajeya-cotra-podcast.jpg"
        alt="Ajeya Cotra podcast thumbnail"
        width={128}
        height={80}
        className="h-16 w-24 shrink-0 rounded-lg object-cover image-outline sm:h-20 sm:w-32"
      />
    );
  }

  if (visual === "report") {
    return (
      <span className="flex h-16 w-24 shrink-0 flex-col items-center justify-center gap-1 rounded-lg bg-gray-50 px-2 image-outline sm:h-20 sm:w-32 sm:gap-1.5">
        <Image src="/images/are-we-in-control/metr-logo.svg" alt="METR" width={93} height={21} className="h-auto w-[76px] sm:w-[100px]" />
        <Image src="/images/are-we-in-control/redwood-logo.svg" alt="Redwood Research" width={104} height={27} className="h-auto w-[79px] sm:w-[106px]" />
      </span>
    );
  }

  return (
    <span className="flex h-16 w-24 shrink-0 items-center justify-center rounded-lg bg-[#edf5fa] image-outline sm:h-20 sm:w-32">
      <Image src="/groupme.png" alt="GroupMe" width={44} height={44} className="size-10 object-contain sm:size-11" />
    </span>
  );
}

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
                      className="group flex min-h-24 items-center gap-3 py-3 text-primary transition-colors duration-150 hover:text-secondary sm:gap-5 sm:py-4"
                    >
                      <LinkVisual visual={item.visual} />
                      <span className="min-w-0 flex-1">
                        <span className="block text-lg font-medium leading-snug underline decoration-transparent underline-offset-4 group-hover:decoration-current">
                          {item.label}
                        </span>
                        <span className="mt-1 block text-sm leading-snug text-gray-500">
                          {item.detail}
                        </span>
                      </span>
                      <span aria-hidden="true" className="shrink-0 self-start pt-1 text-lg leading-none sm:self-center sm:pt-0">↗</span>
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
