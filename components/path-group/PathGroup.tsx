import type { Homepage } from "@/lib/content";
import { AssetSlot } from "@/components/ui/AssetSlot";
import { ArrowLink } from "@/components/ui/Button";
import { Metric } from "@/components/ui/Metric";
import { Reveal, RevealLines } from "@/components/ui/Reveal";
import { EvolutionLine } from "./EvolutionLine";

/** §05 — PATH Group: editorial, legacy-led chapter on warm paper. */
export function PathGroup({ data }: { data: Homepage["pathGroup"] }) {
  return (
    <section id="path-group" data-stage="believe" aria-labelledby="pg-title" className="on-light relative bg-paper text-navy-950 section-pad">
      <div className="shell">
        <p className="t-label flex items-center gap-3">
          <span className="text-navy-950/45">05 /</span> PATH Group
        </p>
        <h2 id="pg-title" className="mt-6">
          <RevealLines as="span" lines={[data.headline.from]} className="t-l block font-light normal-case text-steel-700 [&_[data-line]]:font-light" />
          <RevealLines as="span" lines={data.headline.to} className="t-xl mt-2 block" />
        </h2>
      </div>

      {/* Numbers over infrastructure photography */}
      <div className="mt-14 lg:mt-20">
        <div className="relative">
          <AssetSlot slot={data.photo.slot} spec={data.photo.spec} ratio="21/9" id="05" variant={3} className="min-h-[260px] w-full lg:min-h-[520px]" label={data.photo.alt} src={data.photo.src} focus="center" sizes="100vw" />
          <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 hidden h-3/4 bg-gradient-to-t from-navy-950/95 via-navy-950/60 to-transparent lg:block" />
          <div className="relative bg-navy-950 lg:absolute lg:inset-x-0 lg:bottom-0 lg:bg-transparent">
            <Reveal className="shell grid grid-cols-2 border-t border-white/15 text-paper lg:grid-cols-4" stagger={0.1}>
              {data.metrics.map((m, i) => (
                <div key={m.unit} className={`py-6 pr-4 lg:py-10 ${i > 0 ? "lg:border-l lg:border-white/15 lg:pl-8" : ""} ${i % 2 === 1 ? "border-l border-white/15 pl-5 lg:pl-8" : ""}`}>
                  <Metric data={m} size="l" />
                </div>
              ))}
            </Reveal>
          </div>
        </div>
      </div>

      <div className="shell mt-16 grid-12 gap-y-10 lg:mt-24">
        <Reveal className="col-span-4 sm:col-span-8 lg:col-span-8">
          <p className="t-micro text-steel-700">About PATH</p>
          <blockquote className="mt-5 font-display text-[clamp(1.5rem,2.6vw,2.5rem)] font-light leading-[1.18] tracking-[-0.025em]">
            <span aria-hidden className="text-navy-950/30">“</span>
            {data.story}
            <span aria-hidden className="text-navy-950/30">”</span>
          </blockquote>
        </Reveal>
        <Reveal className="col-span-4 self-end sm:col-span-8 lg:col-span-3 lg:col-start-10">
          <p className="t-micro text-steel-700">Experience across</p>
          <ul className="mt-4 border-t border-navy-950/15">
            {data.sectors.map((s) => (
              <li key={s} className="t-label flex items-center justify-between border-b border-navy-950/15 py-3.5">
                {s}
                <span aria-hidden className="h-1.5 w-1.5 bg-navy-950" />
              </li>
            ))}
          </ul>
        </Reveal>
      </div>

      <div className="shell mt-20 lg:mt-28">
        <EvolutionLine steps={data.evolution} />
        <div className="mt-12 flex justify-end">
          <ArrowLink href="/path-group" tone="dark">
            Know more about PATH
          </ArrowLink>
        </div>
      </div>
    </section>
  );
}
