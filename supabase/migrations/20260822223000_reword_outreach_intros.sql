with outreach_rewrites (slug, old_pitch, new_pitch) as (
  values
    (
      'outreach-ailist',
      'If you are interested in how advanced AI can be made safe and beneficial, we would love to introduce you to the Virginia AI Security Initiative (VAISI). We are a UVA student community focused on reducing risks from advanced AI through technical work, policy, and interdisciplinary discussion.',
      'The Virginia AI Security Initiative (VAISI) is a UVA student organization focused on how advanced AI can be made safe and beneficial. We bring together students interested in reducing risks from advanced AI through technical work, policy, and interdisciplinary discussion.'
    ),
    (
      'outreach-computer-science',
      'If you are interested in questions like how we can evaluate, interpret, and control increasingly capable AI systems, we would love to introduce you to the Virginia AI Security Initiative (VAISI). We bring together UVA students interested in technical AI safety, AI governance, and the broader effects of advanced AI.',
      'The Virginia AI Security Initiative (VAISI) is a UVA student organization focused on reducing risks from increasingly capable AI systems. Our technical work explores how we can evaluate, interpret, and control advanced models, alongside questions in AI governance and the broader effects of AI.'
    ),
    (
      'outreach-batten-public-policy',
      'If you are interested in how governments and institutions should respond to rapid advances in AI, we would love to introduce you to the Virginia AI Security Initiative (VAISI). Our policy community explores questions involving frontier AI regulation, national security, international competition, corporate governance, and how policy can reduce risks from advanced AI.',
      'The Virginia AI Security Initiative (VAISI) is a UVA student organization focused on the policy challenges created by advanced AI. Our policy community explores frontier AI regulation, national security, international competition, corporate governance, and how governments and institutions can reduce risks from rapid advances in AI.'
    ),
    (
      'outreach-data-science',
      'If you are interested in understanding model behavior, evaluating increasingly capable AI systems, or making AI deployment safer and more reliable, we would love to introduce you to the Virginia AI Security Initiative (VAISI). We are a UVA community working on technical and policy approaches to reducing risks from advanced AI.',
      'The Virginia AI Security Initiative (VAISI) is a UVA student organization working on technical and policy approaches to reducing risks from advanced AI. Our work includes understanding model behavior, evaluating increasingly capable AI systems, and making AI deployment safer and more reliable.'
    ),
    (
      'outreach-ppl',
      'If you are interested in how political institutions should govern transformative technologies—and which values should guide those decisions—we would love to introduce you to the Virginia AI Security Initiative (VAISI). Questions about advanced AI sit at the intersection of political philosophy, law, institutional design, ethics, and public policy.',
      'The Virginia AI Security Initiative (VAISI) is a UVA student organization focused on the technical, political, and ethical challenges posed by advanced AI. Our work asks how political institutions should govern transformative technologies and which values should guide those decisions, drawing on political philosophy, law, institutional design, ethics, and public policy.'
    ),
    (
      'outreach-pst',
      'If you are interested in how transformative technologies reshape power, institutions, and society, we would love to introduce you to the Virginia AI Security Initiative (VAISI). Advanced AI raises questions about political authority, social change, human agency, and who should shape technologies with potentially global consequences.',
      'The Virginia AI Security Initiative (VAISI) is a UVA student organization focused on how advanced AI could reshape power, institutions, and society. We explore questions about political authority, social change, human agency, and who should shape technologies with potentially global consequences.'
    ),
    (
      'outreach-philosophy',
      'If you are interested in questions like whether AI systems could become conscious, have morally relevant experiences, or count as moral patients, we would love to introduce you to the Virginia AI Security Initiative (VAISI). Advanced AI also raises difficult questions about agency, values, personhood, decision-making, and our obligations to future beings.',
      'The Virginia AI Security Initiative (VAISI) is a UVA student organization focused on the technical and philosophical questions raised by advanced AI. These include whether AI systems could become conscious, have morally relevant experiences, or count as moral patients, as well as questions about agency, values, personhood, decision-making, and our obligations to future beings.'
    ),
    (
      'outreach-economics',
      'If you are interested in how advanced AI could affect economic growth, labor, automation, market concentration, or the distribution of wealth and power, we would love to introduce you to the Virginia AI Security Initiative (VAISI). These changes could be unusually large and fast, making good economic analysis and governance especially important.',
      'The Virginia AI Security Initiative (VAISI) is a UVA student organization focused on the challenges and risks posed by advanced AI. We explore how AI could affect economic growth, labor, automation, market concentration, and the distribution of wealth and power—changes that could be unusually large and fast, making good economic analysis and governance especially important.'
    ),
    (
      'outreach-politics-pre-law',
      'If you are interested in how law and political institutions should respond to advanced AI, we would love to introduce you to the Virginia AI Security Initiative (VAISI). AI raises urgent questions about regulation, legal accountability, national security, international competition, and the institutions needed to govern powerful technologies.',
      'The Virginia AI Security Initiative (VAISI) is a UVA student organization focused on how society should respond to the challenges posed by advanced AI. Our policy work examines regulation, legal accountability, national security, international competition, and the institutions needed to govern powerful technologies.'
    ),
    (
      'outreach-mathematics-statistics',
      'If you are interested in using mathematical and statistical thinking to understand advanced AI, we would love to introduce you to the Virginia AI Security Initiative (VAISI). AI safety draws on uncertainty, forecasting, model evaluation, interpretability, optimization, and reasoning about systems whose capabilities can be difficult to measure.',
      'The Virginia AI Security Initiative (VAISI) is a UVA student organization focused on understanding and reducing risks from advanced AI. Technical AI safety draws on mathematical and statistical thinking about uncertainty, forecasting, model evaluation, interpretability, optimization, and systems whose capabilities can be difficult to measure.'
    ),
    (
      'outreach-ece-cybersecurity',
      'If you are interested in securing increasingly capable AI systems, preventing misuse, or understanding the hardware and infrastructure behind frontier AI, we would love to introduce you to the Virginia AI Security Initiative (VAISI). AI safety needs people thinking about system security, control, robustness, compute, and real-world failure modes.',
      'The Virginia AI Security Initiative (VAISI) is a UVA student organization focused on making increasingly capable AI systems safe and secure. Our work includes preventing misuse, understanding the hardware and infrastructure behind frontier AI, and thinking about system security, control, robustness, compute, and real-world failure modes.'
    ),
    (
      'outreach-systems-engineering',
      'If you are interested in how we can understand and manage risks in complex, rapidly changing systems, we would love to introduce you to the Virginia AI Security Initiative (VAISI). Advanced AI creates difficult problems involving system design, uncertainty, decision-making, human-machine interaction, and failures that may propagate across institutions and infrastructure.',
      'The Virginia AI Security Initiative (VAISI) is a UVA student organization focused on understanding and managing risks from advanced AI. These systems create difficult problems involving system design, uncertainty, decision-making, human-machine interaction, and failures that may propagate across institutions and infrastructure.'
    ),
    (
      'outreach-cognitive-sciences',
      'If you are interested in intelligence, reasoning, agency, consciousness, or human interaction with AI, we would love to introduce you to the Virginia AI Security Initiative (VAISI). Advanced AI raises questions about how machine cognition may differ from human cognition, whether digital minds could have morally relevant experiences, and how people and institutions will respond to increasingly capable systems.',
      'The Virginia AI Security Initiative (VAISI) is a UVA student organization focused on the technical and societal questions raised by advanced AI. We explore intelligence, reasoning, agency, consciousness, and human interaction with AI—including how machine cognition may differ from human cognition, whether digital minds could have morally relevant experiences, and how people and institutions will respond to increasingly capable systems.'
    ),
    (
      'outreach-sts-science-policy',
      'If you are interested in how emerging technologies reshape society—and how public institutions can guide their development—we would love to introduce you to the Virginia AI Security Initiative (VAISI). Advanced AI raises questions about expertise, power, governance, public accountability, technological change, and how policy can keep pace with rapidly developing systems.',
      'The Virginia AI Security Initiative (VAISI) is a UVA student organization focused on how society can navigate the development of advanced AI. We explore how emerging technologies reshape society and how public institutions can guide them, including questions about expertise, power, governance, public accountability, and whether policy can keep pace with rapidly developing systems.'
    ),
    (
      'outreach-mcintire-entrepreneurship',
      'If you are interested in how advanced AI will reshape companies, industries, and entrepreneurship, we would love to introduce you to the Virginia AI Security Initiative (VAISI). The organizations building and deploying powerful AI systems will face important questions about innovation, incentives, corporate governance, accountability, and the responsible management of emerging risks.',
      'The Virginia AI Security Initiative (VAISI) is a UVA student organization focused on the opportunities and risks created by advanced AI. We explore how AI could reshape companies, industries, and entrepreneurship, as well as questions about innovation, incentives, corporate governance, accountability, and the responsible management of emerging risks.'
    ),
    (
      'outreach-physics',
      'If you are interested in applying rigorous technical thinking to one of the most important emerging challenges of our time, we would love to introduce you to the Virginia AI Security Initiative (VAISI). Understanding advanced AI requires careful modeling, reasoning under uncertainty, forecasting technological progress, and studying the behavior of complex systems.',
      'The Virginia AI Security Initiative (VAISI) is a UVA student organization focused on understanding and reducing risks from advanced AI. This work applies rigorous technical thinking to careful modeling, reasoning under uncertainty, forecasting technological progress, and studying the behavior of complex systems.'
    ),
    (
      'outreach-environment-sustainability',
      'If you are interested in how society can anticipate and manage the global effects of transformative technologies, we would love to introduce you to the Virginia AI Security Initiative (VAISI). Advanced AI may create far-reaching economic, political, energy, and infrastructure changes, making long-term thinking and careful management of systemic risks increasingly important.',
      'The Virginia AI Security Initiative (VAISI) is a UVA student organization focused on how society can anticipate and manage the effects of advanced AI. These systems may create far-reaching economic, political, energy, and infrastructure changes, making long-term thinking and careful management of global and systemic risks increasingly important.'
    )
)
update public.admin_emails as email
set body = replace(email.body, rewrite.old_pitch, rewrite.new_pitch)
from outreach_rewrites as rewrite
where email.slug = rewrite.slug
  and email.distribution_context = 'external_list'
  and position(rewrite.old_pitch in email.body) > 0;
