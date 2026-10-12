/** Inline marker for copy/data the client still has to supply. Never fake data. */
export function ContentSlot({ children, tone = "dark", className = "" }: { children: string; tone?: "dark" | "light"; className?: string }) {
  return (
    <span
      className={`t-micro inline-block border-b border-dashed pb-0.5 ${
        tone === "light" ? "border-navy-950/30 text-steel-700" : "border-paper/25 text-steel-500"
      } ${className}`}
    >
      [ {children} ]
    </span>
  );
}
