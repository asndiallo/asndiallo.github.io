/**
 * Lists every "[TODO" marker left in the built site. Always exits 0: placeholders warn, never fail.
 * In GitHub Actions each file also gets a ::warning annotation.
 */
import { readdir, readFile } from "node:fs/promises";
import { join, relative } from "node:path";

const DIST = "dist";
const MARKER = /\[TODO(?::\s*([^\]<]*))?\]/g;

async function* htmlFiles(dir: string): AsyncGenerator<string> {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* htmlFiles(path);
    else if (entry.name.endsWith(".html")) yield path;
  }
}

const decode = (text: string) =>
  text
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");

const found = new Map<string, string[]>();
for await (const file of htmlFiles(DIST)) {
  // Count visible text only: drop the data-todo attributes that repeat each label.
  const html = (await readFile(file, "utf8")).replace(/data-todo="[^"]*"/g, "");
  const labels = [...html.matchAll(MARKER)].map((m) => decode(m[1]?.trim() || "(no label)"));
  if (labels.length > 0) found.set(relative(DIST, file), [...new Set(labels)]);
}

const total = [...found.values()].reduce((sum, labels) => sum + labels.length, 0);
if (total === 0) {
  console.log("\n✓ No [TODO] markers left in dist/.");
} else {
  console.log(`\n⚠ ${total} unique [TODO] markers in ${found.size} pages (see TODO.md):`);
  for (const [file, labels] of found) {
    console.log(`  ${file}`);
    for (const label of labels) console.log(`    - ${label}`);
    if (process.env.GITHUB_ACTIONS) {
      console.log(`::warning file=${file},title=[TODO] placeholders::${labels.join(" | ")}`);
    }
  }
}
