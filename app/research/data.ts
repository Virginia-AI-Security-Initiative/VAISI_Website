export type PublicationKind = "technical" | "fellowship" | "policy";

export type Publication = {
  slug: string;
  title: string;
  authors: string;
  kind: PublicationKind;
  collection: string;
  date: string;
  topics: string[];
  sourceUrl: string;
  sourceLabel: "Original Substack" | "Original PDF";
  heroImage?: string;
  heroImageAlt?: string;
  award?: "1st" | "2nd" | "3rd";
  featuredRank?: number;
};

export const KIND_LABELS: Record<PublicationKind, string> = {
  technical: "Technical research",
  fellowship: "Fellowship capstone projects",
  policy: "Policy briefs",
};

export const publications: Publication[] = [
  {
    slug: "emotion-concepts-gemma-2",
    title: "Identifying and Validating Emotion Concept Representations in Gemma 2 2B",
    authors: "Avery Li, Nia Mucher",
    kind: "technical",
    collection: "VAISI Technical Team",
    date: "2026-08-13",
    topics: ["Mechanistic interpretability", "Model behavior"],
    sourceUrl: "https://vaisi.substack.com/p/identifying-and-validating-emotion",
    sourceLabel: "Original Substack",
    heroImage: "/research/articles/emotion-concepts-gemma-2/figure-1.png",
    heroImageAlt: "Bar chart of mean Gemma 2 emotion-vector activations on LMSYS text",
    featuredRank: 1,
  },
  {
    slug: "cross-model-steering-vectors",
    title:
      "A Direction for Some, Not All: Cross-Model Transfer of Steering Vectors and the Limits of Steering-Based Safety Interventions",
    authors: "Joshua Yoo",
    kind: "technical",
    collection: "VAISI Technical Team",
    date: "2026-06-17",
    topics: ["Model steering", "Representations"],
    sourceUrl: "https://vaisi.substack.com/p/a-direction-for-some-not-all-cross",
    sourceLabel: "Original Substack",
    heroImage: "/research/articles/cross-model-steering-vectors/figure-1.png",
    heroImageAlt: "Diagram showing a steering vector mapped from one language model to another",
    featuredRank: 2,
  },
  {
    slug: "hue-saturation-manifold-gemma-2",
    title:
      "Geometric Concept Representations in Language Models: A 3D Hue-Saturation Manifold in Gemma 2 9B and Manifold Steering",
    authors: "Aarav Lodha",
    kind: "technical",
    collection: "VAISI Technical Team",
    date: "2026-06-14",
    topics: ["Interpretability", "Representation geometry"],
    sourceUrl: "https://vaisi.substack.com/p/geometric-concept-representations",
    sourceLabel: "Original Substack",
    heroImage: "/research/articles/hue-saturation-manifold-gemma-2/figure-1.png",
    heroImageAlt: "Circular arrangement of color concepts in a two-dimensional probe space",
    featuredRank: 3,
  },
  {
    slug: "ai-evaluations-landscape",
    title: "The Current Landscape for AI Evaluations and Where We Need to Land",
    authors: "Mustafa Lonandwala",
    kind: "fellowship",
    collection: "AI Governance Fellowship · Spring 2026",
    date: "2026-05-14",
    topics: ["AI evaluations", "Governance"],
    sourceUrl:
      "/research/fellowship_projects/The Current Landscape for AI Evaluations And Where We Need to Land – Mustafa Lonandwala – 5_14_26.pdf",
    sourceLabel: "Original PDF",
    heroImage: "/research/covers/ai-evaluations-landscape.jpg",
    heroImageAlt: "First page of The Current Landscape for AI Evaluations",
  },
  {
    slug: "virginia-public-contribution-requirements",
    title: "Virginia Public Contribution Requirements for AI Policy",
    authors: "Nia Mucher",
    kind: "fellowship",
    collection: "AI Governance Fellowship · Spring 2026",
    date: "2026-05-12",
    topics: ["Virginia policy", "Data centers"],
    sourceUrl:
      "/research/fellowship_projects/Policy Virginia Public Contribution Req – Nia Mucher – 5_12_26.pdf",
    sourceLabel: "Original PDF",
  },
  {
    slug: "ai-surveillance-communities",
    title: "How AI Enhances Surveillance Against Communities Without Their Knowledge",
    authors: "Shaina Kumar, Rishi Chandra",
    kind: "fellowship",
    collection: "AI Governance Fellowship · Spring 2026",
    date: "2026-05-11",
    topics: ["Surveillance", "Civil liberties"],
    sourceUrl:
      "/research/fellowship_projects/How AI Enhances Surveillance Against Communities Without Their Knowledge – Rishi Chandra and Shaina Kumar – 5_11_26.pdf",
    sourceLabel: "Original PDF",
  },
  {
    slug: "governance-ai-generated-ncii",
    title: "Where Governance Fails on AI-Generated Nonconsensual Intimate Imagery",
    authors: "Sara Alterazi, Patrick Gilmartin",
    kind: "fellowship",
    collection: "AI Governance Fellowship · Spring 2026",
    date: "2026-05-11",
    topics: ["Online harms", "Technology policy"],
    sourceUrl:
      "/research/fellowship_projects/Sara Alterazi & Patrick Gilmartin – Opinion Essay – 5_11_26.pdf",
    sourceLabel: "Original PDF",
  },
  {
    slug: "us-china-ai-approaches",
    title: "A Comparative Analysis of US-Chinese Approaches to AI",
    authors: "Maeve Myers",
    kind: "fellowship",
    collection: "AI Governance Fellowship · Spring 2026",
    date: "2026-05-06",
    topics: ["China", "International governance"],
    sourceUrl:
      "/research/fellowship_projects/A Comparative Analysis of US-Chinese Approaches to AI – Maeve Myers – 5_6_26.pdf",
    sourceLabel: "Original PDF",
  },
  {
    slug: "how-ai-escapes-governance",
    title: "How AI Escapes Governance",
    authors: "Kate McCray",
    kind: "fellowship",
    collection: "AI Governance Fellowship · Spring 2026",
    date: "2026-05-01",
    topics: ["Political narratives", "Governance"],
    sourceUrl:
      "/research/fellowship_projects/How AI Escapes Governance – Kate McCray – 5_1_26 .pdf",
    sourceLabel: "Original PDF",
  },
  {
    slug: "armenia-compute-diplomacy",
    title: "What Armenia’s Tech Emergence Can Teach Us About Compute Diplomacy",
    authors: "Hovsep Seferian",
    kind: "fellowship",
    collection: "AI Governance Fellowship · Spring 2026",
    date: "2026-04-28",
    topics: ["Compute diplomacy", "Armenia"],
    sourceUrl:
      "/research/fellowship_projects/What Armenia’s Tech Emergence Can Teach Us About Compute Diplomacy – Hovsep Seferian – 4_28_26.pdf",
    sourceLabel: "Original PDF",
    heroImage: "/research/covers/armenia-compute-diplomacy.jpg",
    heroImageAlt: "First page of the compute diplomacy fellowship paper",
  },
  {
    slug: "ai-and-jobs-action-gap",
    title: "AI and Jobs: The Ideas Exist. The Action Doesn’t.",
    authors: "Andrew Broughton",
    kind: "fellowship",
    collection: "AI Governance Fellowship · Spring 2026",
    date: "2026-04-27",
    topics: ["Future of work", "Labor policy"],
    sourceUrl:
      "/research/fellowship_projects/AI and Jobs_ The Ideas Exist. The Action Doesn_t – Andrew Broughton – 4_27_26.pdf",
    sourceLabel: "Original PDF",
  },
  {
    slug: "dual-framework-ai-chip-smuggling",
    title: "Location Verification Is Not Enough: A Dual Framework to Combat Large-Scale AI Chip Smuggling",
    authors: "Seth Lifland, Shubhrangshu Debsarkar",
    kind: "fellowship",
    collection: "AI Governance Fellowship · Spring 2026",
    date: "2026-04-24",
    topics: ["Semiconductors", "Export controls"],
    sourceUrl:
      "/research/fellowship_projects/A Dual Framework to Combat Large-Scale AI Chip Smuggling – Seth Lifland and Shubhrangshu Debsarkar – 4_17_26.pdf",
    sourceLabel: "Original PDF",
    heroImage: "/research/covers/dual-framework-ai-chip-smuggling.jpg",
    heroImageAlt: "First page of the AI chip-smuggling research paper",
  },
  {
    slug: "ai-safety-investigation-act",
    title: "The AI Safety Investigation Act: A Federal AI Incident Investigation and Reporting Authority",
    authors: "Logan Bradley, Ishan Ajwani",
    kind: "policy",
    collection: "AI Policy Competition · Spring 2026",
    date: "2026-04-04",
    topics: ["Incident reporting", "Federal policy"],
    sourceUrl:
      "/research/policy_briefs/Logan Bradley, Ishan Ajwani - AI Safety Investigation Act Brief.pdf",
    sourceLabel: "Original PDF",
    heroImage: "/research/covers/ai-safety-investigation-act.jpg",
    heroImageAlt: "First page of the AI Safety Investigation Act policy brief",
    award: "1st",
  },
  {
    slug: "making-ai-governable-for-americans-act",
    title: "The Making AI Governable for Americans Act (MAGA Act)",
    authors: "Owen Watzlavick, Adrian Klaits",
    kind: "policy",
    collection: "AI Policy Competition · Spring 2026",
    date: "2026-04-04",
    topics: ["Labor transition", "Safety certification"],
    sourceUrl:
      "/research/policy_briefs/MAGA_Act_Policy_Brief (3) - Owen Watzlavick.pdf",
    sourceLabel: "Original PDF",
    award: "2nd",
  },
  {
    slug: "ai-market-structure-reform-act",
    title: "AI Market Structure Reform Act",
    authors: "Ricardo Bruinton, Jason Chen, Ryan Healy",
    kind: "policy",
    collection: "AI Policy Competition · Spring 2026",
    date: "2026-04-04",
    topics: ["Competition policy", "Market structure"],
    sourceUrl:
      "/research/policy_briefs/AI Policy Hackathon - Ricardo Bruinton FINAL.pdf",
    sourceLabel: "Original PDF",
    award: "3rd",
  },
  {
    slug: "digital-letters-of-marque",
    title: "Establishing a National “Digital Letters of Marque” Framework for Frontier AI Enforcement",
    authors: "Leah Huff",
    kind: "policy",
    collection: "AI Policy Competition · Spring 2026",
    date: "2026-04-04",
    topics: ["Cybersecurity", "Enforcement"],
    sourceUrl: "/research/policy_briefs/Revised_Policy_Submission - Leah.pdf",
    sourceLabel: "Original PDF",
  },
  {
    slug: "national-ai-security-organization",
    title: "Proposal for the National AI Security Organization (NASO)",
    authors: "Binit Maharjan",
    kind: "policy",
    collection: "AI Policy Competition · Spring 2026",
    date: "2026-04-04",
    topics: ["Institutional design", "Red teaming"],
    sourceUrl: "/research/policy_briefs/Binit M FINAL.pdf",
    sourceLabel: "Original PDF",
  },
  {
    slug: "modular-risk-based-frontier-ai-regulation",
    title: "Regulating Frontier AI Through a Modular Risk-Based Approach",
    authors: "Aashka Vyas, Arjun Dsouza",
    kind: "policy",
    collection: "AI Policy Competition · Spring 2026",
    date: "2026-04-04",
    topics: ["Risk regulation", "Federal policy"],
    sourceUrl:
      "/research/policy_briefs/Policy Brief_VAISI AI Policy Hackathon - Aashka Vyas.pdf",
    sourceLabel: "Original PDF",
  },
];

export const featuredPublications = publications
  .filter((publication) => publication.featuredRank)
  .sort((a, b) => (a.featuredRank ?? 99) - (b.featuredRank ?? 99));

export function getPublication(slug: string) {
  return publications.find((publication) => publication.slug === slug);
}

export function formatPublicationDate(date: string) {
  const [year, month, day] = date.split("-").map(Number);
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(year, month - 1, day));
}
