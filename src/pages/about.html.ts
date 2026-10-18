import type { APIRoute } from "astro";
import { redirectPage } from "../lib/redirect.ts";

// The old portfolio had /about.html until Nov 2024.
export const GET: APIRoute = () => redirectPage("/about/");
