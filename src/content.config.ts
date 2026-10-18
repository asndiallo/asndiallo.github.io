import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const work = defineCollection({
  loader: glob({ pattern: "**/[^_]*.md", base: "./src/content/work" }),
  schema: ({ image }) =>
    z
      .object({
        business: z.string(),
        city: z.string(),
        vertical: z.enum(["braiding-salons", "restaurants", "other"]),
        /** Card + meta description. Plain language, no numbers that the owner hasn't approved. */
        summary: z.string().max(155),
        /** The owner agreed to be named and to have this page published. Required to publish. */
        consent: z.literal(true),
        website: z.url().optional(),
        services: z.array(z.string()).min(1),
        /** Only numbers the owner approved, each with where it came from. */
        results: z
          .array(z.object({ label: z.string(), value: z.string(), source: z.string() }))
          .default([]),
        quote: z.object({ text: z.string(), author: z.string() }).optional(),
        image: z.object({ src: image(), alt: z.string().min(10) }).optional(),
        published: z.coerce.date().optional(),
        order: z.number().default(0),
      })
      .strict(),
});

const verticals = defineCollection({
  loader: glob({ pattern: "**/[^_]*.md", base: "./src/content/verticals" }),
  schema: z
    .object({
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
