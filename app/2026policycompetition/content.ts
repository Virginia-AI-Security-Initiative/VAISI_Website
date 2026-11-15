// Text for the 2026 AI Policy Competition page, based on the competition's central resource doc
// (Overview, Deliverables and Schedule tabs) and written in VAISI's voice
// (see email_archive/STYLE_GUIDE.md). Facts must match the doc.
// Keep the topic out of this file until the competition begins: the repo is public.
// Values wrapped in `tbd()` are still missing from the doc and render as visible placeholders.

import type { CalendarEvent } from "./calendar";

export type Copy = string | { tbd: string };

export const tbd = (note: string): Copy => ({ tbd: note });

export type RichParagraph = (string | { text: string; url: string })[];

const ROTUNDA = "Lower West Oval Room, Rotunda"; // full address for calendar invites
const ROTUNDA_ROOM = "Lower West Oval Room"; // shown on the page as "at the Lower West Oval Room"

export type TimelineItem = {
  date: string | null; // YYYY-MM-DD (Eastern), or null while TBD
  title: string;
  time: Copy; // shown under the title, e.g. "12:00 PM"
  location?: string;
  body: Copy;
  calendar?: CalendarEvent; // omit while the date is TBD
};

const timeline: TimelineItem[] = [
  {
    date: "2026-11-15",
    title: "Competition begins",
    time: "12:00 PM",
    body: "The track goes live. Please don't start working on your brief before then, as it will result in disqualification.",
    calendar: {
      id: "hackathon-begins",
      title: "VAISI AI Policy Competition begins",
      description: "The track goes live at noon. Don't start working on your brief before then.",
      start: "2026-11-15T17:00:00Z",
      end: "2026-11-15T18:00:00Z",
    },
  },
  {
    date: "2026-11-20",
    title: "Briefs due",
    time: "5:00 PM EST",
    body: "Hard deadline. There's no submission for the presentation, so you can keep working on it until your judging slot.",
    calendar: {
      id: "hackathon-briefs-due",
      title: "AI Policy Competition brief due (5:00 PM)",
      description: "Hard deadline for your team's final 2-page policy brief.",
      start: "2026-11-20T21:30:00Z",
      end: "2026-11-20T22:00:00Z",
    },
  },
  {
    date: "2026-11-21",
    title: "Top 6 teams selected",
    time: "Before 5:00 AM",
    body: "Teams selected for in-person judging get their time slots.",
  },
  {
    date: "2026-11-22",
    title: "Judging",
    time: "1:00–3:00 PM",
    location: ROTUNDA_ROOM,
    body: "You must show up for your slot to be eligible for prizes. Have a conflict? Let us know as soon as possible.",
    calendar: {
      id: "hackathon-judging",
      title: "AI Policy Competition judging (top 6 teams)",
      description: "In-person judging for the top 6 teams. Check your assigned time slot.",
      location: ROTUNDA,
      start: "2026-11-22T18:00:00Z",
      end: "2026-11-22T20:00:00Z",
    },
  },
  {
    date: "2026-11-22",
    title: "Winner announced",
    time: "3:00–4:00 PM",
    location: ROTUNDA_ROOM,
    body: "We'll announce the winner of the competition. We'd love to see you there!",
    calendar: {
      id: "hackathon-winner",
      title: "AI Policy Competition winner announcement",
      description: "VAISI announces the winner of the 2026 AI Policy Competition.",
      location: ROTUNDA,
      start: "2026-11-22T20:00:00Z",
      end: "2026-11-22T21:00:00Z",
    },
  },
];

// Scroll storyboard shown above the hero. DRAFT: wording awaiting officer approval.
// Every claim must match its source; keep the open-source framing only where the source supports it.
// Cookie set once a visitor has scrolled through the intro (or skipped it); returning visitors see the short version.
export const INTRO_SEEN_COOKIE = "vaisi_hackathon_intro_seen";

export const storyboard = {
  replay: "Replay the intro",
  eyebrow: "VAISI's 2026 AI Policy Competition",
  headline: "Open models put powerful AI in anyone's hands.",
  subhead: "Here's how fast that's moving, and how little stands in the way.",
  skip: "Skip to the competition",
  // The open-weight chain: frontier capability climbs fast -> open models catch up within months ->
  // their safeguards come off cheaply -> once released, there's no recall. Keep figures exactly as sourced.
  beats: [
    {
      year: "2026",
      org: "METR",
      stat: "Every 131 days",
      finding: "How often the length of task frontier AI agents can complete on their own has doubled since 2023.",
      source: { label: "METR", url: "https://metr.org/blog/2026-1-29-time-horizon-1-1" },
    },
    {
      year: "2025",
      org: "Epoch AI",
      stat: "~3 months",
      finding: "How far the best open-weight models trail the state of the art, on average. Whatever the frontier can do, anyone can download soon after.",
      source: { label: "Epoch AI", url: "https://epoch.ai/data-insights/open-weights-vs-closed-weights-models" },
    },
    {
      year: "2024",
      org: "NeurIPS paper (Arditi et al.)",
      stat: "One direction",
      finding: "In 13 popular open models, refusing harmful requests comes down to a single direction inside the model. Remove it, and the model stops refusing.",
      source: { label: "arXiv", url: "https://arxiv.org/abs/2406.11717" },
    },
    {
      year: "2025",
      org: "International AI Safety Report",
      stat: "No rollback",
      finding: "Once model weights are available for public download, there is no way to recall every copy or make sure they all get safety updates.",
      source: { label: "arXiv", url: "https://arxiv.org/abs/2501.17805" },
    },
  ],
  // Rapid-fire findings that pile up, each faster than the last.
  flood: [
    {
      year: "2026",
      org: "Anthropic Frontier Red Team",
      stat: "99% unpatched",
      finding: "A frontier model found thousands of severe vulnerabilities in widely used software. Over 99% were still unpatched when reported.",
      source: { label: "Anthropic", url: "https://www.anthropic.com/news/mythos-preview" },
    },
    {
      year: "2026",
      org: "METR",
      stat: "5+ hours",
      finding: "The length of software task the best frontier model can complete, about half the time.",
      source: { label: "METR", url: "https://metr.org/blog/2026-1-29-time-horizon-1-1" },
    },
    {
      year: "2025",
      org: "Epoch AI",
      stat: "Gap: sometimes zero",
      finding: "The lag between open and closed models moves around, at times closing completely.",
      source: { label: "Epoch AI", url: "https://epoch.ai/data-insights/open-weights-vs-closed-weights-models" },
    },
    {
      year: "2025",
      org: "Meta",
      stat: "1 billion+",
      finding: "Downloads of Meta's open Llama models, including derivatives.",
      source: { label: "Meta", url: "https://about.fb.com/news/2025/03/celebrating-1-billion-downloads-llama/" },
    },
    {
      year: "2025",
      org: "Moonshot AI",
      stat: "Beat GPT-5",
      finding: "Kimi K2 Thinking, an open-weight model, outscored GPT-5 on an agentic web-research benchmark.",
      source: { label: "Delante", url: "https://delante.co/kimi-k2-thinking/" },
    },
    {
      year: "2023",
      org: "Shadow Alignment (Yang et al.)",
      stat: "100 examples",
      finding: "And 1 GPU hour: enough fine-tuning to turn safety-trained open models into ones that produce harmful content.",
      source: { label: "arXiv", url: "https://arxiv.org/abs/2310.02949" },
    },
    {
      year: "2023",
      org: "BadLlama (Palisade Research)",
      stat: "Under $200",
      finding: "The cost to strip the safety fine-tuning from Meta's openly released Llama 2-Chat 13B.",
      source: { label: "arXiv", url: "https://arxiv.org/abs/2311.00117" },
    },
    {
      year: "2025",
      org: "Cisco",
      stat: "0 of 50 blocked",
      finding: "DeepSeek R1, a freely downloadable model, answered every harmful test prompt. The test cost under $50.",
      source: { label: "Cisco", url: "https://blogs.cisco.com/security/evaluating-security-risk-in-deepseek-and-other-frontier-reasoning-models" },
    },
    {
      year: "2026",
      org: "Hugging Face search",
      stat: "~5,000",
      finding: "Models on Hugging Face tagged “abliterated”: open models with their refusals deliberately removed.",
      source: { label: "BSWEN", url: "https://docs.bswen.com/blog/2026-03-10-huggingface-uncensored-models-guide" },
    },
    {
      year: "2023",
      org: "Meta LLaMA",
      stat: "1 week",
      finding: "How long Meta's access-controlled LLaMA weights stayed controlled before leaking to 4chan.",
      source: { label: "Wikipedia", url: "https://en.wikipedia.org/wiki/Llama_(language_model)" },
    },
  ],
  outro: "Your chance to find a solution.",
  sourcesLabel: "Sources",
};

export const hackathon = {
  title: "AI Policy Competition",
  tagline:
    "Join us, and participate in our annual AI Policy Competition! You will design a 2 page brief to address the guiding question working solo or in teams of up to three people. Six teams will be chosen to present to a panel of judges on November 22nd.",
  facts: [
    { label: "Prizes", value: "$1,000" },
    { label: "Max team size", value: "3 members" },
    { label: "Expected time", value: "10 hours per team" },
    { label: "Judging", value: "1–3 PM, November 22" },
  ],

  intro:
    "The Virginia AI Security Initiative is hosting our second AI Policy Competition! Everything you need to compete is below. Feel free to reach out in the GroupMe with any questions.",
  eligibility: {
    heading: "Eligibility",
    body: "Open to all undergraduate and graduate students. Non-students are welcome to submit a brief, but aren't eligible for final judging or prizes.",
  },
  timeCommitment: {
    heading: "Expected Time Commitment",
    body: "About 10 hours per team, though this will vary from team to team.",
  },

  schedule: {
    intro:
      "We'll update times and locations as they're finalized. The only required in-person commitment is judging (for teams selected).",
    addAll: "Add all to calendar (.ics)",
  },
  timeline,
  coworking: {
    heading: "Coworking sessions",
    when: "1:30–3:00 PM every day, November 16–20",
    where: "Clem 2",
    body: "No RSVP needed! Stop by to brainstorm, talk through policy ideas, or just cowork with whichever officers are there. Ask in the GroupMe if you can't find us.",
    calendar: {
      id: "hackathon-coworking",
      title: "AI Policy Competition coworking (Clem 2)",
      description: "Drop-in coworking with VAISI officers. No RSVP needed.",
      location: "Clem 2",
      start: "2026-11-16T18:30:00Z",
      end: "2026-11-16T20:00:00Z",
      rrule: "FREQ=DAILY;COUNT=5",
    } satisfies CalendarEvent,
  },

  prizes: [
    { place: "1st Place", amount: "$550" },
    { place: "2nd Place", amount: "$325" },
    { place: "3rd Place", amount: "$125" },
  ],
  uvaPrize: {
    title: "Highest Placing UVA Student(s)",
    body: "Automatic acceptance to the Spring 2027 AI Policy Fellowship",
  },

  track: {
    label: "Guiding question",
    question: "Released 12 PM, November 15" as Copy,
    context: "Please don't start working on your brief before then, as it will result in disqualification." as Copy,
    // The page swaps in `released` on its own at this time (12 PM Eastern on November 15), no deploy needed.
    releasesAt: new Date("2026-11-15T17:00:00.000Z"),
    released: {
      title: "Reducing AI Risk",
      question: "How should the U.S. government balance innovation with mitigating Chemical, Biological, Radiological, or Nuclear (CBRN) risks and cyberwarfare risks from Large Language Models (LLMs)?" as Copy,
      context: "" as Copy,
      // Paragraphs are lists of plain text and { text, url } links.
      sections: [
        {
          heading: "Your task",
          paragraphs: [
            ["Propose one policy that would reduce risk associated with AI models and advanced CBRN or cybersecurity capabilities. Your policy may propose legislation, or show how existing agencies and departments can address these threats using authorities they already have, such as sanctions, procurement, standards-setting, or existing biosecurity programs."],
            ["In your analysis, consider tradeoffs across different policy strategies. Relevant considerations may include: where to intervene, scope, costs to openness, implementation, durability."],
            ["You do not need to cover every factor exhaustively, but you should show thoughtful prioritization and reasoning."],
          ] as RichParagraph[],
        },
        {
          heading: "Motivation",
          paragraphs: [
            [
              "AI development is progressing rapidly, and ",
              { text: "recent evidence suggests it’s accelerating", url: "https://metr.org/blog/2026-11-05-anthropic-ai-rd-acceleration-assessment/#executive-summary" },
              " as ",
              { text: "AI takes a larger role", url: "https://www.anthropic.com/institute/measuring-pace-of-ai-development" },
              " in its own research and development. LLMs have sent shockwaves through fields including ",
              { text: "mathematics", url: "https://openai.com/index/navier-stokes-solution/" },
              " and ",
              { text: "cybersecurity", url: "https://www.bbc.com/news/articles/c3qjnwye0ep5o" },
              ", and are advancing rapidly in areas like ",
              { text: "robotics", url: "https://www.anthropic.com/claude-fable-and-mythos-5-2" },
              ". Transformer-based models have also made advances in other areas, ",
              { text: "like virology", url: "https://www.bbc.com/news/articles/c5y3j3ngevmo" },
              ", which could clearly pose threats to human lives; as AI models become capable of constructing new viruses, and assisting humans in the creations of those viruses, the threat of new biological weapons rises.",
            ],
            ["Proprietary models are usually released with guardrails, which prevent them from answering questions which could lead to harmful development of bioweapons or proliferation of dangerous cyberattacks. However, once an open-weight model is released, it cannot be recalled. Anyone can download it, and its safety training can be removed cheaply through fine-tuning. As these models get better at reasoning, coding, and autonomous action, they could give non-state actors two dangerous capabilities. The first is the expert troubleshooting that has historically kept chemical, biological, radiological, and nuclear weapons out of reach. The second is offensive cyber capability once limited to nation-states."],
            [
              "In addition to open-weight models, ",
              { text: "frontier labs information security is lagging behind where it needs to be", url: "https://www.justice.gov/opa/pr/saudi-national-arrested-installing-surreptitious-audio-recording-device-openai" },
              ", threatening the theft and misuse of their own proprietary and highly capable models. Finally, labs have demonstrated that they do not know how to align or control their internal models, ",
              { text: "leading to incidents where internal models broke out of evaluation environments", url: "https://metr.org/blog/2026-08-26-openai-hugging-face-incident-investigation/" },
              " and autonomously conducted cyberattacks on the internet.",
            ],
            ["Despite these risks, AI drives innovation and American competitiveness, and open-weight models are crucial for research outside of frontier labs. The United States needs a policy that meaningfully reduces catastrophic risk while preserving the benefits of AI models. If we wait for a major incident before taking action, it could cost millions of lives."],
          ] as RichParagraph[],
        },
        {
          heading: "Possible starting points",
          list: true,
          paragraphs: [
            [{ text: "Agentic Artificial Intelligence and Cyberattacks", url: "https://www.congress.gov/crs-product/IF13151" }, " (Congressional Research Service)"],
            [{ text: "Artificial Intelligence and Biosecurity Issues", url: "https://www.congress.gov/crs-product/IF13269" }, " (Congressional Research Service)"],
            [{ text: "Building a Defense-in-Depth Biosecurity Strategy for the AI Era", url: "https://www.rand.org/pubs/research_reports/RRA4999-1.html" }, " (RAND)"],
            [{ text: "Recursive Self-Improvement Signals: Security Implications", url: "https://labs.cloudsecurityalliance.org/research/ai-recursive-self-improvement-security-implications-v1-0-csa/" }, " (Cloud Security Alliance)"],
            [{ text: "Progress on provable inference for large language models", url: "https://www.anthropic.com/research/provable-inference" }, " (Anthropic)"],
            [{ text: "GLM-5.3 and the spread of advanced cyber capabilities", url: "https://www.anthropic.com/research/glm-5-3-and-the-spread-of-advanced-cyber-capabilities" }, " (Anthropic)"],
          ] as RichParagraph[],
        },
      ],
    },
  },
  deliverablesIntro: "You'll be judged on two deliverables:",
  deliverables: [
    {
      title: "2-page policy brief",
      who: "All teams",
      body: "Submit a PDF responding to the guiding question and task. You can submit as many times as you'd like; we'll judge your most recent submission as of 5:00 PM EST on November 20.",
    },
    {
      title: "5-minute presentation + 10-minute Q&A",
      who: "Top 6 teams",
      body: "Present in person at UVA during your judging slot. Slides are optional and don't need to be submitted.",
    },
  ],
  judging: {
    heading: "Judging",
    body: "The top 6 teams present in person on November 22 from 1–3 PM in the Lower West Oval Room of the Rotunda. Be ready to answer questions from the judges and defend your recommendation. If you can't make certain time slots, let us know before the brief deadline.",
  },

  teamsHeading: "Teams",
  teams: [
    "Teams are optional, and the max is 3 members.",
    "Prize money is split evenly between teammates unless you ask otherwise.",
  ],

  briefContentsHeading: "Your brief should include:",
  briefContents: [
    "Your policy recommendation",
    "Data or evidence relevant to the problem and your recommendation",
    "Projected implementation, impact, and challenges of your recommendation",
  ],
  graphicsNote: "Graphics are encouraged when useful!",
  formattingHeading: "Submission and formatting requirements",
  formattingWarning: "Briefs that don't follow these will receive a score of 0.",
  formatting: [
    "1-inch margins",
    "12-point Times New Roman",
    "1.15 line spacing",
    "2 pages max (citations don't count)",
  ],
  anonymity: {
    lead: "No identifying information.",
    body: "Leave names and other identifying details out of your brief. Including them will dock your written score.",
  },
  scoring: {
    heading: "Scoring",
    summary: "Your final score combines the judges' scores on your written brief and, for the top 6, your presentation and Q&A.",
    criteriaIntro: "Both the written brief and the presentation and Q&A will be judged on these three criteria:",
    criteria: [
      { title: "Feasibility (legal and technical)", body: "Does your proposal account for the realities of the technology and provide a workable path to implementation within the law and the Constitution?" },
      { title: "Effective", body: "Does your policy accomplish a clearly stated goal that addresses the competition's task?" },
      { title: "Original", body: "Does your proposal offer a unique approach or add something novel to existing proposals?" },
    ],
  },
  materialsHeading: "Helpful materials",
  resources: [
    { label: "What is a Policy Brief?", url: "https://writingcenter.unc.edu/tips-and-tools/policy-briefs/" as Copy },
    { label: "Example brief", url: "https://www.vaisi.org/research/policy_briefs/Logan%20Bradley,%20Ishan%20Ajwani%20-%20AI%20Safety%20Investigation%20Act%20Brief.pdf" as Copy },
  ],
  exampleWarning:
    "The example shows what an excellent brief looks like, but please don't copy it or its policy (that will result in disqualification). Your brief doesn't need to follow the same structure.",
  credit: "Credit to BASIS for some of these guidelines and materials.",

  submission: {
    intro:
      "Any team member can upload your brief with your team code. You can submit as many times as you'd like; we'll judge the most recent version as of 5:00 PM EST on November 20.",
    due: "Due 5:00 PM EST, November 20" as Copy,
  },

  questions: {
    heading: "Questions?",
    body: "Feel free to reach out in the GroupMe. We're always happy to help!",
  },
  groupmeUrl: "/go/groupme/2026-policy-hackathon",
};

export function allCalendarEvents(): CalendarEvent[] {
  return [
    ...hackathon.timeline.flatMap((item) => (item.calendar ? [item.calendar] : [])),
    hackathon.coworking.calendar,
  ];
}
