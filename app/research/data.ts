export type PolicyBrief = {
    title: string;
    url: string;
    authors: string;
    source: string;
    date: string; // YYYY-MM-DD
    award?: string;
};

export type TechPaper = {
    title: string;
    url: string;
    authors: string;
    venue: string;
    date: string; // YYYY-MM-DD
};

export type FellowshipProject = {
    title: string;
    url: string;
    authors: string;
    fellowship: string;
    date: string; // YYYY-MM-DD
};

export type AnyPub =
    | { kind: 'policy'; item: PolicyBrief }
    | { kind: 'tech'; item: TechPaper }
    | { kind: 'fellowship'; item: FellowshipProject };

export const policyBriefs: PolicyBrief[] = [
    {
        title: "The AI Safety Investigation Act: A Federal AI Incident Investigation and Reporting Authority",
        url: "/research/policy_briefs/Logan Bradley, Ishan Ajwani - AI Safety Investigation Act Brief.pdf",
        authors: "Logan Bradley, Ishan Ajwani",
        source: "AI Policy Competition Spring 2026",
        date: "2026-04-04",
        award: "1st",
    },
    {
        title: "The Making AI Governable for Americans Act (MAGA Act)",
        url: "/research/policy_briefs/MAGA_Act_Policy_Brief (3) - Owen Watzlavick.pdf",
        authors: "Owen Watzlavick, Adrian Klaits",
        source: "AI Policy Competition Spring 2026",
        date: "2026-04-04",
        award: "2nd",
    },    
    {
        title: "AI Market Structure Reform Act",
        url: "/research/policy_briefs/AI Policy Hackathon - Ricardo Bruinton FINAL.pdf",
        authors: "Ricardo Bruinton, Jason Chen, Ryan Healy",
        source: "AI Policy Competition Spring 2026",
        date: "2026-04-04",
        award: "3rd",
    },    
    {
        title: "Establishing a National \"Digital Letters of Marque\" Framework for Frontier AI Enforcement",
        url: "/research/policy_briefs/Revised_Policy_Submission - Leah.pdf",
        authors: "Leah Huff",
        source: "AI Policy Competition Spring 2026",
        date: "2026-04-04",
    },
    {
        title: "Proposal for the National AI Security Organization (NASO)",
        url: "/research/policy_briefs/Binit M FINAL.pdf",
        authors: "Binit Maharjan",
        source: "AI Policy Competition Spring 2026",
        date: "2026-04-04",
    },    
    {
        title: "Regulating Frontier AI Through A Modular Risk-Based Approach",
        url: "/research/policy_briefs/Policy Brief_VAISI AI Policy Hackathon - Aashka Vyas.pdf",
        authors: "Aashka Vyas, Arjun Dsouza",
        source: "AI Policy Competition Spring 2026",
        date: "2026-04-04",
    },
];

export const techPapers: TechPaper[] = [
    {
        title: "Geometric Concept Representations in Language Models: A 3D Hue-Saturation Manifold in Gemma 2 9B and Manifold Steering",
        url: "https://substack.com/home/post/p-202068395",
        authors: "Aarav Lodha",
        venue: "VAISI Substack",
        date: "2026-06-14",
    },
    {
        title: "A Direction for Some, Not All: Cross-Model Transfer of Steering Vectors and the Limits of Steering-Based Safety Interventions",
        url: "https://substack.com/home/post/p-202505766",
        authors: "Joshua Yoo",
        venue: "VAISI Substack",
        date: "2026-06-17",
    },
];

export const fellowshipProjects: FellowshipProject[] = [
    {
    title: "Location Verification is not Enough: A Dual Framework to Combat Large-Scale AI Chip Smuggling",
    url: "research/fellowship_projects/A Dual Framework to Combat Large-Scale AI Chip Smuggling – Seth Lifland and Shubhrangshu Debsarkar – 4_17_26.pdf",
    authors: "Seth Lifland, Shubhrangshu Debsarkar",
    fellowship: "AI Governance (Spring '26)",
    date: "2026-04-24",
    },
    {
    title: "What Armenia’s Tech Emergence Can Teach Us About Compute Diplomacy",
    url: "/research/fellowship_projects/What Armenia’s Tech Emergence Can Teach Us About Compute Diplomacy – Hovsep Seferian – 4_28_26.pdf",
    authors: "Hovsep Seferian",
    fellowship: "AI Governance (Spring '26)",
    date: "2026-04-28",
    },
    {
    title: "Virginia Public Contribution Requirements for AI Policy",
    url: "/research/fellowship_projects/Policy Virginia Public Contribution Req – Nia Mucher – 5_12_26.pdf",
    authors: "Nia Mucher",
    fellowship: "AI Governance (Spring '26)",
    date: "2026-05-12",
    },    
    {
    title: "How AI Enhances Surveillance Against Communities Without Their Knowledge",
    url: "/research/fellowship_projects/How AI Enhances Surveillance Against Communities Without Their Knowledge – Rishi Chandra and Shaina Kumar – 5_11_26.pdf",
    authors: "Shaina Kumar, Rishi Chandra",
    fellowship: "AI Governance (Spring '26)",
    date: "2026-05-11",
    },
    {
    title: "A Comparative Analysis of US-Chinese Approaches to AI",
    url: "/research/fellowship_projects/A Comparative Analysis of US-Chinese Approaches to AI – Maeve Myers – 5_6_26.pdf",
    authors: "Maeve Myers",
    fellowship: "AI Governance (Spring '26)",
    date: "2026-05-06",
    },
    {
    title: "AI and Jobs: The Ideas Exist. The Action Doesn't.",
    url: "/research/fellowship_projects/AI and Jobs_ The Ideas Exist. The Action Doesn_t – Andrew Broughton – 4_27_26.pdf",
    authors: "Andrew Broughton",
    fellowship: "AI Governance (Spring '26)",
    date: "2026-04-27",
    },
    {
    title: "How AI Escapes Governance",
    url: "/research/fellowship_projects/How AI Escapes Governance – Kate McCray – 5_1_26 .pdf",
    authors: "Kate McCray",
    fellowship: "AI Governance (Spring '26)",
    date: "2026-05-01",
    },
    {
    title: "The Current Landscape for AI Evaluations and Where We Need to Land",
    url: "/research/fellowship_projects/The Current Landscape for AI Evaluations And Where We Need to Land – Mustafa Lonandwala – 5_14_26.pdf",
    authors: "Mustafa Lonandwala",
    fellowship: "AI Governance (Spring '26)",
    date: "2026-05-14",
    },    
    {
    title: "Where Governance Fails on AI-Generated Nonconsensual Intimate Imagery",
    url: "/research/fellowship_projects/Sara Alterazi & Patrick Gilmartin – Opinion Essay – 5_11_26.pdf",
    authors: "Sara Alterazi, Patrick Gilmartin",
    fellowship: "AI Governance (Spring '26)",
    date: "2026-05-11",
    },
];

export const allPublications: AnyPub[] = [
    ...policyBriefs.map((item) => ({ kind: 'policy' as const, item })),
    ...techPapers.map((item) => ({ kind: 'tech' as const, item })),
    ...fellowshipProjects.map((item) => ({ kind: 'fellowship' as const, item })),
].sort((a, b) => b.item.date.localeCompare(a.item.date));

export const KIND_LABELS: Record<AnyPub['kind'], string> = {
    policy: 'Policy Briefs',
    tech: 'Technical Team Research',
    fellowship: 'Fellowship Capstone Projects',
};

export const tagGroups: { label: string; tags: string[] }[] = [
    { label: 'Type', tags: ['Policy Briefs', 'Technical Team Research', 'Fellowship Capstone Projects'] },
    { label: 'Source', tags: [...new Set(policyBriefs.map((b) => b.source))] },
    { label: 'Venue', tags: [...new Set(techPapers.map((p) => p.venue))] },
    { label: 'Fellowship', tags: [...new Set(fellowshipProjects.map((f) => f.fellowship))] },
].filter((g) => g.tags.length > 0);
