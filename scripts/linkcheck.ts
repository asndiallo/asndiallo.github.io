/**
 * Link check on dist/. Skips links that can't be checked offline: mailto, WhatsApp, and our own
 * absolute URLs (canonical, OG, JSON-LD), which only resolve once the site is deployed.
 */
import { spawnSync } from "node:child_process";
import { SITE_URL } from "../src/config.ts";

const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const skip = `^(mailto:|https://wa\\.me|${escapeRegExp(SITE_URL)})`;
const { status } = spawnSync("linkinator", ["dist", "--recurse", "--skip", skip], {
  stdio: "inherit",
});
process.exit(status ?? 1);
