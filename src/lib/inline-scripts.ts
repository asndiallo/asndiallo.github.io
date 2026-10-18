import { defaultLocale, locales, staticRoutes } from "../i18n/locales.ts";

/**
 * The site's only inline scripts. Each must run in <head>, blocking, before first paint.
 * astro.config.ts hashes these exact strings into the CSP, so edit them here and nowhere else.
 * Every other script is bundled by Astro and allowed as 'self'.
 */

/** Applies a saved theme before first paint, so it never flashes. */
export const themeInitScript =
  'try{const t=localStorage.getItem("theme");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch{}';

/** Home page of every non-default locale, e.g. { fr: "/fr/" }. */
const otherHomes = Object.fromEntries(
  locales.filter((l) => l !== defaultLocale).map((l) => [l, staticRoutes.home[l]]),
);

/**
 * On the default-locale home page only: send the visitor to their language's home page.
 * A language picked with the header switch (localStorage "lang") wins; otherwise the device's
 * languages are tried in order. The default locale or an unsupported language stays put.
 */
export const languageRedirectScript = `try{var h=${JSON.stringify(otherHomes)},s=localStorage.getItem("lang"),l=s?[s]:navigator.languages||[navigator.language];for(var i=0;i<l.length;i++){var b=String(l[i]).slice(0,2).toLowerCase();if(b===${JSON.stringify(defaultLocale)})break;if(h[b]){location.replace(h[b]+location.search+location.hash);break}}}catch(e){}`;
