/** GitHub Pages has no server redirects; this is the static fallback (meta refresh + canonical). */
export const redirectPage = (to: string): Response =>
  new Response(
    `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Moved</title><meta name="robots" content="noindex"><link rel="canonical" href="${to}"><meta http-equiv="refresh" content="0; url=${to}"></head><body><p>This page moved to <a href="${to}">${to}</a>.</p></body></html>`,
    { headers: { "Content-Type": "text/html; charset=utf-8" } },
  );
