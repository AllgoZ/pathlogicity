import Link from "next/link";
import type { ReactNode } from "react";
import type { NavChild } from "@/lib/content/types";
import { accent } from "@/lib/accent";
import { Reveal } from "@/components/ui/Reveal";

/**
 * Page header for the inner pages: the one `h1`, a short intro and an "On this page" list.
 * Pages wrap their body in `<div data-inner>` so the homepage chapter numbers are hidden.
 */
export function PageHero({ kicker, lines, intro, links }: { kicker: string; lines: string[]; intro: ReactNode; links?: NavChild[] }) {
  return (
    <section data-stage="discover" aria-labelledby="page-title" className="relative overflow-hidden bg-stone pb-16 pt-[calc(88px+56px)] lg:pb-24 lg:pt-[calc(88px+96px)]">
      <div className="shell grid-12 gap-y-10">
        <div className="col-span-4 sm:col-span-8 lg:col-span-7">
          <p className="t-label flex items-center gap-2 text-steel-700">
            <Link href="/" className="transition-colors hover:text-indigo-700">
              Path Logicity
            </Link>
            <span aria-hidden>/</span>
            <span className="text-indigo-700">{kicker}</span>
          </p>
          <h1 id="page-title" className="t-xl mt-6 text-ink">
            {lines.map((l) => (
              <span key={l} className="block">
                {accent(l)}
              </span>
            ))}
          </h1>
          <Reveal className="mt-6 max-w-[48ch]">
            <p className="t-body-l text-steel-700">{intro}</p>
          </Reveal>
        </div>
        {links?.length ? (
          <nav aria-label="On this page" className="col-span-4 self-end sm:col-span-8 lg:col-span-4 lg:col-start-9">
            <p className="t-label text-steel-700">On this page</p>
            <ol className="mt-3 border-t border-ink/15">
              {links.map((l, i) => (
                <li key={l.href} className="border-b border-ink/15">
                  <Link href={l.href} className="group flex items-baseline gap-4 py-4">
                    <span className="t-micro tnum text-indigo-700">{String(i + 1).padStart(2, "0")}</span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[0.9375rem] font-bold text-ink transition-colors group-hover:text-indigo-700">{l.label}</span>
                      {l.note ? <span className="mt-0.5 block text-[0.8125rem] leading-snug text-steel-500">{l.note}</span> : null}
                    </span>
                    <span aria-hidden className="h-px w-3 bg-ink/25 transition-all duration-500 ease-[var(--ease-out-expo)] group-hover:w-8 group-hover:bg-yellow-400" />
                  </Link>
                </li>
              ))}
            </ol>
          </nav>
        ) : null}
      </div>
      <div aria-hidden className="pinwheel-stripe absolute inset-x-0 bottom-0 h-[3px]" />
    </section>
  );
}
