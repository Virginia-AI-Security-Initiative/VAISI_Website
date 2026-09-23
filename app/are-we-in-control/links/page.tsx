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
        width={320}
        height={180}
        className="h-20 w-24 shrink-0 rounded-lg object-cover image-outline lg:h-36 lg:w-full lg:rounded-none"
      />
    );
  }

  if (visual === "report") {
    return (
      <span className="flex h-20 w-24 shrink-0 flex-col items-center justify-center gap-1 rounded-lg bg-gray-50 px-2 image-outline lg:h-36 lg:w-full lg:gap-3 lg:rounded-none">
        <Image src="/images/are-we-in-control/metr-logo.svg" alt="METR" width={151} height={33} className="h-auto w-[76px] lg:w-[145px]" />
        <Image src="/images/are-we-in-control/redwood-logo.svg" alt="Redwood Research" width={279} height={73} className="h-auto w-[79px] lg:w-[155px]" />
      </span>
    );
  }

  return (
    <span className="flex h-20 w-24 shrink-0 items-center justify-center rounded-lg bg-[#edf5fa] image-outline lg:h-36 lg:w-full lg:rounded-none">
      <span
        aria-hidden="true"
        className="size-11 bg-[#00aff0] lg:size-16"
        style={{
          mask: "url(/groupme.png) center / contain no-repeat",
          WebkitMask: "url(/groupme.png) center / contain no-repeat",
        }}
      />
    </span>
  );
}

export default function AreWeInControlLinksPage() {
  return (
    <div className="min-h-[70vh] bg-white px-5 py-16 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-4xl font-bold leading-tight text-primary sm:text-5xl">
          Are We in Control?
        </h1>
        <p className="mt-4 max-w-xl text-lg leading-relaxed text-gray-600">
          Links to stay involved and learn more about the incident discussed today.
        </p>

        <div className="mt-12 space-y-10 lg:grid lg:grid-cols-2 lg:gap-8 lg:space-y-0">
          {links.map((section) => (
            <section key={section.heading} aria-label={section.heading}>
              <h2 className="mb-4 text-xl font-bold text-primary">{section.heading}</h2>
              <ul className="grid gap-3 lg:grid-cols-2 lg:gap-4">
                {section.items.map((item) => (
                  <li key={item.href} className="min-w-0">
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex h-full min-h-28 items-center gap-3 overflow-hidden rounded-xl border border-gray-200 bg-white p-3 text-primary transition-[border-color,box-shadow,color] duration-150 hover:border-gray-300 hover:text-secondary hover:shadow-sm lg:block lg:p-0"
                    >
                      <LinkVisual visual={item.visual} />
                      <span className="block min-w-0 flex-1 lg:min-h-32 lg:p-4">
                        <span className="block text-lg font-medium leading-snug underline decoration-transparent underline-offset-4 group-hover:decoration-current">
                          {item.label}
                        </span>
                        <span className="mt-1 block text-sm leading-snug text-gray-500">
                          {item.detail}
                        </span>
                      </span>
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
