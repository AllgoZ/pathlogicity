import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { Icon } from "./Icon";

type Variant = "primary" | "outline-light" | "outline-dark" | "outline-yellow";

const base =
  "group relative inline-flex items-center justify-center gap-3 overflow-hidden whitespace-nowrap font-sans text-[0.8125rem] font-semibold uppercase tracking-[0.06em] transition-colors duration-300 ease-[var(--ease-out-expo)] h-[52px] lg:h-14 px-6 lg:px-7";

const variants: Record<Variant, string> = {
  primary: "bg-yellow-400 text-navy-950",
  "outline-light": "border border-paper/40 text-paper hover:border-paper hover:bg-paper hover:text-navy-950",
  "outline-dark": "border border-navy-950/30 text-navy-950 hover:border-navy-950 hover:bg-navy-950 hover:text-paper",
  "outline-yellow": "border border-yellow-400/70 text-yellow-400 hover:bg-yellow-400 hover:text-navy-950",
};

function Inner({ children, variant, arrow }: { children: ReactNode; variant: Variant; arrow: boolean }) {
  return (
    <>
      {variant === "primary" ? (
        // Navy wipe sweeps under the label on hover
        <span
          aria-hidden
          className="absolute inset-0 origin-left scale-x-0 bg-navy-950 transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:scale-x-100"
        />
      ) : null}
      <span
        className={`relative z-10 inline-flex items-center gap-3 ${variant === "primary" ? "transition-colors duration-300 group-hover:text-yellow-400" : ""}`}
      >
        {children}
        {arrow ? <Icon name="arrow-right" size={18} className="arrow-nudge" /> : null}
      </span>
    </>
  );
}

type LinkBtnProps = Omit<ComponentProps<typeof Link>, "className"> & {
  variant?: Variant;
  arrow?: boolean;
  className?: string;
};

export function ButtonLink({ variant = "primary", arrow = true, className = "", children, ...rest }: LinkBtnProps) {
  return (
    <Link className={`${base} ${variants[variant]} ${className}`} {...rest}>
      <Inner variant={variant} arrow={arrow}>
        {children}
      </Inner>
    </Link>
  );
}

type BtnProps = ComponentProps<"button"> & { variant?: Variant; arrow?: boolean };

export function Button({ variant = "primary", arrow = true, className = "", children, ...rest }: BtnProps) {
  return (
    <button className={`${base} ${variants[variant]} disabled:opacity-60 ${className}`} {...rest}>
      <Inner variant={variant} arrow={arrow}>
        {children}
      </Inner>
    </button>
  );
}

/** Text + arrow link. Underline grows from the left, arrow nudges 6px. */
export function ArrowLink({
  href,
  children,
  tone = "light",
  className = "",
  ...rest
}: Omit<ComponentProps<typeof Link>, "className"> & { tone?: "light" | "dark" | "yellow"; className?: string }) {
  const color = tone === "dark" ? "text-navy-950" : tone === "yellow" ? "text-yellow-400" : "text-paper";
  const line = tone === "dark" ? "bg-navy-950" : "bg-yellow-400";
  return (
    <Link
      href={href}
      className={`group inline-flex items-center gap-3 py-2 font-sans text-[0.8125rem] font-semibold uppercase tracking-[0.06em] ${color} ${className}`}
      {...rest}
    >
      <span className="relative">
        {children}
        <span
          aria-hidden
          className={`absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 ${line} transition-transform duration-300 ease-[var(--ease-out-expo)] group-hover:scale-x-100`}
        />
      </span>
      <Icon name="arrow-right" size={18} className="arrow-nudge" />
    </Link>
  );
}
