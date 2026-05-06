export type PolicyBrief = {
    title: string;
    url: string;
    authors: string;
    source: string;
    date: string; // YYYY-MM-DD
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
        title: "AI Market Structure Reform Act",
        url: "/research/policy_briefs/AI Policy Hackathon (3) - Ricardo Bruinton.pdf",
        authors: "Ricardo Bruinton, Jason Chen, Ryan Healy",
        source: "AI Policy Hackathon",
        date: "2026-04-04",
    },
    {
        title: "The AI Safety Investigation Act: A Federal AI Incident Investigation and Reporting Authority",
        url: "/research/policy_briefs/Logan Bradley, Ishan Ajwani - AI Safety Investigation Act Brief - Logan Bradley.pdf",
        authors: "Logan Bradley, Ishan Ajwani",
        source: "AI Policy Hackathon",
        date: "2026-04-04",
    },
    {
        title: "The Making AI Governable for Americans Act (MAGA Act)",
        url: "/research/policy_briefs/MAGA_Act_Policy_Brief (3) - Owen Watzlavick.pdf",
        authors: "Owen Watzlavick, Adrian Klaits",
        source: "AI Policy Hackathon",
        date: "2026-04-04",
    },
    {
        title: "Regulating Frontier AI Through A Modular Risk-Based Approach",
        url: "/research/policy_briefs/Policy Brief_VAISI AI Policy Hackathon - Aashka Vyas.pdf",
        authors: "Aashka Vyas, Arjun Dsouza",
        source: "AI Policy Hackathon",
        date: "2026-04-04",
    },
    {
        title: "Establishing a National \"Digital Letters of Marque\" Framework for Frontier AI Enforcement",
        url: "/research/policy_briefs/Revised_Policy_Submission - Leah.pdf",
        authors: "Leah Huff",
        source: "AI Policy Hackathon",
        date: "2026-04-04",
    },
    {
        title: "Proposal for the National AI Security Organization (NASO)",
        url: "/research/policy_briefs/Untitled document - Binit M.pdf",
        authors: "Binit Maharjan",
        source: "AI Policy Hackathon",
        date: "2026-04-04",
    },
];

export const techPapers: TechPaper[] = [

];

export const fellowshipProjects: FellowshipProject[] = [
        {
        title: "Location Verification is not Enough: A Dual Framework to Combat Large-Scale AI Chip Smuggling",
        url: "/research/fellowship_projects/ICML_Governance_Paper-12.pdf",
        authors: "Seth Lifland, Shubhrangshu Debsarkar",
        fellowship: "Technical Governance Fellowship",
        date: "2026-04-24",
    },
];

export const allPublications: AnyPub[] = [
    ...policyBriefs.map((item) => ({ kind: 'policy' as const, item })),
    ...techPapers.map((item) => ({ kind: 'tech' as const, item })),
    ...fellowshipProjects.map((item) => ({ kind: 'fellowship' as const, item })),
].sort((a, b) => b.item.date.localeCompare(a.item.date));

export const KIND_LABELS: Record<AnyPub['kind'], string> = {
    policy: 'Policy Briefs',
    tech: 'Technical Research',
    fellowship: 'Fellowship Capstone Projects',
};

export const tagGroups: { label: string; tags: string[] }[] = [
    { label: 'Type', tags: ['Policy Briefs', 'Technical Research', 'Fellowship Capstone Projects'] },
    { label: 'Source', tags: [...new Set(policyBriefs.map((b) => b.source))] },
    { label: 'Venue', tags: [...new Set(techPapers.map((p) => p.venue))] },
    { label: 'Fellowship', tags: [...new Set(fellowshipProjects.map((f) => f.fellowship))] },
].filter((g) => g.tags.length > 0);
