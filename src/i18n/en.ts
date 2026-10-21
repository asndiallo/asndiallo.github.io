import { pricing, type ServiceId, type TierId, getTier as tier } from "../config.ts";

const n = pricing.foundingClients;
/** Package names, defined once: pricing, the services note and the FAQ all use these. */
const names = { profile: "Get Found", website: "Get Booked" } satisfies Record<TierId, string>;
const money = (amount: number): string => `$${amount.toLocaleString("en-US")}`;

export const en = {
  lang: "en",
  money,
  /** Label separator; French puts a non-breaking space before the colon. */
  colon: ":",
  /** Wraps quoted words in the language's quotation marks. */
  quoted: (text: string) => `“${text}”`,
  newTab: "(opens in a new tab)",
  photoAlt: "Assane Diallo, wearing round glasses and a navy turtleneck",
  nav: {
    label: "Main",
    skip: "Skip to main content",
    work: "Client work",
    about: "About",
    contact: "Contact",
  },
  language: {
    /** Text of the link to the other language, written in that language. */
    switchTo: "Français",
    switchLabel: "Lire cette page en français",
    switchLang: "fr",
  },
  theme: {
    label: "Color theme",
    system: "System",
    light: "Light",
    dark: "Dark",
  },
  cta: {
    whatsapp: "Message me on WhatsApp",
    whatsappMessage: "Hi Assane, I'd like a free Google check-up for my business. My business is: ",
    booking: "Book a free 15-minute Google check-up",
    email: "Email me",
  },
  footer: {
    tagline: "Local SEO and Google Business Profile setup for African-owned businesses in the US.",
    engineering: "My software engineering work",
    privacy: "Privacy",
    social: "Follow on social media",
    languages: "English et français.",
  },
  home: {
    meta: {
      title: "Local SEO for African-owned businesses | Assane Diallo",
      description:
        "I help African-owned businesses in the US get found on Google and win more calls and bookings. Free 15-minute Google check-up. English & French.",
    },
    hero: {
      h1: "Get found on Google. Get more calls and bookings.",
      subhead:
        "I help African-owned businesses across the US show up when customers search nearby, and make it easy for them to call, book, or visit.",
      languages: "English et français.",
    },
    listing: {
      caption: "Illustration: how your business can look on Google when your profile is complete.",
      query: "braiding near me",
      name: "Your business name",
      category: "Hair braiding salon",
      open: "Open now",
      closes: "Closes 7 PM",
      prices: "Prices listed",
      reviews: "Recent reviews",
      actions: ["Call", "Book", "Directions"],
    },
    whoFor: {
      h2: "Who this is for",
      intro: "African-owned businesses in the US that serve customers nearby.",
      points: [
        "Salons, restaurants, shops, and services that get customers from their own city.",
        "Owners who are busy running the business and don't have time to learn Google.",
        "Anyone who wants more calls and bookings, not a complicated marketing plan.",
      ],
      verticalsLead: "Read more for your kind of business:",
      or: "or",
    },
    problem: {
      h2: "Your customers are searching. Are they finding you?",
      points: [
        'People search things like "braiding near me" or "African restaurant near me" and choose from the first few results.',
        "If your hours, phone number, or prices are wrong or missing on Google, they call someone else.",
        "If booking is hard, they give up.",
      ],
    },
    services: {
      h2: "What I set up for you",
      items: {
        profile: {
          title: "Google Business Profile, set up right.",
          body: "Correct categories, hours, services, photos, and a link to book or call.",
        },
        website: {
          title: "A simple, fast website.",
          body: "Your services, prices, story, map, and tap-to-call. If you already have a site, I improve it.",
        },
        searchPages: {
          title: "Pages for what people actually search.",
          body: "For example, the style or dish plus your city.",
        },
        reviews: {
          title: "An easy way to get reviews.",
          body: "A link and a short message you can send to happy customers.",
        },
        report: {
          title: "A monthly report in plain language.",
          body: "Calls, direction requests, what changed, and what's next.",
        },
      } satisfies Record<ServiceId, { title: string; body: string }>,
      websiteOnly: `Website and search pages come with the ${names.website} package.`,
      onlineShops: "Online shops: audits by request.",
      onlineShopsLink: "See the shop I'm working with now",
    },
    steps: {
      h2: "Three simple steps",
      items: [
        {
          title: "Free check-up (15 minutes).",
          body: "On WhatsApp or by phone, I look at how your business appears on Google and tell you the top three fixes. No obligation.",
        },
        {
          title: "Setup.",
          body: `I do the work. You approve your photos, prices, and wording. Usually ${pricing.setupWeeks} weeks.`,
        },
        {
          title: "Grow.",
          body: "Monthly updates and a short report so you can see what's working.",
        },
      ],
    },
    expect: {
      h2: "What to expect",
      body: "Some fixes, like correcting your hours or phone number, can help quickly. Moving up in Google usually takes a few months. I can't promise you'll be number one, and I won't. I'll show you what changed and what it did.",
    },
    proof: {
      h2: "My first clients",
      body: `I'm taking my first ${n} projects at a founding-client price. In return, you let me share the results.`,
      allWork: "See all client work",
    },
    pricing: {
      h2: "Prices",
      intro: "Two packages. Pick the one that fits where your business is today.",
      foundingLabel: `For my first ${n} clients`,
      standardLabel: `After my first ${n} clients`,
      startingAt: "Starting at",
      startingAtLower: "starting at",
      setup: "setup",
      perMonth: "a month",
      includes: "Includes",
      notes: [
        "Final quote after a free check-up.",
        "No long contract. Month to month. Cancel anytime.",
      ],
      tiers: {
        profile: {
          name: names.profile,
          tagline: "Google profile setup",
          summary: "For businesses that don't need a website yet.",
        },
        website: {
          name: names.website,
          tagline: "Google profile + website",
          summary: `Everything in ${names.profile}, plus a simple website and pages for what people search.`,
        },
      } satisfies Record<TierId, { name: string; tagline: string; summary: string }>,
    },
    about: {
      h2: "Who I am",
      body: "I'm Assane. I'm a software engineer with a Master's in Data Engineering & AI. I built and grew an SEO-driven ecommerce store to about 800 pages with no ad spend. I speak French and English, and I build things that bring customers to small businesses.",
      more: "More about me",
    },
    faq: {
      h2: "Questions owners ask",
      items: [
        {
          q: "Do I need a website?",
          a: "Not always. For many local businesses, a well-set-up Google profile is the first step. A simple site helps when you want to show prices, photos, and your story.",
        },
        {
          q: "How long until I see results?",
          a: "Some fixes help within days or weeks. Rankings usually take a few months. I'll tell you honestly what to expect for your business.",
        },
        {
          q: "Do I keep control of my accounts?",
          a: "Yes. Your Google profile and domain stay in your name. I'm added as a manager, and you can remove me anytime.",
        },
        {
          q: "What do you need from me?",
          a: "Your hours, price list, photos, and access to your Google profile. I'll guide you through it.",
        },
        {
          q: "Do you guarantee rankings?",
          a: "No. Nobody honestly can. I'll show you the changes and the numbers.",
        },
        {
          q: "What does it cost?",
          a: `${names.profile} (Google profile) starts at ${money(tier("profile").founding.setup)} setup and ${money(tier("profile").founding.monthly)} a month. ${names.website} (profile + website) starts at ${money(tier("website").founding.setup)} setup and ${money(tier("website").founding.monthly)} a month. Those are founding prices for my first ${n} clients. You get a final quote after the free check-up.`,
        },
        {
          q: "Is there a contract?",
          a: "No long contract. You pay month to month and can cancel anytime.",
        },
        {
          q: "Do you work with businesses outside your city?",
          a: "Yes. I work with businesses anywhere in the US. Most of the work can be done remotely, on WhatsApp, by phone, and by email.",
        },
        {
          q: "Parlez-vous français ?",
          a: "Oui. Je travaille en français et en anglais, et ce site existe aussi en français.",
          lang: "fr",
        },
      ] as { q: string; a: string; lang?: string }[],
    },
    contact: {
      h2: "Start with a free check-up",
      body: "Send me your business name on WhatsApp, or email me.",
      privacy: "How I handle your details",
    },
  },
  work: {
    meta: {
      title: "Client work: local SEO case studies | Assane Diallo",
      description:
        "Real projects for African-owned businesses: what I set up and what changed. Published with each owner's permission.",
    },
    h1: "Client work",
    lead: "Real projects, published with each owner's permission. I only share numbers the owner has approved.",
    empty: "I'm writing up my first client projects now. Ask me about them on WhatsApp.",
  },
  caseStudy: {
    title: (business: string, location: string) => `${business}, ${location}: what changed`,
    metaTitle: (business: string) => `${business}: case study | Assane Diallo`,
    readMore: (business: string) => `Read the ${business} case study`,
    visit: (business: string) => `Visit the ${business} website`,
    all: "All client work",
    facts: "Project facts",
    services: "Services",
    results: "Results",
    source: "Source",
    inProgress: "In progress",
    /** Shown under a translated quote. With two locales, the original is always the other one. */
    quoteTranslated: "Translated from French.",
    inProgressNote:
      "This project is in progress. I'll add results here once there's enough data and the owner approves them.",
    home: "Home",
  },
  vertical: {
    more: "See",
    prices: "prices",
    and: "and",
    how: "how it works",
    orMessage: ", or message me with your business name.",
  },
  aboutPage: {
    meta: {
      title: "About Assane Diallo | Local SEO in English & French",
      description:
        "I'm Assane. I help African-owned businesses in the US get found on Google. Software engineer. I work in English and French.",
    },
    h1: "About me",
    paragraphs: [
      "I'm Assane. I help African-owned businesses in the US get found on Google and get more calls and bookings.",
      "I'm a software engineer with a Master's in Data Engineering & AI. I built and grew an SEO-driven ecommerce store to about 800 pages with no ad spend.",
      "I work in English and French, mostly over WhatsApp, so we don't have to schedule long meetings.",
      "Your accounts stay in your name. I'll always tell you what I'm doing, why, and what it did.",
      "This started with family. My cousin does hair and my sister runs an online clothing store, and both do great work that not enough people can find. A wrong phone number or missing hours on Google can cost a small business real customers, and I like fixing that. I want the next person searching nearby to find you first.",
    ],
    engineering: "Looking for my software work?",
    engineeringLink: "See my engineering projects",
  },
  thanks: {
    meta: {
      title: "Message sent | Assane Diallo",
      description: "Thanks for your message. I'll reply soon, on WhatsApp or by email.",
    },
    h1: "Message sent",
    lead: "Thanks. I'll reply soon, on WhatsApp or by email, whichever you gave me.",
    back: "Back to the home page",
  },
  privacy: {
    meta: {
      title: "Privacy | Assane Diallo",
      description:
        "What this site collects (no cookies, no ads) and how I handle your details when you message me, email me or book a free check-up.",
    },
    h1: "Privacy",
    lead: "No cookies, no ads, no tracking across sites. When you contact me, I use your details only to reply and, if we work together, to do the work.",
    updated: "Last updated",
    site: {
      h2: "What this site collects",
      paragraphs: [
        "Nothing that identifies you. Cloudflare Web Analytics counts visits without cookies: the page viewed, the site you came from, your type of browser and device, and your country. It doesn't follow you to other sites.",
        "Cloudflare also hosts this site, so it handles the technical data every website needs to send you a page, such as your IP address.",
        "If you choose a language or a color theme, that choice is saved in your own browser and never sent to me.",
      ],
    },
    contact: {
      h2: "When you contact me or book a call",
      intro: "You decide what to share. Here is what reaches me, by channel:",
      whatsapp: {
        label: "WhatsApp",
        body: "your name, your number and what you write. The conversation goes through WhatsApp (Meta).",
      },
      booking: {
        label: "Booking a free check-up",
        body: "the details you enter on the Google Calendar booking page, such as your name and email.",
      },
      email: {
        label: "Email",
        body: "your address and your message. My mailbox is hosted by Zoho Mail.",
      },
      form: {
        label: "Contact form",
        body: "your name, your business, how to reach you and your message, delivered to me by a form service.",
      },
    },
    use: {
      h2: "How I use it",
      body: "Only to reply to you, prepare your free check-up and, if you hire me, do the work and bill for it. I don't sell your details, I don't share them for advertising, and I don't add you to a mailing list.",
    },
    keep: {
      h2: "How long I keep it",
      body: "While we're talking or working together. If we don't end up working together, I delete our messages and your details within 12 months of our last contact. For clients, I keep what the work and my tax records require.",
    },
    rights: {
      h2: "Seeing, correcting or deleting your details",
      body: "Ask me at any time what I have about you, or to correct or delete it.",
      whatsappMessage: "Hi Assane, about my details: ",
    },
    services: {
      h2: "Services involved",
      intro: "Each one has its own privacy policy:",
    },
  },
  form: {
    h3: "Or send a message here",
    name: "Your name",
    business: "Business name and city",
    reply: "WhatsApp number or email for my reply",
    message: "What would you like help with?",
    optional: "optional",
    submit: "Send message",
  },
};

export type Dictionary = typeof en;
