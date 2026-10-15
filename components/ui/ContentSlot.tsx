/** Inline marker for copy/data the client still has to supply. Never fake data.
 *  Review-only: hidden for visitors, shown with ?annotations=on. */
export function ContentSlot({ children, tone = "light", className = "" }: { children: string; tone?: "dark" | "light"; className?: string }) {
  return (
    <span
      className={`slot-annotation t-micro inline-block border-b border-dashed pb-0.5 ${
        tone === "light" ? "border-ink/25 text-steel-500" : "border-paper/30 text-paper/70"
      } ${className}`}
    >
      [ {children} ]
    </span>
  );
}
