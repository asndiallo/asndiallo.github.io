import type { APIRoute } from "astro";
import { SITE_URL } from "../config.ts";

/**
 * dist/CNAME, generated from SITE_URL. GitHub ignores it when deploying from a custom Actions
 * workflow (the custom domain lives in Settings → Pages), but it documents the domain and keeps
 * it if the site is ever published from a branch again.
 */
export const GET: APIRoute = () =>
  new Response(`${new URL(SITE_URL).hostname}\n`, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
