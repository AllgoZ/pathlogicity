import type { Homepage } from "@/lib/content";
import { AssetSlot } from "@/components/ui/AssetSlot";
import { ArrowLink } from "@/components/ui/Button";
import { Metric } from "@/components/ui/Metric";
import { Reveal, RevealLines } from "@/components/ui/Reveal";
import { EvolutionLine } from "./EvolutionLine";

/** §05 — PATH Group: editorial, legacy-led chapter. Photography with a glass metrics strip; the story in serif. */
export function PathGroup({ data }: { data: Homepage["pathGroup"] }) {
  return (
    <section id="path-group" data-stage="believe" aria-labelledby="pg-title" className="relative bg-stone section-pad">
      <div className="shell">
        <p className="t-label flex items-center gap-3 text-ink">
          <span className="text-indigo-700">05 /</span> PATH Group
        </p>
        <h2 id="pg-title" className="mt-5">
          <RevealLines as="span" lines={[data.headline.from]} className="t-l block font-normal text-steel-500 [&_[data-line]]:font-normal" />
          <RevealLines as="span" lines={data.headline.to} className="t-xl mt-1 block text-ink" />
        </h2>
      </div>

      {/* Infrastructure photography with the group's numbers on a glass strip */}
      <div className="shell mt-12 lg:mt-16">
        <div className="relative overflow-hidden rounded-[2px] shadow-[var(--shadow-card)]">
          <AssetSlot slot={data.photo.slot} spec={data.photo.spec} ratio="21/9" id="05" variant={3} className="min-h-[260px] w-full lg:min-h-[520px]" label={data.photo.alt} src={data.photo.src} focus="center" sizes="(min-width: 1600px) 1600px, 100vw" />
          <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 hidden h-2/3 bg-gradient-to-t from-midnight/80 via-midnight/30 to-transparent lg:block" />
          <Reveal
            className="on-dark grid grid-cols-2 bg-midnight text-paper lg:absolute lg:inset-x-6 lg:bottom-6 lg:grid-cols-4 lg:rounded-[2px] lg:border lg:border-white/15 lg:bg-midnight/45 lg:backdrop-blur-xl"
            stagger={0.1}
          >
            {data.metrics.map((m, i) => (
              <div key={m.unit} className={`px-5 py-7 lg:px-8 lg:py-8 ${i % 2 === 1 ? "border-l border-white/10" : ""} ${i > 1 ? "border-t border-white/10 lg:border-t-0" : ""} ${i === 2 ? "lg:border-l" : ""}`}>
                <Metric data={m} size="l" tone="dark" />
              </div>
            ))}
          </Reveal>
        </div>
      </div>

      <div className="shell mt-16 grid-12 gap-y-10 lg:mt-24">
        <Reveal className="col-span-4 sm:col-span-8 lg:col-span-8">
          <p className="t-micro text-indigo-700">About PATH</p>
          <blockquote className="mt-5 font-serif text-[clamp(1.625rem,2.7vw,2.625rem)] italic leading-[1.25] tracking-[-0.01em] text-ink">
            <span aria-hidden className="text-yellow-400">“</span>
            {data.story}
            <span aria-hidden className="text-yellow-400">”</span>
          </blockquote>
        </Reveal>
        <Reveal className="col-span-4 self-end sm:col-span-8 lg:col-span-3 lg:col-start-10">
          <p className="t-micro text-steel-500">Experience across</p>
          <ul className="mt-4 border-t border-ink/15">
            {data.sectors.map((s) => (
              <li key={s} className="flex items-center justify-between border-b border-ink/15 py-4 font-display text-[1.0625rem] font-semibold text-ink">
                {s}
                <span aria-hidden className="h-1.5 w-1.5 rotate-45 bg-yellow-400" />
              </li>
            ))}
          </ul>
        </Reveal>
      </div>

      <div className="shell mt-16 lg:mt-24">
        <EvolutionLine steps={data.evolution} />
        <div className="mt-12 flex justify-end">
          <ArrowLink href="/path-group">Know more about PATH</ArrowLink>
        </div>
      </div>
    </section>
  );
}
