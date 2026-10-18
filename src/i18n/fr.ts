import { pricing, getTier as tier } from "../config.ts";

import type { Dictionary } from "./en.ts";

const n = pricing.foundingClients;
const nb = " "; // French typography: non-breaking space before ? ! : and currency
const money = (amount: number): string => `${amount.toLocaleString("fr-FR")}${nb}$`;

/** French copy for francophone business owners in the US. Same keys as en.ts, checked by the type. */
export const fr: Dictionary = {
  lang: "fr",
  money,
  colon: `${nb}:`,
  newTab: "(s'ouvre dans un nouvel onglet)",
  photoAlt: "Assane Diallo, avec des lunettes rondes et un col roulé bleu marine",
  nav: {
    label: "Principal",
    skip: "Aller au contenu principal",
    work: "Réalisations",
    about: "À propos",
    contact: "Contact",
  },
  language: {
    switchTo: "English",
    switchLabel: "Read this page in English",
    switchLang: "en",
  },
  theme: {
    label: "Thème",
    system: "Système",
    light: "Clair",
    dark: "Sombre",
  },
  cta: {
    whatsapp: "Écrivez-moi sur WhatsApp",
    whatsappMessage:
      "Bonjour Assane, j'aimerais un bilan Google gratuit pour mon entreprise. Mon entreprise : ",
    booking: "Réserver un bilan Google gratuit de 15 minutes",
    email: "M'écrire par e-mail",
  },
  footer: {
    tagline:
      "Référencement local et fiche d'établissement Google pour les entreprises africaines aux États-Unis.",
    engineering: "Mon travail d'ingénieur logiciel (en anglais)",
    languages: "English et français.",
  },
  home: {
    meta: {
      title: "SEO local pour entreprises africaines | Assane Diallo",
      description:
        "J'aide les entreprises africaines aux États-Unis à être trouvées sur Google et à recevoir plus d'appels et de réservations. Bilan Google gratuit.",
    },
    hero: {
      h1: "Soyez visible sur Google. Recevez plus d'appels et de réservations.",
      subhead:
        "J'aide les entreprises africaines aux États-Unis à apparaître quand les clients cherchent près d'eux, et à faciliter les appels, les réservations et les visites.",
      languages: "English et français.",
    },
    listing: {
      caption: `Illustration${nb}: à quoi peut ressembler votre entreprise sur Google quand votre fiche est complète.`,
      query: "braiding near me",
      name: "Le nom de votre entreprise",
      category: "Salon de tresses",
      open: "Ouvert",
      closes: `Ferme à 19${nb}h`,
      prices: "Prix affichés",
      reviews: "Avis récents",
      actions: ["Appeler", "Réserver", "Itinéraire"],
    },
    whoFor: {
      h2: `Pour qui${nb}?`,
      intro: "Les entreprises africaines aux États-Unis qui servent une clientèle locale.",
      points: [
        "Salons, restaurants, boutiques et services dont les clients viennent de leur ville.",
        "Les propriétaires trop occupés par leur activité pour apprendre Google.",
        "Ceux qui veulent plus d'appels et de réservations, pas un plan marketing compliqué.",
      ],
      verticalsLead: `En savoir plus pour votre type d'entreprise${nb}:`,
      or: "ou",
    },
    problem: {
      h2: `Vos clients cherchent. Est-ce qu'ils vous trouvent${nb}?`,
      points: [
        `Les gens tapent «${nb}braiding near me${nb}» ou «${nb}African restaurant near me${nb}» et choisissent parmi les premiers résultats.`,
        "Si vos horaires, votre numéro ou vos prix sont faux ou absents sur Google, ils appellent quelqu'un d'autre.",
        "Si réserver est compliqué, ils abandonnent.",
      ],
    },
    services: {
      h2: "Ce que je mets en place pour vous",
      items: {
        profile: {
          title: "Une fiche Google bien configurée.",
          body: "Les bonnes catégories, vos horaires, vos services, des photos et un lien pour réserver ou appeler.",
        },
        website: {
          title: "Un site simple et rapide.",
          body: "Vos services, vos prix, votre histoire, un plan et l'appel en un geste. Si vous avez déjà un site, je l'améliore.",
        },
        searchPages: {
          title: "Des pages pour ce que les gens cherchent vraiment.",
          body: "Par exemple, la coiffure ou le plat, suivi de votre ville.",
        },
        reviews: {
          title: "Un moyen simple d'obtenir des avis.",
          body: "Un lien et un court message à envoyer à vos clients satisfaits.",
        },
        report: {
          title: "Un rapport mensuel en langage clair.",
          body: "Appels, demandes d'itinéraire, ce qui a changé et la suite.",
        },
      },
      websiteOnly: "Le site et les pages de recherche sont inclus dans la formule Fiche + Site.",
      onlineShops: `Boutiques en ligne${nb}: audits sur demande.`,
      onlineShopsLink: "Voir la boutique avec laquelle je travaille en ce moment",
    },
    steps: {
      h2: "Trois étapes simples",
      items: [
        {
          title: "Bilan gratuit (15 minutes).",
          body: "Sur WhatsApp ou par téléphone, je regarde comment votre entreprise apparaît sur Google et je vous donne les trois corrections prioritaires. Sans engagement.",
        },
        {
          title: "Mise en place.",
          body: `Je fais le travail. Vous validez vos photos, vos prix et les textes. En général ${pricing.setupWeeks}${nb}semaines.`,
        },
        {
          title: "Croissance.",
          body: "Des mises à jour chaque mois et un court rapport pour voir ce qui marche.",
        },
      ],
    },
    expect: {
      h2: "À quoi vous attendre",
      body: "Certaines corrections, comme vos horaires ou votre numéro, peuvent aider rapidement. Monter dans Google prend en général quelques mois. Je ne peux pas vous promettre la première place, et je ne le ferai pas. Je vous montrerai ce qui a changé et ce que ça a donné.",
    },
    proof: {
      h2: "Mes premiers clients",
      body: `Je prends mes ${n} premiers projets à un tarif «${nb}client fondateur${nb}». En échange, vous me laissez partager les résultats.`,
      placeholderTitle: "Étude de cas à venir",
      placeholderBody:
        "Cet espace est réservé au résultat d'un vrai client, publié avec son accord.",
      placeholderTodo: "vraie étude de cas avec l'accord du client",
      allWork: "Voir toutes les réalisations",
    },
    pricing: {
      h2: "Tarifs",
      intro: "Deux formules. Choisissez celle qui correspond à votre entreprise aujourd'hui.",
      foundingLabel: `Pour mes ${n} premiers clients`,
      standardLabel: `Après mes ${n} premiers clients`,
      startingAt: "À partir de",
      startingAtLower: "à partir de",
      setup: "de mise en place",
      perMonth: "par mois",
      includes: "Inclus",
      notes: [
        "Devis final après un bilan gratuit.",
        "Pas d'engagement long. Paiement au mois. Résiliable à tout moment.",
      ],
      tiers: {
        profile: {
          name: "Fiche Google",
          summary: "Pour les entreprises qui n'ont pas encore besoin d'un site.",
        },
        website: {
          name: "Fiche + Site",
          summary:
            "Tout ce qu'inclut Fiche Google, plus un site simple et des pages pour ce que les gens cherchent.",
        },
      },
    },
    about: {
      h2: "Qui je suis",
      body: "Je m'appelle Assane. Je suis ingénieur logiciel, avec un master en Data Engineering et IA. J'ai créé et développé une boutique en ligne d'environ 800 pages grâce au référencement naturel, sans publicité payante. Je parle français et anglais, et je construis des outils qui amènent des clients aux petites entreprises.",
      more: "En savoir plus sur moi",
    },
    faq: {
      h2: "Les questions qu'on me pose",
      items: [
        {
          q: `Ai-je besoin d'un site${nb}?`,
          a: "Pas toujours. Pour beaucoup d'entreprises locales, une fiche Google bien configurée est la première étape. Un site simple aide quand vous voulez montrer vos prix, vos photos et votre histoire.",
        },
        {
          q: `En combien de temps verrai-je des résultats${nb}?`,
          a: "Certaines corrections aident en quelques jours ou semaines. Le classement prend en général quelques mois. Je vous dirai honnêtement à quoi vous attendre pour votre entreprise.",
        },
        {
          q: `Est-ce que je garde le contrôle de mes comptes${nb}?`,
          a: "Oui. Votre fiche Google et votre nom de domaine restent à votre nom. Je suis ajouté comme gestionnaire, et vous pouvez me retirer à tout moment.",
        },
        {
          q: `De quoi avez-vous besoin de ma part${nb}?`,
          a: "Vos horaires, votre liste de prix, des photos et l'accès à votre fiche Google. Je vous guide à chaque étape.",
        },
        {
          q: `Garantissez-vous le classement${nb}?`,
          a: "Non. Personne ne peut honnêtement le faire. Je vous montrerai les changements et les chiffres.",
        },
        {
          q: `Combien ça coûte${nb}?`,
          a: `La formule Fiche Google commence à ${money(tier("profile").founding.setup)} de mise en place et ${money(tier("profile").founding.monthly)} par mois. La formule Fiche + Site commence à ${money(tier("website").founding.setup)} de mise en place et ${money(tier("website").founding.monthly)} par mois. Ce sont les tarifs fondateurs pour mes ${n} premiers clients. Vous recevez un devis final après le bilan gratuit.`,
        },
        {
          q: `Y a-t-il un contrat${nb}?`,
          a: "Pas d'engagement long. Vous payez au mois et pouvez arrêter à tout moment.",
        },
        {
          q: `Travaillez-vous avec des entreprises hors de votre ville${nb}?`,
          a: "Oui. Je travaille avec des entreprises partout aux États-Unis. L'essentiel se fait à distance, sur WhatsApp, par téléphone et par e-mail.",
        },
        {
          q: "Do you speak English?",
          a: "Yes. I work in English and French, and this site is also in English.",
          lang: "en",
        },
      ],
    },
    contact: {
      h2: "Commencez par un bilan gratuit",
      body: "Envoyez-moi le nom de votre entreprise sur WhatsApp, ou écrivez-moi par e-mail.",
    },
  },
  work: {
    meta: {
      title: `Réalisations${nb}: études de cas SEO local | Assane Diallo`,
      description:
        "De vrais projets pour des entreprises africaines : ce que j'ai mis en place et ce qui a changé. Publiés avec l'accord de chaque propriétaire.",
    },
    h1: "Réalisations",
    lead: "De vrais projets, publiés avec l'accord de chaque propriétaire. Je ne partage que les chiffres qu'il a validés.",
    empty: "Je rédige mes premières études de cas. Posez-moi la question sur WhatsApp.",
  },
  caseStudy: {
    title: (business, location) => `${business}, ${location}${nb}: ce qui a changé`,
    metaTitle: (business) => `${business}${nb}: étude de cas | Assane Diallo`,
    readMore: (business) => `Lire l'étude de cas ${business}`,
    visit: (business) => `Visiter le site de ${business}`,
    all: "Toutes les réalisations",
    facts: "Le projet en bref",
    services: "Services",
    results: "Résultats",
    source: "Source",
    inProgress: "En cours",
    inProgressNote:
      "Ce projet est en cours. J'ajouterai les résultats ici quand il y aura assez de données et que le propriétaire les aura validés.",
    home: "Accueil",
  },
  vertical: {
    more: "Voir",
    prices: "les tarifs",
    and: "et",
    how: "le fonctionnement",
    orMessage: ", ou envoyez-moi le nom de votre entreprise.",
  },
  aboutPage: {
    meta: {
      title: "À propos d'Assane Diallo | SEO local en français",
      description:
        "Je m'appelle Assane. J'aide les entreprises africaines aux États-Unis à être trouvées sur Google. Ingénieur logiciel, je travaille en français et en anglais.",
    },
    h1: "À propos",
    paragraphs: [
      "Je m'appelle Assane. J'aide les entreprises africaines aux États-Unis à être trouvées sur Google et à recevoir plus d'appels et de réservations.",
      "Je suis ingénieur logiciel, avec un master en Data Engineering et IA. J'ai créé et développé une boutique en ligne d'environ 800 pages grâce au référencement naturel, sans publicité payante.",
      "Je travaille en français et en anglais, surtout sur WhatsApp, pour ne pas vous imposer de longues réunions.",
      "Vos comptes restent à votre nom. Je vous explique toujours ce que je fais, pourquoi, et ce que ça a donné.",
      "Tout a commencé en famille. Ma cousine est coiffeuse et ma sœur gère une boutique de vêtements en ligne : toutes les deux font un excellent travail que trop peu de gens parviennent à trouver. Un numéro de téléphone erroné ou des horaires manquants sur Google peuvent faire perdre de vrais clients à une petite entreprise, et j'aime résoudre ce genre de problème. Je veux que la prochaine personne qui cherche près de chez elle vous trouve en premier.",
    ],
    engineering: `Vous cherchez mon travail d'ingénieur${nb}?`,
    engineeringLink: "Voir mes projets (en anglais)",
  },
  thanks: {
    meta: {
      title: "Message envoyé | Assane Diallo",
      description: "Merci pour votre message. Je vous réponds vite, sur WhatsApp ou par e-mail.",
    },
    h1: "Message envoyé",
    lead: "Merci. Je vous réponds vite, sur WhatsApp ou par e-mail, selon ce que vous m'avez laissé.",
    back: "Retour à l'accueil",
  },
  form: {
    h3: "Ou envoyez un message ici",
    name: "Votre nom",
    business: "Nom de l'entreprise et ville",
    reply: "Numéro WhatsApp ou e-mail pour ma réponse",
    message: `Comment puis-je vous aider${nb}?`,
    optional: "facultatif",
    submit: "Envoyer le message",
  },
};
