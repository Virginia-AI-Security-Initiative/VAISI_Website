import type {
  AdminEmailDistribution,
  AdminEmailStatus,
  AdminEmailStyleWeight,
} from '@/lib/admin/types';

export type AdminEmailSeed = {
  slug: string;
  subject: string | null;
  body: string;
  distribution_context: AdminEmailDistribution;
  audience: string;
  status: AdminEmailStatus;
  sent_date: string | null;
  style_weight: AdminEmailStyleWeight;
  source_notes: string | null;
};

const unsubscribeUrl = 'https://lists.virginia.edu/sympa/signoff/vaisi_announcements';

const historicalEmails: AdminEmailSeed[] = [
  {
    slug: 'general-body-reminder',
    subject: null,
    body: `Hello,

Reminder that the Virginia AI Security Initiative will be holding a general body meeting tonight at 6 PM in Monroe 110! Mellow Mushroom will be provided for all who RSVP. We would love to see you there!

Brief event description:
Intro to AI Safety (15-20 min): Brief presentation on what our mission is, and why we think it's important.
VAISI Background and Information (10-15 min): Brief discussion of our history, what we do, and what we are planning to do in the future.
Interactive Activity (15-20 min): We will play an interactive team forecasting game relevant to our mission.
Freeform Socialization: We will bring some social games (e.g. codenames, one night ultimate werewolf) and also answer any questions people have about us or our mission.

Thanks,
VAISI Officer Team

You're on this ListServ because you have recently engaged with our club. Feel free to reach out with any questions.
Click here to unsubscribe: ${unsubscribeUrl}`,
    distribution_context: 'announcement_list',
    audience: 'VAISI announcement list',
    status: 'sent',
    sent_date: null,
    style_weight: 'primary',
    source_notes: 'User-supplied historical email. Provided twice as samples 1 and 5; stored once.',
  },
  {
    slug: 'summer-reading-group-announcement',
    subject: null,
    body: `Hello everyone,

We are excited to announce a Virginia AI Security Initiative summer virtual reading group! We will be meeting once a week for about an hour, at a time TBA. We are aiming to start either next week or in two weeks. If you are interested in coming, please fill out this **short** [expression of interest form](https://docs.google.com/forms/d/e/1FAIpQLSeIkuXneQp8wKbjY5z7d6i0j97jUqo5Lnt0HB4RLtx2c6EDng/viewform?usp=dialog)! For those who fill out the form, you will be sent the meeting time and link at your preferred email sometime this weekend or next week.

This reading group will be open to all, so please feel free to join if you are interested in keeping up to date with AI safety and policy over the summer. No level of background knowledge necessary. In addition, we will not be keeping attendance, so you are welcome to pop into meetings whenever works with your personal and vacation schedules.

Let us know if you have any questions, and looking forward to seeing you all there!

Thanks,

Seth Lifland

President of Virginia AI Security Initiative`,
    distribution_context: 'announcement_list',
    audience: 'VAISI announcement list',
    status: 'sent',
    sent_date: null,
    style_weight: 'primary',
    source_notes: 'User-supplied historical email. Rich-text spacing artifacts were normalized.',
  },
  {
    slug: 'semester-news-roundup',
    subject: null,
    body: `Hello,

I hope everyone’s summer is going well! Here is some VAISI news for the upcoming semester.

1. We have opened our fellowship applications! We will be running two fellowships this upcoming semester, an [Intro to AI Safety Fellowship](https://docs.google.com/document/d/10HcHGxPJ5VpnWoK1sq2nQQ6N85vsy95vgF_T9XGw3Es/edit?tab=t.0) and an [AI Policy Fellowship](https://docs.google.com/document/d/10HcHGxPJ5VpnWoK1sq2nQQ6N85vsy95vgF_T9XGw3Es/edit?tab=t.uuornxg83lhk). The applications are due September 13, and you can [apply to one (or both) here](https://airtable.com/appM8XoHX2voW3LQe/pag7pdRcPx9uhaRnF/form). If you received deferred acceptance last semester, and are interested in partaking this semester, please reach out.
2. We are starting a membership system. We will take rolling [applications here](https://airtable.com/appM8XoHX2voW3LQe/pagzBI6YepuXbbfBr/form). We expect our strongest applicants to be people who have already completed one of our fellowships or have equivalent relevant experience. See more about membership [here](https://docs.google.com/document/d/13ZRCWm0E6YXyz6OJj8WSA3c9_660IdAeLH12WCMX-18/edit?usp=sharing). Some of the benefits include access to a member-only slack, as well as bi-weekly socials and weekly member meetings.
3. We are still running our summer reading group! [Fill out this expression of interest](https://docs.google.com/forms/d/e/1FAIpQLSeIkuXneQp8wKbjY5z7d6i0j97jUqo5Lnt0HB4RLtx2c6EDng/viewform?usp=dialog) if you would like to join (or just stay updated so you have the option to join later). We meet Mondays from 6-7PM EST over Zoom. Today, we will be discussing a new Anthropic blog and accompanying paper: [A global workspace in language models](https://www.anthropic.com/research/global-workspace). Next week, we will be discussing [AI 2040: Plan A](https://ai-2040.com/), a new scenario by the authors of AI 2027.

As always, feel free to reach out with any questions.

Thanks,

Seth Lifland

President of VAISI

[Chat with me](https://cal.com/seth-lifland)`,
    distribution_context: 'announcement_list',
    audience: 'VAISI announcement list',
    status: 'sent',
    sent_date: null,
    style_weight: 'primary',
    source_notes: 'User-supplied historical email. Obvious duplicated link-label transcription artifacts were corrected in this editable seed; the raw archive preserves them.',
  },
  {
    slug: 'open-general-body-announcement',
    subject: null,
    body: `Hi everyone!

VAISI is hosting an open gen bod meeting next Tuesday, April 14th at 6pm in Monroe 110. If you are curious about what we do, want to learn about AI Safety, or really like Mellow Mushroom, we'd love to see you there! We will introduce the AI Safety field, the history of VAISI and our plans for the future, as well as play some games.

Please RSVP here.

Best,
VAISI Exec

You've been added to this ListServ because you have recently engaged with our club. Feel free to reach out with any questions.
Click here to unsubscribe: ${unsubscribeUrl}`,
    distribution_context: 'announcement_list',
    audience: 'VAISI announcement list',
    status: 'sent',
    sent_date: null,
    style_weight: 'primary',
    source_notes: 'User-supplied historical email. The RSVP link and sent date were not provided.',
  },
  {
    slug: 'three-places-to-find-vaisi',
    subject: 'Three Ways to Find VAISI Next Week!',
    body: `Hello everyone,

There are three places you can find VAISI next week! Whether you have attended one of our events before or are still looking to learn more about what we do, we would love to see you at any of the following:

1. **Club Fair:** Monday, August 24 from 11 AM–3 PM. We will be at **table 59 on Peabody Lawn.** [See where to find us on the map here.](https://www.instagram.com/p/DcR23nRiSpy/?igsh=MWEzZGVhMHE1NjN3Yw%3D%3D)
2. **AI Fair:** Wednesday, August 26 from 3–6 PM in Ern Commons. Stop by our table to catch up with us and learn more about our plans for the semester! You can [RSVP here](https://docs.google.com/forms/d/e/1FAIpQLSc_D3s053QVjZ6HQcSa6hglI_pr_mOXrlP9lfZ5NvtZ_pu4Rw/viewform).
3. **Interest Meeting:** Wednesday, August 26 at 6:30 PM in Monroe 130. We will introduce our mission, discuss ways to get more involved with VAISI, and stay afterward to chat and answer questions. Pizza will be served! Please [RSVP here](https://airtable.com/appM8XoHX2voW3LQe/pag8klHsnJ1stf23q/form).

Feel free to reach out with any questions, and we hope to see you next week!

Thanks,
VAISI Officer Team

Click here to unsubscribe: ${unsubscribeUrl}`,
    distribution_context: 'announcement_list',
    audience: 'Previously engaged VAISI announcement-list subscribers',
    status: 'sent',
    sent_date: '2026-08-21',
    style_weight: 'primary',
    source_notes: 'Confirmed sent by the user via screenshot. The subject was not visible and is retained from the preceding draft.',
  },
];

const sharedLogistics = `There are three places you can find us next week:

1. **Club Fair:** Monday, August 24 from 11 AM–3 PM at **table 59 on Peabody Lawn**. [Find us on the map.](https://www.instagram.com/p/DcR23nRiSpy/?igsh=MWEzZGVhMHE1NjN3Yw%3D%3D)
2. **AI Fair:** Wednesday, August 26 from 3–6 PM in Ern Commons. [RSVP here.](https://docs.google.com/forms/d/e/1FAIpQLSc_D3s053QVjZ6HQcSa6hglI_pr_mOXrlP9lfZ5NvtZ_pu4Rw/viewform)
3. **Interest Meeting:** Wednesday, August 26 at 6:30 PM in Monroe 130. Pizza will be served! [RSVP here.](https://airtable.com/appM8XoHX2voW3LQe/pag8klHsnJ1stf23q/form)`;

const outreachDefinitions: Array<{
  slug: string;
  audience: string;
  subject: string;
  pitch: string;
  programs: string;
}> = [
  {
    slug: 'outreach-ailist',
    audience: 'AIlist',
    subject: 'Get Involved with AI Safety at UVA This Fall',
    pitch: 'The Virginia AI Security Initiative (VAISI) is a UVA student organization focused on how advanced AI can be made safe and beneficial. We bring together students interested in reducing risks from advanced AI through technical work, policy, and interdisciplinary discussion.',
    programs: 'This fall, we are running Intro to AI Safety and AI Policy fellowships, hosting events, and providing opportunities to engage with research and a community of students interested in the future of AI. No prior AI safety experience is necessary.',
  },
  {
    slug: 'outreach-computer-science',
    audience: 'Computer Science',
    subject: 'Explore Technical AI Safety with VAISI',
    pitch: 'The Virginia AI Security Initiative (VAISI) is a UVA student organization focused on reducing risks from increasingly capable AI systems. Our technical work explores how we can evaluate, interpret, and control advanced models, alongside questions in AI governance and the broader effects of AI.',
    programs: 'This fall, we are running an Intro to AI Safety Fellowship alongside an AI Policy Fellowship, hosting technical discussions and events, and helping students find ways to engage with AI safety research. You do not need prior AI safety experience to get involved.',
  },
  {
    slug: 'outreach-batten-public-policy',
    audience: 'Batten / Public Policy',
    subject: 'Interested in AI Policy? Get Involved with VAISI',
    pitch: 'The Virginia AI Security Initiative (VAISI) is a UVA student organization focused on the policy challenges created by advanced AI. Our policy community explores frontier AI regulation, national security, international competition, corporate governance, and how governments and institutions can reduce risks from rapid advances in AI.',
    programs: 'This fall, we are running an AI Policy Fellowship as well as an Intro to AI Safety Fellowship, hosting events, and supporting students interested in AI governance research and careers. No technical background is required.',
  },
  {
    slug: 'outreach-data-science',
    audience: 'Data Science',
    subject: 'AI Safety Opportunities for Data Science Students',
    pitch: 'The Virginia AI Security Initiative (VAISI) is a UVA student organization working on technical and policy approaches to reducing risks from advanced AI. Our work includes understanding model behavior, evaluating increasingly capable AI systems, and making AI deployment safer and more reliable.',
    programs: 'This fall, we are running Intro to AI Safety and AI Policy fellowships, hosting events and technical discussions, and helping students engage with relevant research. No prior AI safety background is necessary.',
  },
  {
    slug: 'outreach-ppl',
    audience: 'Political Philosophy, Policy & Law (PPL)',
    subject: 'Explore the Ethical and Political Questions Raised by Advanced AI',
    pitch: 'The Virginia AI Security Initiative (VAISI) is a UVA student organization focused on the technical, political, and ethical challenges posed by advanced AI. Our work asks how political institutions should govern transformative technologies and which values should guide those decisions, drawing on political philosophy, law, institutional design, ethics, and public policy.',
    programs: 'VAISI brings together UVA students to study these questions through an AI Policy Fellowship, an Intro to AI Safety Fellowship, events, research, and interdisciplinary discussion. No technical background is required.',
  },
  {
    slug: 'outreach-pst',
    audience: 'Political & Social Thought (PST)',
    subject: 'How Will Advanced AI Reshape Society? Explore It with VAISI',
    pitch: 'The Virginia AI Security Initiative (VAISI) is a UVA student organization focused on how advanced AI could reshape power, institutions, and society. We explore questions about political authority, social change, human agency, and who should shape technologies with potentially global consequences.',
    programs: 'VAISI is a UVA community exploring these issues through an AI Policy Fellowship, an Intro to AI Safety Fellowship, events, research, and interdisciplinary discussion. No technical background is required.',
  },
  {
    slug: 'outreach-philosophy',
    audience: 'Philosophy',
    subject: 'Could AI Systems Become Conscious or Moral Patients?',
    pitch: 'The Virginia AI Security Initiative (VAISI) is a UVA student organization focused on the technical and philosophical questions raised by advanced AI. These include whether AI systems could become conscious, have morally relevant experiences, or count as moral patients, as well as questions about agency, values, personhood, decision-making, and our obligations to future beings.',
    programs: 'VAISI brings together UVA students to explore the technical, philosophical, and policy challenges posed by advanced AI. This fall, we are running Intro to AI Safety and AI Policy fellowships alongside events, research, and interdisciplinary discussions. No technical background is required.',
  },
  {
    slug: 'outreach-economics',
    audience: 'Economics',
    subject: 'Explore How Advanced AI Could Transform the Economy',
    pitch: 'The Virginia AI Security Initiative (VAISI) is a UVA student organization focused on the challenges and risks posed by advanced AI. We explore how AI could affect economic growth, labor, automation, market concentration, and the distribution of wealth and power—changes that could be unusually large and fast, making good economic analysis and governance especially important.',
    programs: 'VAISI is a UVA community exploring technical and policy approaches to reducing risks from advanced AI. This fall, we are running Intro to AI Safety and AI Policy fellowships, hosting events, and supporting student research and discussion. No technical background is required.',
  },
  {
    slug: 'outreach-politics-pre-law',
    audience: 'Politics / Pre-Law',
    subject: 'Interested in AI Governance, Regulation, or Law?',
    pitch: 'The Virginia AI Security Initiative (VAISI) is a UVA student organization focused on how society should respond to the challenges posed by advanced AI. Our policy work examines regulation, legal accountability, national security, international competition, and the institutions needed to govern powerful technologies.',
    programs: 'This fall, VAISI is running an AI Policy Fellowship as well as an Intro to AI Safety Fellowship, hosting events, and supporting students interested in governance research and careers. No technical background is required.',
  },
  {
    slug: 'outreach-mathematics-statistics',
    audience: 'Mathematics / Statistics',
    subject: 'Apply Mathematical and Statistical Thinking to AI Safety',
    pitch: 'The Virginia AI Security Initiative (VAISI) is a UVA student organization focused on understanding and reducing risks from advanced AI. Technical AI safety draws on mathematical and statistical thinking about uncertainty, forecasting, model evaluation, interpretability, optimization, and systems whose capabilities can be difficult to measure.',
    programs: 'VAISI is a UVA community exploring technical and policy approaches to reducing risks from advanced AI. This fall, we are running Intro to AI Safety and AI Policy fellowships, hosting events and technical discussions, and helping students engage with research. No prior AI safety background is necessary.',
  },
  {
    slug: 'outreach-ece-cybersecurity',
    audience: 'ECE / Computer Engineering / Cybersecurity',
    subject: 'Explore AI Security, Control, and Resilient Systems with VAISI',
    pitch: 'The Virginia AI Security Initiative (VAISI) is a UVA student organization focused on making increasingly capable AI systems safe and secure. Our work includes preventing misuse, understanding the hardware and infrastructure behind frontier AI, and thinking about system security, control, robustness, compute, and real-world failure modes.',
    programs: 'VAISI is a UVA community exploring technical and policy approaches to reducing risks from advanced AI. This fall, we are running Intro to AI Safety and AI Policy fellowships, hosting events and technical discussions, and helping students engage with research. No prior AI safety background is necessary.',
  },
  {
    slug: 'outreach-systems-engineering',
    audience: 'Systems Engineering',
    subject: 'Complex Systems, Risk Analysis, and the Future of AI',
    pitch: 'The Virginia AI Security Initiative (VAISI) is a UVA student organization focused on understanding and managing risks from advanced AI. These systems create difficult problems involving system design, uncertainty, decision-making, human-machine interaction, and failures that may propagate across institutions and infrastructure.',
    programs: 'VAISI is a UVA community exploring technical and policy approaches to reducing risks from advanced AI. This fall, we are running Intro to AI Safety and AI Policy fellowships, hosting events, and supporting student research and discussion. No prior AI safety background is necessary.',
  },
  {
    slug: 'outreach-cognitive-sciences',
    audience: 'Cognitive Science / Psychology / Neuroscience',
    subject: 'What Can AI Teach Us About Intelligence—and What Risks Could It Create?',
    pitch: 'The Virginia AI Security Initiative (VAISI) is a UVA student organization focused on the technical and societal questions raised by advanced AI. We explore intelligence, reasoning, agency, consciousness, and human interaction with AI—including how machine cognition may differ from human cognition, whether digital minds could have morally relevant experiences, and how people and institutions will respond to increasingly capable systems.',
    programs: 'VAISI brings together UVA students to explore the technical, philosophical, and policy challenges posed by advanced AI. This fall, we are running Intro to AI Safety and AI Policy fellowships alongside events, research, and interdisciplinary discussions. No technical background is required.',
  },
  {
    slug: 'outreach-sts-science-policy',
    audience: 'STS / Science Policy',
    subject: 'Help Shape How Society Responds to Advanced AI',
    pitch: 'The Virginia AI Security Initiative (VAISI) is a UVA student organization focused on how society can navigate the development of advanced AI. We explore how emerging technologies reshape society and how public institutions can guide them, including questions about expertise, power, governance, public accountability, and whether policy can keep pace with rapidly developing systems.',
    programs: 'VAISI is a UVA community exploring these issues through an AI Policy Fellowship, an Intro to AI Safety Fellowship, events, research, and interdisciplinary discussion. No technical background is required.',
  },
  {
    slug: 'outreach-mcintire-entrepreneurship',
    audience: 'McIntire / Entrepreneurship / Engineering Business',
    subject: 'AI Innovation, Industry, and Responsible Governance',
    pitch: 'The Virginia AI Security Initiative (VAISI) is a UVA student organization focused on the opportunities and risks created by advanced AI. We explore how AI could reshape companies, industries, and entrepreneurship, as well as questions about innovation, incentives, corporate governance, accountability, and the responsible management of emerging risks.',
    programs: 'VAISI is a UVA community exploring technical and policy approaches to reducing risks from advanced AI. This fall, we are running Intro to AI Safety and AI Policy fellowships, hosting events, and supporting student research and career exploration. No technical background is required.',
  },
  {
    slug: 'outreach-physics',
    audience: 'Physics',
    subject: 'Technical Opportunities in AI Safety at UVA',
    pitch: 'The Virginia AI Security Initiative (VAISI) is a UVA student organization focused on understanding and reducing risks from advanced AI. This work applies rigorous technical thinking to careful modeling, reasoning under uncertainty, forecasting technological progress, and studying the behavior of complex systems.',
    programs: 'VAISI is a UVA community exploring technical and policy approaches to reducing risks from advanced AI. This fall, we are running Intro to AI Safety and AI Policy fellowships, hosting events and technical discussions, and helping students engage with research. No prior AI or machine learning background is necessary.',
  },
  {
    slug: 'outreach-environment-sustainability',
    audience: 'Environmental Science / Sustainability',
    subject: 'Governing the Systemic Impacts of Advanced AI',
    pitch: 'The Virginia AI Security Initiative (VAISI) is a UVA student organization focused on how society can anticipate and manage the effects of advanced AI. These systems may create far-reaching economic, political, energy, and infrastructure changes, making long-term thinking and careful management of global and systemic risks increasingly important.',
    programs: 'VAISI is a UVA community exploring technical and policy approaches to reducing risks from advanced AI. This fall, we are running Intro to AI Safety and AI Policy fellowships, hosting events, and supporting student research and discussion. No technical background is required.',
  },
];

const outreachEmails: AdminEmailSeed[] = outreachDefinitions.map((definition) => ({
  slug: definition.slug,
  subject: definition.subject,
  body: `Hello everyone,

${definition.pitch}

${definition.programs} Learn more at [vaisi.org](https://vaisi.org).

${sharedLogistics}

Feel free to reach out with any questions. We hope to see you there!

Thanks,
VAISI Officer Team`,
  distribution_context: 'external_list',
  audience: definition.audience,
  status: 'draft',
  sent_date: null,
  style_weight: 'excluded',
  source_notes: 'External-list draft generated August 22, 2026. Excluded from announcement-list style calibration unless explicitly reclassified.',
}));

export const adminEmailSeeds: AdminEmailSeed[] = [
  ...historicalEmails,
  ...outreachEmails,
];
