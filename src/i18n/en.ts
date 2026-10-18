import { formatUsd, pricing, type ServiceId, type TierId, getTier as tier } from "../config.ts";

const n = pricing.foundingClients;

export const en = {
  lang: "en",
  nav: {
    label: "Main",
    skip: "Skip to main content",
    work: "Client work",
    about: "About",
    contact: "Contact",
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
      websiteOnly: "Website and search pages come with the Profile + Website package.",
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
      placeholderTitle: "Case study coming soon",
      placeholderBody:
        "This space is for a real client result, published with the owner's permission.",
      allWork: "See all client work",
    },
    pricing: {
      h2: "Prices",
      intro: "Two packages. Pick the one that fits where your business is today.",
      foundingLabel: `For my first ${n} clients`,
      standardLabel: `After my first ${n} clients`,
      startingAt: "Starting at",
      setup: "setup",
      perMonth: "a month",
      includes: "Includes",
      notes: [
        "Final quote after a free check-up.",
        "No long contract. Month to month. Cancel anytime.",
      ],
      tiers: {
        profile: {
          name: "Google Profile",
          summary: "For businesses that don't need a website yet.",
        },
        website: {
          name: "Profile + Website",
          summary:
            "Everything in Google Profile, plus a simple website and pages for what people search.",
        },
      } satisfies Record<TierId, { name: string; summary: string }>,
    },
    about: {
      h2: "Who I am",
      body: "I'm Assane. I'm a backend engineer with a Master's in Data Engineering & AI. I built and grew an SEO-driven ecommerce store to about 800 pages with no ad spend. I speak French and English, and I build things that bring customers to small businesses.",
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
          a: `Google Profile starts at ${formatUsd(tier("profile").founding.setup)} setup and ${formatUsd(tier("profile").founding.monthly)} a month. Profile + Website starts at ${formatUsd(tier("website").founding.setup)} setup and ${formatUsd(tier("website").founding.monthly)} a month. Those are founding prices for my first ${n} clients. You get a final quote after the free check-up.`,
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
          a: "Oui. Je travaille en français et en anglais.",
          lang: "fr",
        },
      ] as { q: string; a: string; lang?: string }[],
    },
    contact: {
      h2: "Start with a free check-up",
      body: "Send me your business name on WhatsApp, or email me.",
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
  placeholder: "To be added",
};

export type Dictionary = typeof en;
