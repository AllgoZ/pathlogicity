import type { Homepage } from "@/lib/content";
import { AssetSlot } from "@/components/ui/AssetSlot";
import { ArrowLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Metric } from "@/components/ui/Metric";
import { Reveal, RevealLines } from "@/components/ui/Reveal";
import { PathVerticals } from "./PathVerticals";

/** §05 — PATH Group: legacy-led chapter. A highway photograph with the group's figures, About PATH (story, overview, mission, track record), then the verticals. */
export function PathGroup({ data, standalone = false }: { data: Homepage["pathGroup"]; standalone?: boolean }) {
  return (
    <section id="path-group" data-stage="believe" aria-labelledby="pg-title" className="relative bg-stone section-pad">
      <div className="shell">
        <p className="t-label flex items-center gap-3 text-ink">
          <span data-idx className="text-indigo-700">05 /</span> PATH Group
        </p>
        <h2 id="pg-title" className="mt-5">
          <RevealLines as="span" lines={[data.headline.from]} className="t-l block font-normal text-steel-500 [&_[data-line]]:font-normal" />
          <RevealLines as="span" lines={data.headline.to} className="t-xl mt-1 block text-ink" />
        </h2>
      </div>

      {/* Infrastructure photography with the group's numbers on a glass strip */}
      <div id="highlight" className="shell mt-12 lg:mt-16">
        <div className="relative overflow-hidden rounded-[2px] shadow-[var(--shadow-card)]">
          <AssetSlot slot={data.photo.slot} spec={data.photo.spec} ratio="21/9" id="05" variant={3} className="min-h-[260px] w-full lg:min-h-[500px]" label={data.photo.alt} src={data.photo.src} focus="center" sizes="(min-width: 1600px) 1600px, 100vw" />
          <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 hidden h-2/3 bg-gradient-to-t from-ink/55 via-ink/10 to-transparent lg:block" />
          <Reveal
            className="grid grid-cols-2 bg-paper text-ink lg:absolute lg:inset-x-6 lg:bottom-6 lg:grid-cols-4 lg:rounded-[2px] lg:bg-paper/92 lg:shadow-[var(--shadow-card)] lg:backdrop-blur-xl"
            stagger={0.1}
          >
            {data.metrics.map((m, i) => (
              <div key={m.unit} className={`px-5 py-7 lg:px-8 lg:py-8 ${i % 2 === 1 ? "border-l border-ink/10" : ""} ${i > 1 ? "border-t border-ink/10 lg:border-t-0" : ""} ${i === 2 ? "lg:border-l" : ""}`}>
                <Metric data={m} size="l" valueClassName="text-indigo-700" />
              </div>
            ))}
          </Reveal>
        </div>
      </div>

      <div id="about" className="shell mt-16 grid-12 gap-y-10 lg:mt-24">
        <Reveal className="col-span-4 sm:col-span-8 lg:col-span-8">
          <p className="t-label text-indigo-700">About PATH</p>
          <blockquote className="mt-5 text-[clamp(1.375rem,2.1vw,1.9375rem)] font-bold leading-[1.3] tracking-[-0.02em] text-ink">
            <span aria-hidden className="text-yellow-400">“</span>
            {data.story}
            <span aria-hidden className="text-yellow-400">”</span>
          </blockquote>
        </Reveal>
        <Reveal className="col-span-4 self-end sm:col-span-8 lg:col-span-3 lg:col-start-10">
          <p className="t-label text-steel-700">Experience across</p>
          <ul data-mobile-rise className="mt-4 border-t border-ink/15">
            {data.sectors.map((s) => (
              <li key={s} className="flex items-center justify-between border-b border-ink/15 py-4 text-[1.0625rem] font-semibold text-ink">
                {s}
                <span aria-hidden className="h-1.5 w-1.5 rotate-45 bg-yellow-400" />
              </li>
            ))}
          </ul>
        </Reveal>
      </div>

      {/* About PATH, in full: overview, mission and vision, track record */}
      <div className="shell mt-14 grid-12 gap-y-10 lg:mt-20">
        <Reveal className="col-span-4 space-y-5 sm:col-span-8 lg:col-span-6">
          {data.about.paragraphs.map((p) => (
            <p key={p} className="t-body-l text-steel-700">
              {p}
            </p>
          ))}
          <a
            href={data.about.source.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-3 py-2 font-sans text-[0.8125rem] font-semibold uppercase tracking-[0.06em] text-indigo-700"
          >
            <span className="relative">
              {data.about.source.label}
              <span aria-hidden className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-yellow-400 transition-transform duration-300 ease-[var(--ease-out-expo)] group-hover:scale-x-100" />
            </span>
            <Icon name="arrow-right" size={18} className="arrow-nudge" />
          </a>
        </Reveal>
        <Reveal className="col-span-4 grid gap-4 sm:col-span-8 lg:col-span-5 lg:col-start-8" stagger={0.12}>
          <div className="border-l-[3px] border-yellow-400 bg-paper p-6 shadow-[var(--shadow-card)] lg:p-7">
            <p className="t-label text-indigo-700">Our mission</p>
            <p className="mt-3 text-[1rem] leading-relaxed text-ink">{data.about.mission}</p>
          </div>
          <div className="border-l-[3px] border-indigo-700 bg-paper p-6 shadow-[var(--shadow-card)] lg:p-7">
            <p className="t-label text-indigo-700">Our vision</p>
            <p className="mt-3 text-[1rem] leading-relaxed text-ink">{data.about.vision}</p>
          </div>
        </Reveal>
      </div>

      <div className="shell mt-14 lg:mt-20">
        <p className="t-label text-steel-700">Track record</p>
        <Reveal as="ul" stagger={0.06} className="mt-4 grid grid-cols-2 border-t border-ink/15 sm:grid-cols-4">
          {data.about.record.map((m, i) => (
            <li key={m.unit} className={`border-b border-ink/15 py-6 pr-4 ${i % 2 === 1 ? "pl-5 max-sm:border-l max-sm:border-ink/10" : ""} ${i % 4 !== 0 ? "sm:border-l sm:border-ink/10 sm:pl-6" : ""}`}>
              <Metric data={m} size="m" valueClassName="text-indigo-700" />
            </li>
          ))}
        </Reveal>
      </div>

      <div className="shell mt-20 lg:mt-28">
        <PathVerticals items={data.verticals} />
        {standalone ? null : (
          <div className="mt-12 flex justify-end">
            <ArrowLink href="/path-group">Know more about PATH</ArrowLink>
          </div>
        )}
      </div>
    </section>
  );
}
