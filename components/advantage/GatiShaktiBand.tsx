import type { Homepage } from "@/lib/content";
import { ArrowLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Reveal, RevealLines } from "@/components/ui/Reveal";

/** §07b — PM Gati Shakti: the network expands to the nation. A typographic equation. */
export function GatiShaktiBand({ data }: { data: Homepage["gatiShakti"] }) {
  return (
    <section id="pm-gati-shakti" data-stage="understand" aria-labelledby="gs-title" className="relative overflow-hidden border-t border-white/10 bg-navy-900 pb-[clamp(96px,14vh,192px)] pt-[clamp(72px,10vh,128px)]">
      <div className="shell">
        <div className="grid-12 gap-y-6">
          <div className="col-span-4 sm:col-span-8 lg:col-span-7">
            <p className="t-label">
              <span className="text-yellow-400">07.1 /</span> PM Gati Shakti
            </p>
            <RevealLines id="gs-title" lines={data.headline} className="t-l mt-6" />
          </div>
          <p className="t-body-l col-span-4 self-end text-steel-300 sm:col-span-8 lg:col-span-4 lg:col-start-9">{data.tagline}</p>
        </div>

        {/* ROAD + RAIL + WAREHOUSING + COMMERCIAL + ICD = ONE ECOSYSTEM */}
        <Reveal className="mt-16 flex flex-wrap items-stretch border-y border-white/10 lg:mt-20 lg:flex-nowrap" stagger={0.08}>
          {data.equation.map((t, i) => (
            <div key={t.label} className="group flex w-1/2 items-center sm:w-1/3 lg:w-auto lg:flex-1">
              <div className="flex flex-1 flex-col gap-4 border-r border-white/10 px-4 py-7 lg:px-6 lg:py-10">
                <Icon name={t.icon} size={30} draw className="text-indigo-300 transition-colors duration-300 group-hover:text-yellow-400" />
                <p className="font-display text-[clamp(1.1rem,1.6vw,1.6rem)] font-extrabold uppercase tracking-[-0.02em]">{t.label}</p>
              </div>
              {i < data.equation.length - 1 ? (
                <span aria-hidden className="t-label hidden w-8 shrink-0 justify-center text-steel-500 lg:flex">
                  +
                </span>
              ) : null}
            </div>
          ))}
          <div className="flex w-full items-center gap-5 bg-yellow-400 px-6 py-7 text-navy-950 sm:w-2/3 lg:w-auto lg:flex-[1.4] lg:py-10">
            <span aria-hidden className="font-display text-4xl font-light leading-none">=</span>
            <span className="relative flex h-10 w-10 shrink-0 items-center justify-center">
              <Icon name="crosshair" size={36} />
            </span>
            <p className="font-display text-[clamp(1.2rem,1.8vw,1.8rem)] font-extrabold uppercase leading-[0.95] tracking-[-0.02em]">
              One
              <br />
              ecosystem
            </p>
          </div>
        </Reveal>

        <div className="mt-14 grid-12 gap-y-8">
          <Reveal as="ol" className="col-span-4 sm:col-span-8 lg:col-span-8 lg:grid lg:grid-cols-3 lg:gap-x-[var(--gutter)]">
            {data.points.map((p, i) => (
              <li key={p} className="flex gap-4 border-t border-white/10 py-5 lg:block lg:py-6">
                <span className="t-micro text-yellow-400">{String(i + 1).padStart(2, "0")}</span>
                <p className="text-[15px] leading-relaxed text-paper/90 lg:mt-4">{p}</p>
              </li>
            ))}
          </Reveal>
          <div className="col-span-4 flex flex-col justify-between gap-6 sm:col-span-8 lg:col-span-3 lg:col-start-10">
            <p className="t-micro leading-relaxed text-steel-300">{data.mmlp}</p>
            <ArrowLink href="/logicity-advantage#pm-gati-shakti">PM Gati Shakti</ArrowLink>
          </div>
        </div>
      </div>
    </section>
  );
}
