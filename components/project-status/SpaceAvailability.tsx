import type { ConstraLink, Leasing, SpaceStatus } from "@/lib/content/types";
import { ArrowLink } from "@/components/ui/Button";
import { ContentSlot } from "@/components/ui/ContentSlot";
import { Icon } from "@/components/ui/Icon";
import { Metric } from "@/components/ui/Metric";
import { Reveal } from "@/components/ui/Reveal";

const STATUS: Record<SpaceStatus, { label: string; chip: string; bar: string }> = {
  leased: { label: "Leased", chip: "bg-indigo-50 text-indigo-700", bar: "bg-indigo-700" },
  available: { label: "Available", chip: "bg-green-50 text-green-700", bar: "bg-green-500" },
  reserved: { label: "Reserved", chip: "bg-yellow-50 text-ink", bar: "bg-yellow-400" },
};

const sqft = (n: number | null) => (n === null ? "—" : n.toLocaleString("en-IN"));

/**
 * §04.1 — Space availability, linked with Constra (client round 5: "link the leased and available space
 * details with Constra … and any other relevant collaterals"). Every figure and link comes from content and
 * stays empty until the client supplies it: with no figures visitors see an enquiry card, never a made-up
 * number, and the review view (?annotations=on) lists exactly what is missing.
 */
export function SpaceAvailability({ leasing, constra }: { leasing: Leasing; constra: { url: string | null; links: ConstraLink[] } }) {
  const { totalSqFt, leasedSqFt, availableSqFt, units } = leasing;
  const hasFigures = totalSqFt !== null && leasedSqFt !== null && availableSqFt !== null;
  const leasedShare = hasFigures && totalSqFt > 0 ? Math.round((leasedSqFt / totalSqFt) * 100) : 0;
  const links = constra.links.filter((l) => l.href);
  const missing = constra.links.filter((l) => !l.href);

  return (
    <div id="availability" aria-labelledby="availability-title" className="shell mt-24 lg:mt-32">
      <div className="grid-12 items-end gap-y-6 border-t border-ink/15 pt-12">
        <div className="col-span-4 sm:col-span-8 lg:col-span-7">
          <p className="t-label text-indigo-700">Space availability</p>
          <h3 id="availability-title" className="t-l mt-4 text-ink">
            Leased and available space,
            <br />
            tracked with <em>Constra</em>
          </h3>
        </div>
        <div className="col-span-4 flex flex-col items-start gap-3 sm:col-span-8 lg:col-span-4 lg:col-start-9 lg:items-end">
          <p className={`t-micro text-steel-700 ${leasing.updatedAt ? "" : "slot-annotation"}`}>Last updated · {leasing.updatedAt ?? <ContentSlot>Constra sync date</ContentSlot>}</p>
          {constra.url ? (
            <a
              href={constra.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-3 py-2 font-sans text-[0.8125rem] font-semibold uppercase tracking-[0.06em] text-indigo-700"
            >
              <span className="relative">
                Open Constra
                <span aria-hidden className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-yellow-400 transition-transform duration-300 ease-[var(--ease-out-expo)] group-hover:scale-x-100" />
              </span>
              <Icon name="arrow-right" size={18} className="arrow-nudge" />
            </a>
          ) : (
            <ContentSlot>Constra project URL</ContentSlot>
          )}
        </div>
      </div>

      {hasFigures ? (
        <Reveal className="mt-10 grid gap-10 lg:mt-12">
          <div>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
              <Metric data={{ value: totalSqFt, unit: "sq. ft. in total", label: "" }} size="l" />
              <Metric data={{ value: leasedSqFt, unit: "sq. ft. leased", label: "" }} size="l" valueClassName="text-indigo-700" />
              <Metric data={{ value: availableSqFt, unit: "sq. ft. available", label: "" }} size="l" valueClassName="text-green-700" />
            </div>
            <div
              role="img"
              aria-label={`${leasedShare}% of the space is leased, ${100 - leasedShare}% is available`}
              className="mt-8 flex h-2 w-full overflow-hidden bg-green-500/25"
            >
              <span className={`block h-full ${STATUS.leased.bar}`} style={{ width: `${leasedShare}%` }} />
            </div>
          </div>

          {units.length ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[480px] border-collapse text-left">
                <caption className="sr-only">Leased and available space by building</caption>
                <thead>
                  <tr className="border-b border-ink/15">
                    <th scope="col" className="t-micro py-3 pr-4 text-steel-500">Building / block</th>
                    <th scope="col" className="t-micro py-3 pr-4 text-right text-steel-500">Area (sq. ft.)</th>
                    <th scope="col" className="t-micro py-3 text-right text-steel-500">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {units.map((u) => (
                    <tr key={u.id} className="border-b border-ink/10">
                      <th scope="row" className="py-4 pr-4 text-[1rem] font-semibold text-ink">{u.name}</th>
                      <td className="tnum py-4 pr-4 text-right text-[1rem] text-ink">{sqft(u.areaSqFt)}</td>
                      <td className="py-4 text-right">
                        <span className={`t-micro inline-block px-2.5 py-1 ${STATUS[u.status].chip}`}>{STATUS[u.status].label}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}
        </Reveal>
      ) : (
        <Reveal className="mt-10 lg:mt-12">
          <div className="grid-12 items-center gap-y-6 border-l-[3px] border-yellow-400 bg-paper p-6 shadow-[var(--shadow-card)] lg:p-9">
            <div className="col-span-4 sm:col-span-8 lg:col-span-8">
              <p className="t-m text-ink">Current leased and available space is shared on request.</p>
              <p className="mt-3 max-w-[56ch] text-[1rem] leading-relaxed text-steel-700">
                Tell us the size and timing you are planning for and the leasing team will share what is available at Path Logicity.
              </p>
              <p className="mt-3">
                <ContentSlot>Leased / available / total sq. ft. and the unit list, from Constra</ContentSlot>
              </p>
            </div>
            <div className="col-span-4 sm:col-span-8 lg:col-span-4 lg:justify-self-end">
              <ArrowLink href="#enquire">Enquire about available space</ArrowLink>
            </div>
          </div>
        </Reveal>
      )}

      {links.length ? (
        <Reveal as="ul" stagger={0.07} className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:mt-12 lg:grid-cols-4">
          {links.map((l) => (
            <li key={l.id} className="flex">
              <a
                href={l.href as string}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex w-full flex-col justify-between bg-paper p-6 shadow-[var(--shadow-card)] transition-transform duration-500 ease-[var(--ease-out-expo)] hover:-translate-y-1.5"
              >
                <span>
                  <span className="t-micro text-indigo-700">On Constra</span>
                  <span className="t-s mt-2 block text-ink">{l.label}</span>
                  <span className="mt-2 block text-[0.9375rem] leading-snug text-steel-700">{l.text}</span>
                </span>
                <span className="mt-6 flex items-center justify-between">
                  <span aria-hidden className="block h-[3px] w-10 bg-yellow-400 transition-[width] duration-500 ease-[var(--ease-out-expo)] group-hover:w-20" />
                  <Icon name="arrow-right" size={16} className="arrow-nudge text-indigo-700" />
                </span>
                <span className="sr-only"> (opens Constra in a new tab)</span>
              </a>
            </li>
          ))}
        </Reveal>
      ) : null}
      {missing.length ? (
        <p className="mt-6">
          <ContentSlot>{`Constra links to supply: ${missing.map((l) => l.label).join(" · ")}`}</ContentSlot>
        </p>
      ) : null}
    </div>
  );
}
