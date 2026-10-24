// Questions and calls to action for each page's FAQ section. Answers may hold simple links
// (trusted HTML, written here); the FAQPage structured data gets them as plain text.

export interface Faq {
  q: string;
  a: string;
}

export interface FaqSection {
  title: string;
  intro?: string;
  faqs: Faq[];
  cta: { title: string; text: string };
}

const link = (href: string, label: string) => `<a class="link" href="${href}">${label}</a>`;

export const homeFaqs: FaqSection = {
  title: 'Questions people ask before we talk',
  intro: 'The longer answers, so you know what working with me looks like before you book anything.',
  faqs: [
    {
      q: 'What kind of work do you take on?',
      a: `Two kinds. Full-time roles, remote or with relocation, and freelance projects. On the project side
        that usually means one of these: building a web app from an idea to production, moving an app off an
        old framework version, making a slow site fast and search-friendly, adding English and Arabic (RTL)
        support, replacing manual reporting with dashboards, or tracking down bugs that keep reaching
        production. I also work on machine learning for text, like the ${link('/projects/medical-ner', 'medical NER model')}
        that turns clinical notes into structured data.`,
    },
    {
      q: 'Are you available for full-time roles, freelance, or both?',
      a: `Both. I'm a software engineer at IOMechs and co-founder of ${link('/projects/calyndrs', 'Calyndrs')},
        and I'm open to remote roles anywhere, relocating for the right role, and freelance projects. Tell me
        your timeline when you get in touch and I'll be straight with you about whether I can meet it.`,
    },
    {
      q: 'What do you build with?',
      a: `On the frontend: TypeScript, React, Next.js and Angular, with Tailwind CSS, Angular Material, Redux
        Toolkit and TanStack Query. On the backend: Node.js, Nest.js and Express, with MongoDB, PostgreSQL,
        MySQL or Firebase. For testing: Vitest, React Testing Library, Playwright and MSW. For machine learning:
        Python and Hugging Face. If your stack is close to this, I can be useful quickly; the full list is on
        the ${link('/about', 'About page')}.`,
    },
    {
      q: 'Can you upgrade our existing app instead of rewriting it?',
      a: `Yes, and it's usually the better call. I led Estenarh's move from Next.js 14 to 16 and its Admin
        platform's move from Angular 14 to 17, through structured refactoring and all the way to production,
        while the product stayed live. A rewrite throws away years of fixed edge cases; an upgrade keeps them.
        ${link('/projects/estenarh', 'See the Estenarh project')}.`,
    },
    {
      q: 'Can you make our site faster and easier to find on search?',
      a: `I led the performance and technical SEO work on Estenarh's website: Lighthouse went from 70 to 99 on
        desktop and from the 50s to the 80s on mobile, and the bundle shrank from 16 MB to under 5 MB. I won't
        promise you a ranking, because nobody honest can, but I can fix what's holding your site back:
        slow pages, heavy bundles, missing metadata and pages search engines can't read properly.`,
    },
    {
      q: 'Do you build Arabic and right-to-left interfaces?',
      a: `Yes. I built the English and Arabic interface for ${link('/projects/azm', 'AZM')}, with layouts that
        flip cleanly between left-to-right and right-to-left, and built bilingual interfaces across Estenarh's
        customer-facing and Admin platforms. Getting RTL right means more than flipping text direction: icons,
        spacing, tables and forms all need to mirror properly.`,
    },
    {
      q: 'Do you write tests, or just features?',
      a: `Both. On ${link('/projects/calyndrs', 'Calyndrs')} I set up Vitest unit tests for authentication and
        event CRUD flows, and React Testing Library and Playwright tests for end-to-end flows, with MSW mocking
        the APIs. At IOMechs I work with the backend and QA teams to catch regressions before they reach
        production.`,
    },
    {
      q: 'How do you work across time zones?',
      a: `I'm in Karachi, on UTC+5. That overlaps almost all of the working day in the Gulf, and my afternoon is
        Europe's morning. For teams further west, tell me your hours on the call and we'll find the overlap.
        Messages get a reply within a day.`,
    },
    {
      q: 'How do we get started?',
      a: `Book a 30-minute intro call, or send a message through the ${link('/contact', 'contact page')}. Tell me
        what you're building or what's broken, your timeline, and whether it's a role or a project. After the
        call you'll know whether I'm the right fit, and what the next step would be.`,
    },
  ],
  cta: {
    title: 'Still deciding? Talk it through in 30 minutes.',
    text: "Tell me what you're building or what's broken. You'll leave the call knowing whether I'm the right person for it.",
  },
};

export const workFaqs: FaqSection = {
  title: 'About this work',
  faqs: [
    {
      q: 'Which of these did you build yourself?',
      a: `Propertease and Medical NER are solo projects. Calyndrs, which I co-founded, and InsightEdu were team
        efforts that I was part of from the first idea to launch. Estenarh, AZM and NowCut are IOMechs products
        built by a team. Each project page lists exactly what my part was.`,
    },
    {
      q: 'Can I see the code?',
      a: `${link('https://github.com/zunain-ali-azam/Propertease', 'Propertease')} and
        ${link('https://github.com/zunain-ali-azam/Medical-Data-NER-with-BERT', 'Medical NER')} are public on
        GitHub. The IOMechs platforms are company code, so I can't share it, but I'm happy to walk you through
        how I built my parts on a call.`,
    },
    {
      q: 'Can you build something like one of these for us?',
      a: `Probably, if it's a web app, a dashboard, a marketplace or a text-to-data model. Tell me which project
        is closest to what you need and what's different about yours.`,
    },
  ],
  cta: {
    title: 'Seen something close to what you need?',
    text: 'Book a call and tell me which project it reminds you of. We can work out what yours needs from there.',
  },
};

export const experienceFaqs: FaqSection = {
  title: 'Questions from hiring teams',
  faqs: [
    {
      q: 'What are you doing right now?',
      a: `I've been a software engineer at IOMechs since February 2025, working on Estenarh, AZM and NowCut, and
        I co-founded ${link('/projects/calyndrs', 'Calyndrs')} in April 2026.`,
    },
    {
      q: 'Are you open to new roles?',
      a: 'Yes: remote roles anywhere, and relocation for the right role. Notice period and start dates are easiest to cover on a call.',
    },
    {
      q: 'Have you led work, or mostly contributed?',
      a: `Both. I led Estenarh's Next.js 14 to 16 and Angular 14 to 17 migrations and its website's performance
        and SEO work, and as a co-founder I've been part of Calyndrs from the first idea to launch, on product decisions as well as code. On
        team projects I own features end to end, like NowCut's promo codes, commission tiers and role-based access.`,
    },
    {
      q: 'What is your education?',
      a: 'A B.S. in Computer Science from the University of Karachi, 2021 to 2024.',
    },
  ],
  cta: {
    title: 'Hiring? Let’s talk about the role.',
    text: "Share what the team is building and what you need from the hire. I'll tell you honestly where I'd fit.",
  },
};

export const aboutFaqs: FaqSection = {
  title: 'A few more things about me',
  faqs: [
    {
      q: 'Where are you based, and will you relocate?',
      a: "Karachi, Pakistan, on UTC+5. I'm open to remote work and to relocating for the right role.",
    },
    {
      q: 'What is Calyndrs?',
      a: `An event management and discovery platform I co-founded in 2026. Organizers create, promote and analyze
        events, venues and event companies plug into the same workflows, and attendees find and book.
        ${link('/projects/calyndrs', 'More on Calyndrs')}.`,
    },
    {
      q: 'What do you do outside of work?',
      a: `I volunteer with the B17 Fund Initiative, running mock interviews and mentoring students. At university
        I was the public relations lead of the Google Developers Student Club, organising workshops for 250+ students.`,
    },
  ],
  cta: {
    title: 'Want to work together?',
    text: "A 30-minute call is the quickest way to find out if we'd work well together.",
  },
};

export const writingFaqs: FaqSection = {
  title: 'About the writing',
  faqs: [
    {
      q: 'Where else do you write?',
      a: `On ${link('https://zunainaliazam.medium.com', 'Medium')}.`,
    },
    {
      q: 'Can I suggest a topic?',
      a: `Yes. If there's something about framework migrations, testing or performance you'd like me to cover,
        send it through the ${link('/contact', 'contact page')}.`,
    },
  ],
  cta: {
    title: 'Have a question a post didn’t answer?',
    text: 'Ask me directly. If it’s about your own project, a short call is often faster than a long email.',
  },
};

export const resumeFaqs: FaqSection = {
  title: 'About the resume',
  faqs: [
    {
      q: 'Is there a web version?',
      a: `Yes. My ${link('/experience', 'experience')} and ${link('/projects', 'work')} pages cover the same
        ground in more detail, with what I built on each project.`,
    },
    {
      q: 'How do I reach you about a role?',
      a: `Send a message through the ${link('/contact', 'contact page')} or book a call. I reply within a day.`,
    },
  ],
  cta: {
    title: 'Like what you see? Let’s set up a call.',
    text: "Thirty minutes to talk through the role and my experience, and any questions the resume didn't answer.",
  },
};

export const contactFaqs: FaqSection = {
  title: 'Before you write',
  faqs: [
    {
      q: 'How quickly will you reply?',
      a: 'Within a day, usually sooner during Karachi working hours (UTC+5).',
    },
    {
      q: 'Should I send a message or book a call?',
      a: "A message works well when you have a clear brief or a role to share. A call is better when you're still working out what you need.",
    },
    {
      q: 'What should I include?',
      a: "What you're building or what's broken, your timeline, whether it's a role or a project, and a link if there's something I can look at.",
    },
    {
      q: 'What happens on the call?',
      a: "It's a 30-minute intro. You tell me about the role or project, I ask questions, and we agree on whether there's a next step. No preparation needed.",
    },
  ],
  // The booking calendar is right above on this page, so the call to action points back up to it
  cta: {
    title: 'Ready when you are.',
    text: 'Pick a time in the calendar above, or send a message with the form.',
  },
};
