import type { IconName, SiteSettings } from "@/lib/content/types";
import { Icon } from "@/components/ui/Icon";
import { RevealLines } from "@/components/ui/Reveal";
import { SurveyGrid } from "@/components/ui/SurveyGrid";
import { EnquiryForm } from "./EnquiryForm";

type Content = { headline: string[]; copy: string[]; industries: string[] };

/** Final CTA — shared by every page (PDF: "FOOTER for all pages"). The route's destination. */
export function EnquireBlock({ content, settings }: { content: Content; settings: SiteSettings }) {
  const actions: { icon: IconName; label: string; href: string | null }[] = [
    { icon: "phone", label: "Call leasing team", href: settings.phone ? `tel:${settings.phone}` : null },
    { icon: "whatsapp", label: "WhatsApp", href: settings.whatsapp ? `https://wa.me/${settings.whatsapp}` : null },
    { icon: "download", label: "Download brochure", href: settings.brochureUrl },
  ];

  return (
    <section id="enquire" data-stage="enquire" aria-labelledby="enquire-title" className="relative overflow-hidden bg-navy-900 section-pad">
      <SurveyGrid />
      <div className="shell relative grid-12 gap-y-16">
        <div className="col-span-4 sm:col-span-8 lg:col-span-5">
          <p className="t-label flex items-center gap-3">
            <span className="text-yellow-400">11 /</span> Enquire
          </p>
          <RevealLines
            id="enquire-title"
            lines={content.headline.map((l) => l)}
            lineClassNames={["", "", "text-yellow-400", ""]}
            className="t-xl mt-6 lg:!text-[clamp(2.6rem,5.4vw,6.5rem)]"
          />
          <div className="t-body-l mt-8 max-w-[36ch] text-steel-300">
            {content.copy.map((c) => (
              <p key={c}>{c}</p>
            ))}
          </div>

          <ul className="mt-12 border-t border-white/10">
            {actions.map((a) => (
              <li key={a.label} className="border-b border-white/10">
                {a.href ? (
                  <a href={a.href} className="group flex h-16 items-center gap-4 text-paper">
                    <Icon name={a.icon} size={22} draw className="text-yellow-400" />
                    <span className="text-[13px] font-semibold uppercase tracking-[0.07em]">{a.label}</span>
                    <Icon name="arrow-right" size={18} className="arrow-nudge ml-auto" />
                  </a>
                ) : (
                  <div className="flex h-16 items-center gap-4 text-paper/60">
                    <Icon name={a.icon} size={22} className="text-yellow-400/60" />
                    <span className="text-[13px] font-semibold uppercase tracking-[0.07em]">{a.label}</span>
                    <span className="t-micro ml-auto text-steel-500">To be supplied</span>
                  </div>
                )}
              </li>
            ))}
          </ul>
          <div className="mt-6 flex gap-2">
            {settings.socials.map((s) =>
              s.href ? (
                <a key={s.label} href={s.href} aria-label={s.label} className="flex h-11 w-11 items-center justify-center border border-white/15 transition-colors hover:border-paper">
                  <Icon name={s.icon} size={17} />
                </a>
              ) : (
                <span key={s.label} role="img" aria-label={`${s.label} (link to be supplied)`} className="flex h-11 w-11 items-center justify-center border border-white/10 text-paper/45">
                  <Icon name={s.icon} size={17} />
                </span>
              ),
            )}
          </div>
        </div>

        <div className="col-span-4 sm:col-span-8 lg:col-span-6 lg:col-start-7">
          <div className="relative border border-white/10 bg-navy-950/60 p-6 backdrop-blur-sm sm:p-10 lg:p-12">
            <span aria-hidden className="absolute -top-px left-0 h-px w-24 bg-yellow-400" />
            <EnquiryForm industries={content.industries} />
          </div>
        </div>
      </div>
    </section>
  );
}
