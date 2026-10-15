import { telHref } from "@/lib/content";
import type { IconName, SiteSettings } from "@/lib/content/types";
import { Icon } from "@/components/ui/Icon";
import { RevealLines } from "@/components/ui/Reveal";
import { SurveyGrid } from "@/components/ui/SurveyGrid";
import { EnquiryForm } from "./EnquiryForm";

type Content = { headline: string[]; copy: string[]; industries: string[] };

/** Final CTA — shared by every page (PDF: "FOOTER for all pages"). The route's destination. */
export function EnquireBlock({ content, settings }: { content: Content; settings: SiteSettings }) {
  const actions: { icon: IconName; label: string; value?: string; href: string | null }[] = [
    { icon: "phone", label: "Call us", value: settings.phone ?? undefined, href: settings.phone ? telHref(settings.phone) : null },
    { icon: "mail", label: "Email", value: settings.email ?? undefined, href: settings.email ? `mailto:${settings.email}` : null },
    { icon: "whatsapp", label: "WhatsApp", href: settings.whatsapp ? `https://wa.me/${settings.whatsapp}` : null },
    { icon: "download", label: "Download brochure", href: settings.brochureUrl },
  ];

  return (
    <section id="enquire" data-stage="enquire" aria-labelledby="enquire-title" className="relative overflow-hidden bg-canvas-2 section-pad">
      <SurveyGrid />
      <div className="shell relative grid-12 gap-y-16">
        <div className="col-span-4 sm:col-span-8 lg:col-span-5">
          <p className="t-label flex items-center gap-3 text-ink">
            <span className="text-blue-500">11 /</span> Enquire
          </p>
          <RevealLines
            id="enquire-title"
            lines={content.headline.map((l) => l)}
            lineClassNames={["", "", "text-indigo-700", ""]}
            className="t-xl mt-5 text-ink"
          />
          <div className="t-body-l mt-6 max-w-[36ch] text-steel-700">
            {content.copy.map((c) => (
              <p key={c}>{c}</p>
            ))}
          </div>

          <ul className="mt-10 border-t border-ink/10">
            {actions.map((a) => (
              <li key={a.label} className="border-b border-ink/10">
                {a.href ? (
                  <a href={a.href} className="group flex min-h-16 items-center gap-4 py-3 text-ink">
                    <Icon name={a.icon} size={22} draw className="text-blue-500" />
                    <span>
                      <span className="t-micro block text-steel-500">{a.label}</span>
                      {a.value ? <span className="mt-0.5 block text-[1rem] font-bold">{a.value}</span> : null}
                    </span>
                    <Icon name="arrow-right" size={18} className="arrow-nudge ml-auto text-indigo-700" />
                  </a>
                ) : (
                  <div className="flex h-16 items-center gap-4 text-ink/60">
                    <Icon name={a.icon} size={22} className="text-blue-500/60" />
                    <span className="t-micro">{a.label}</span>
                    <span className="t-micro ml-auto text-steel-500">To be supplied</span>
                  </div>
                )}
              </li>
            ))}
          </ul>
          {settings.address ? (
            <address className="mt-6 text-[0.9375rem] not-italic leading-relaxed text-steel-700">
              <span className="t-micro block text-steel-500">Registered office</span>
              {settings.address.map((l) => (
                <span key={l} className="block">
                  {l}
                </span>
              ))}
            </address>
          ) : null}
          <div className="mt-6 flex gap-2">
            {settings.socials.map((s) =>
              s.href ? (
                <a key={s.label} href={s.href} aria-label={s.label} target="_blank" rel="noopener noreferrer" className="flex h-11 w-11 items-center justify-center border border-ink/15 bg-paper text-indigo-700 transition-colors hover:border-indigo-700 hover:bg-indigo-700 hover:text-paper">
                  <Icon name={s.icon} size={17} />
                </a>
              ) : (
                <span key={s.label} role="img" aria-label={`${s.label} (link to be supplied)`} className="flex h-11 w-11 items-center justify-center border border-ink/10 text-ink/35">
                  <Icon name={s.icon} size={17} />
                </span>
              ),
            )}
          </div>
        </div>

        <div className="col-span-4 sm:col-span-8 lg:col-span-6 lg:col-start-7">
          <div className="relative border border-ink/10 bg-paper p-6 shadow-[0_24px_60px_-30px_rgb(26_28_70/0.3)] sm:p-10 lg:p-12">
            <span aria-hidden className="absolute -top-px left-0 h-[3px] w-24 bg-yellow-400" />
            <EnquiryForm industries={content.industries} />
          </div>
        </div>
      </div>
    </section>
  );
}
