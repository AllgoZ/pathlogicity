import { Fragment, type ReactNode } from "react";

/**
 * Accent words in headlines: `"India's *multimodal* hub"` → India's <em>multimodal</em> hub.
 * <em> in headings renders in Instrument Serif italic (see globals.css). Content
 * stays plain strings, so the CMS can carry the same `*…*` convention.
 */
export function accent(text: ReactNode): ReactNode {
  if (typeof text !== "string" || !text.includes("*")) return text;
  return text
    .split(/(\*[^*]+\*)/g)
    .filter(Boolean)
    .map((part, i) =>
      part.length > 2 && part.startsWith("*") && part.endsWith("*") ? <em key={i}>{part.slice(1, -1)}</em> : <Fragment key={i}>{part}</Fragment>,
    );
}
