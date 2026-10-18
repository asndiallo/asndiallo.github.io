/**
 * The only inline script on the site. It must run in <head>, blocking, so a saved theme applies
 * before first paint (no flash). astro.config.ts hashes this exact string into the CSP, so edit
 * it here and nowhere else. Every other script is bundled by Astro and allowed as 'self'.
 */
export const themeInitScript =
  'try{const t=localStorage.getItem("theme");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch{}';
