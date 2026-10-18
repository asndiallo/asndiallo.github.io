import { defaultLocale, getDictionary, locales } from "../i18n/index.ts";
import { EXTERNAL_REL, isExternal } from "./links.ts";

/** The slice of Sätteri's hast visitor API this plugin uses. */
interface AnchorNode {
  properties?: Record<string, unknown>;
}
interface VisitContext {
  setProperty(node: AnchorNode, key: string, value: unknown): void;
  appendChild(node: AnchorNode, child: unknown): void;
}

/**
 * Markdown counterpart of components/Link.astro (Sätteri hast plugin, see astro.config.ts):
 * external links open in a new tab, with a screen-reader hint in the content's language,
 * taken from its src/content/<collection>/<locale>/ path.
 */
export const externalLinksPlugin = ({ fileURL }: { fileURL: URL | undefined }) => {
  const path = fileURL?.pathname ?? "";
  const locale = locales.find((l) => path.includes(`/${l}/`)) ?? defaultLocale;
  const hint = getDictionary(locale).newTab;
  return {
    name: "external-links",
    element: {
      filter: ["a"],
      visit(node: AnchorNode, ctx: VisitContext) {
        if (!isExternal(String(node.properties?.href ?? ""))) return;
        ctx.setProperty(node, "target", "_blank");
        ctx.setProperty(node, "rel", [EXTERNAL_REL]);
        ctx.appendChild(node, {
          type: "element",
          tagName: "span",
          properties: { className: ["sr-only"] },
          children: [{ type: "text", value: ` ${hint}` }],
        });
      },
    },
  };
};
