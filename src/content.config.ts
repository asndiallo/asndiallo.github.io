import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const work = defineCollection({
  loader: glob({ pattern: "**/[^_]*.md", base: "./src/content/work" }),
  schema: ({ image }) =>
    z
      .object({
        /** URL segment for this locale; defaults to the file name. (Not `slug`: Astro uses that as the id.) */
        urlSlug: z.string().optional(),
        business: z.string(),
        /** City and state, or "Online shop". */
        location: z.string(),
        vertical: z.enum(["braiding-salons", "restaurants", "online-shop", "other"]),
        status: z.enum(["complete", "in-progress"]).default("complete"),
        /** Show in the home page "My first clients" cards (local SEO work only). */
        homepage: z.boolean().default(true),
        /** Card + meta description. Plain language, no numbers that the owner hasn't approved. */
        summary: z.string().max(155),
        /**
         * The headline result in one short sentence, shown on the matching vertical page.
         * Word for word from `summary`, so it's already approved; the build checks.
         */
        highlight: z.string().optional(),
        /** The owner agreed to be named and to have this page published. Required to publish. */
        consent: z.literal(true),
        /** Any personal relationship with the client, shown on the card and the page. */
        disclosure: z.string().optional(),
        website: z.url().optional(),
        services: z.array(z.string()).min(1),
        /** Only numbers the owner approved, each with where it came from. */
        results: z
          .array(z.object({ label: z.string(), value: z.string(), source: z.string() }))
          .default([]),
        /** The owner's words, published with their OK on the exact wording (and on any translation). */
        quote: z
          .object({
            text: z.string(),
            /**
             * Shorter cut of `text` for the home page. Words may only be left out, marked "[…]";
             * the build fails if any other part isn't word for word from `text`.
             */
            excerpt: z.string().optional(),
            author: z.string(),
            /** The text is a translation from the other language; the page says so. */
            translated: z.boolean().default(false),
          })
          .refine(
            (q) =>
              !q.excerpt || q.excerpt.split("[…]").every((part) => q.text.includes(part.trim())),
            { message: "quote.excerpt must be word for word from quote.text, cuts marked […]" },
          )
          .optional(),
        image: z.object({ src: image(), alt: z.string().min(10) }).optional(),
        published: z.coerce.date().optional(),
        order: z.number().default(0),
      })
      .strict()
      .refine((d) => !d.highlight || d.summary.includes(d.highlight), {
        message: "highlight must be word for word from summary",
        path: ["highlight"],
      }),
});

const verticals = defineCollection({
  loader: glob({ pattern: "**/[^_]*.md", base: "./src/content/verticals" }),
  schema: z
    .object({
      urlSlug: z.string().optional(),
      /** Short name used in links, e.g. "Braiding salons". */
      name: z.string(),
      title: z.string().max(60),
      description: z.string().max(155),
      h1: z.string(),
      intro: z.string(),
      lookFor: z.object({ h2: z.string(), items: z.array(z.string()).min(3) }),
      setup: z.object({ h2: z.string(), items: z.array(z.string()).min(3) }),
      wontDo: z.object({ h2: z.string(), body: z.string() }),
      cta: z.string(),
      order: z.number().default(0),
    })
    .strict(),
});

export const collections = { work, verticals };
