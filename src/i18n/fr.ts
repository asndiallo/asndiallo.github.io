import type { Dictionary } from "./en.ts";
import type { DeepPartial } from "./index.ts";

/**
 * French copy. Missing keys fall back to English, so add "fr" to publishedLocales
 * (src/i18n/locales.ts) only once every page section here is translated.
 */
export const fr: DeepPartial<Dictionary> = {
  lang: "fr",
  cta: { whatsapp: "Écrivez-moi sur WhatsApp" },
  home: {
    hero: {
      h1: "Soyez visible sur Google. Recevez plus d'appels et de réservations.",
      subhead:
        "J'aide les entreprises africaines aux États-Unis à apparaître quand les clients cherchent près d'eux, et à faciliter les appels, les réservations et les visites.",
    },
    about: {
      body: "Je m'appelle Assane. Je suis ingénieur backend. Je parle français et anglais, et j'aide les petites entreprises à être trouvées sur Google.",
    },
  },
};
