import type { ReactNode } from "react";
import { RevealLines } from "./Reveal";

/**
 *  03 /  EXPLORE PATH LOGICITY      ← mono index + chapter
 *  HEADLINE                          ← hand-broken lines
 *  Short supporting line.
 */
export function SectionHeader({
  index,
  chapter,
  lines,
  body,
  tone = "dark",
  size = "xl",
  id,
  className = "",
  lineClassNames,
}: {
  index: string;
  chapter: string;
  lines: ReactNode[];
  body?: ReactNode;
  tone?: "dark" | "light";
  size?: "xl" | "l";
  id?: string;
  className?: string;
  lineClassNames?: string[];
}) {
  const muted = tone === "light" ? "text-steel-700" : "text-steel-300";
  return (
    <header className={className}>
      <p className={`t-label flex items-center gap-3 ${tone === "light" ? "text-navy-950" : "text-paper"}`}>
        <span className={tone === "light" ? "text-navy-950/50" : "text-yellow-400"}>{index} /</span>
        <span>{chapter}</span>
      </p>
      <RevealLines
        id={id}
        lines={lines}
        lineClassNames={lineClassNames}
        className={`${size === "xl" ? "t-xl" : "t-l"} mt-6 ${tone === "light" ? "text-navy-950" : "text-paper"}`}
      />
      {body ? <div className={`t-body-l mt-6 max-w-[46ch] ${muted}`}>{body}</div> : null}
    </header>
  );
}
