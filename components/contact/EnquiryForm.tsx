"use client";

import { useEffect, useId, useRef, useState, type FormEvent, type ReactNode } from "react";
import { Icon } from "@/components/ui/Icon";
import { Magnetic } from "@/components/ui/Magnetic";

type Intent = "lease" | "visit";
type Values = {
  name: string;
  company: string;
  email: string;
  phone: string;
  industry: string;
  requirement: string;
  visitDate: string;
  consent: boolean;
  website: string; // honeypot
};
type Errors = Partial<Record<keyof Values, string>>;

const EMPTY: Values = { name: "", company: "", email: "", phone: "", industry: "", requirement: "", visitDate: "", consent: false, website: "" };

function validate(v: Values, intent: Intent): Errors {
  const e: Errors = {};
  if (!v.name.trim()) e.name = "Please enter your name.";
  if (!v.company.trim()) e.company = "Please enter your company.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email.trim())) e.email = "Please enter a valid work email.";
  const digits = v.phone.replace(/\D/g, "");
  if (digits.length < 8 || digits.length > 15) e.phone = "Please enter a valid phone number.";
  if (!v.industry) e.industry = "Please select your industry.";
  if (v.requirement.trim().length < 5) e.requirement = "Tell us briefly what you need.";
  if (intent === "visit" && !v.visitDate) e.visitDate = "Please choose a preferred date.";
  if (!v.consent) e.consent = "Please confirm we may contact you.";
  return e;
}

export function EnquiryForm({ industries }: { industries: string[] }) {
  const [intent, setIntent] = useState<Intent>("lease");
  const [v, setV] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [state, setState] = useState<"idle" | "sending" | "done">("idle");
  const form = useRef<HTMLFormElement>(null);
  const uid = useId();

  // Deep links: #enquire?intent=visit or ?intent=visit preselect the toggle
  useEffect(() => {
    const read = () => {
      const q = new URLSearchParams(location.search || location.hash.split("?")[1] || "");
      if (q.get("intent") === "visit") setIntent("visit");
    };
    read();
    window.addEventListener("hashchange", read);
    return () => window.removeEventListener("hashchange", read);
  }, []);

  const set = <K extends keyof Values>(k: K, val: Values[K]) => {
    setV((s) => ({ ...s, [k]: val }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }));
  };
  const blur = (k: keyof Values) => {
    const e = validate(v, intent);
    setErrors((s) => ({ ...s, [k]: e[k] }));
  };

  const submit = async (ev: FormEvent) => {
    ev.preventDefault();
    if (v.website) return; // bot
    const e = validate(v, intent);
    setErrors(e);
    const first = Object.keys(e)[0];
    if (first) {
      form.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    setState("sending");
    // TODO: connect to CRM / email endpoint (decision pending — docs/UI-PLAN.md §12).
    await new Promise((r) => setTimeout(r, 900));
    setState("done");
  };

  if (state === "done") {
    return (
      <div role="status" className="flex min-h-[420px] flex-col justify-center border-t border-ink/15 pt-10">
        <div className="flex items-center gap-4">
          <span className="flex h-14 w-14 items-center justify-center border border-green-500 text-green-500">
            <Icon name="check" size={26} draw className="is-drawing" />
          </span>
          <p className="t-label text-green-700">{intent === "visit" ? "Site visit request received" : "Enquiry received"}</p>
        </div>
        <p className="t-l mt-8 max-w-[14ch] text-ink">Thank you, {v.name.split(" ")[0]}.</p>
        <p className="t-micro mt-6 max-w-[46ch] normal-case tracking-[0.03em] text-steel-500">
          [ Next-steps copy to be supplied by the leasing team ] · Demo build — this submission was not sent anywhere.
        </p>
        <button type="button" onClick={() => { setV(EMPTY); setState("idle"); }} className="t-label mt-10 self-start text-indigo-700 underline-offset-4 hover:underline">
          Send another enquiry
        </button>
      </div>
    );
  }

  const errId = (k: string) => `${uid}-${k}-err`;

  return (
    <form ref={form} onSubmit={submit} noValidate aria-describedby={`${uid}-req`}>
      {/* Intent toggle — one form, both brief CTAs */}
      <fieldset>
        <legend className="t-micro mb-3 text-steel-500">I want to</legend>
        <div className="relative grid grid-cols-2 border border-ink/15 bg-porcelain p-1">
          <span
            aria-hidden
            className="absolute bottom-1 top-1 w-[calc(50%-4px)] bg-indigo-700 transition-transform duration-500 ease-[var(--ease-out-expo)]"
            style={{ transform: intent === "visit" ? "translateX(calc(100% + 0px))" : "translateX(0)", left: 4 }}
          />
          {(["lease", "visit"] as const).map((k) => (
            <label key={k} className="relative z-10 cursor-pointer">
              <input type="radio" name="intent" value={k} checked={intent === k} onChange={() => setIntent(k)} className="peer sr-only" />
              <span
                className={`flex h-11 items-center justify-center text-[0.875rem] font-bold transition-colors duration-300 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-indigo-700 ${
                  intent === k ? "text-paper" : "text-steel-700"
                }`}
              >
                {k === "lease" ? "Lease space" : "Plan a site visit"}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <p id={`${uid}-req`} className="t-micro mt-6 text-steel-500">
        All fields required
      </p>

      <div className="mt-4 grid gap-x-8 gap-y-7 sm:grid-cols-2">
        <Field label="Name" name="name" id={uid} error={errors.name}>
          <input id={`${uid}-name`} name="name" autoComplete="name" value={v.name} onChange={(e) => set("name", e.target.value)} onBlur={() => blur("name")} aria-invalid={!!errors.name} aria-describedby={errors.name ? errId("name") : undefined} className={inputCls} />
        </Field>
        <Field label="Company" name="company" id={uid} error={errors.company}>
          <input id={`${uid}-company`} name="company" autoComplete="organization" value={v.company} onChange={(e) => set("company", e.target.value)} onBlur={() => blur("company")} aria-invalid={!!errors.company} aria-describedby={errors.company ? errId("company") : undefined} className={inputCls} />
        </Field>
        <Field label="Email" name="email" id={uid} error={errors.email}>
          <input id={`${uid}-email`} name="email" type="email" autoComplete="email" inputMode="email" value={v.email} onChange={(e) => set("email", e.target.value)} onBlur={() => blur("email")} aria-invalid={!!errors.email} aria-describedby={errors.email ? errId("email") : undefined} className={inputCls} />
        </Field>
        <Field label="Phone number" name="phone" id={uid} error={errors.phone}>
          <div className="flex items-end">
            <span className="mb-[11px] mr-3 text-[0.9375rem] font-semibold text-steel-500" aria-hidden>
              +91
            </span>
            <input id={`${uid}-phone`} name="phone" type="tel" autoComplete="tel-national" inputMode="tel" value={v.phone} onChange={(e) => set("phone", e.target.value)} onBlur={() => blur("phone")} aria-invalid={!!errors.phone} aria-describedby={errors.phone ? errId("phone") : undefined} className={inputCls} />
          </div>
        </Field>
      </div>

      <fieldset className="mt-8" aria-describedby={errors.industry ? errId("industry") : undefined}>
        <legend className="t-micro text-steel-500">Industry</legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {industries.map((ind) => (
            <label key={ind} className="cursor-pointer">
              <input type="radio" name="industry" value={ind} checked={v.industry === ind} onChange={() => set("industry", ind)} className="peer sr-only" />
              <span
                className={`flex h-11 items-center border px-4 text-[0.875rem] font-semibold transition-colors duration-200 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-indigo-700 ${
                  v.industry === ind ? "border-yellow-400 bg-yellow-400 text-ink" : "border-ink/15 text-ink/80 hover:border-ink/40"
                }`}
              >
                {ind}
              </span>
            </label>
          ))}
        </div>
        {errors.industry ? <ErrorText id={errId("industry")}>{errors.industry}</ErrorText> : null}
      </fieldset>

      {intent === "visit" ? (
        <div className="mt-8 sm:w-1/2">
          <Field label="Preferred visit date" name="visitDate" id={uid} error={errors.visitDate}>
            <input id={`${uid}-visitDate`} name="visitDate" type="date" value={v.visitDate} onChange={(e) => set("visitDate", e.target.value)} onBlur={() => blur("visitDate")} aria-invalid={!!errors.visitDate} aria-describedby={errors.visitDate ? errId("visitDate") : undefined} className={`${inputCls} [color-scheme:light]`} />
          </Field>
        </div>
      ) : null}

      <div className="mt-8">
        <Field label="Requirement" name="requirement" id={uid} error={errors.requirement}>
          <textarea id={`${uid}-requirement`} name="requirement" rows={3} value={v.requirement} onChange={(e) => set("requirement", e.target.value)} onBlur={() => blur("requirement")} aria-invalid={!!errors.requirement} aria-describedby={errors.requirement ? errId("requirement") : undefined} placeholder="Space, timeline, operations…" className={`${inputCls} resize-none py-3 placeholder:text-steel-500/70`} />
        </Field>
      </div>

      {/* honeypot */}
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Website <input tabIndex={-1} name="website" value={v.website} onChange={(e) => set("website", e.target.value)} autoComplete="off" />
        </label>
      </div>

      <div className="mt-7">
        <label className="flex cursor-pointer items-start gap-3">
          <input type="checkbox" name="consent" checked={v.consent} onChange={(e) => set("consent", e.target.checked)} aria-invalid={!!errors.consent} aria-describedby={errors.consent ? errId("consent") : undefined} className="peer sr-only" />
          <span aria-hidden className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center border transition-colors peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-indigo-700 ${v.consent ? "border-yellow-400 bg-yellow-400 text-ink" : "border-ink/30 bg-paper"}`}>
            {v.consent ? <Icon name="check" size={14} strokeWidth={2} /> : null}
          </span>
          <span className="text-sm leading-relaxed text-steel-700">
            I agree to be contacted by the Path Logicity leasing team about this enquiry.{" "}
            <span className="slot-annotation t-micro text-steel-500">[ Privacy notice link & consent wording — client legal ]</span>
          </span>
        </label>
        {errors.consent ? <ErrorText id={errId("consent")}>{errors.consent}</ErrorText> : null}
      </div>

      {/* The route arrives at the destination: the submit button */}
      <div className="mt-10 flex items-center gap-0">
        <span aria-hidden className="relative hidden h-px flex-1 bg-ink/15 sm:block">
          <span className="route-arrive absolute inset-y-0 left-0 w-full origin-left bg-gradient-to-r from-transparent via-indigo-700/40 to-yellow-400" />
          <span className="absolute -right-[3px] -top-[3px] h-1.5 w-1.5 rounded-full bg-yellow-400 shadow-[0_0_0_6px_rgb(231_172_0/0.16)]" />
        </span>
        <Magnetic>
        <button
          type="submit"
          disabled={state === "sending"}
          className="group relative inline-flex h-14 w-full items-center justify-center gap-3 overflow-hidden bg-yellow-400 px-7 text-[0.875rem] font-bold uppercase tracking-[0.05em] text-ink disabled:opacity-70 sm:w-auto"
        >
          <span aria-hidden className="absolute inset-0 origin-left scale-x-0 bg-indigo-700 transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:scale-x-100" />
          <span data-magnetic-inner className="relative z-10 inline-flex items-center gap-3 transition-colors duration-300 group-hover:text-paper">
            {state === "sending" ? "Sending…" : intent === "visit" ? "Plan a site visit" : "Submit lease enquiry"}
            <Icon name="arrow-right" size={18} className="arrow-nudge" />
          </span>
        </button>
        </Magnetic>
      </div>
      <p className="sr-only" aria-live="polite">
        {state === "sending" ? "Sending your enquiry" : ""}
      </p>
    </form>
  );
}

const inputCls =
  "block h-11 w-full border-0 border-b border-ink/25 bg-transparent px-0 text-[1.0625rem] text-ink outline-none transition-colors duration-300 focus:border-indigo-700 aria-[invalid=true]:border-[#c62828] focus-visible:outline-none";

function Field({ label, name, id, error, children }: { label: string; name: string; id: string; error?: string; children: ReactNode }) {
  return (
    <div>
      <label htmlFor={`${id}-${name}`} className="t-micro block text-steel-500">
        {label}
      </label>
      <div className="mt-1">{children}</div>
      {error ? <ErrorText id={`${id}-${name}-err`}>{error}</ErrorText> : null}
    </div>
  );
}

function ErrorText({ id, children }: { id: string; children: ReactNode }) {
  return (
    <p id={id} className="mt-2 flex items-center gap-2 text-[0.8125rem] font-semibold text-[#c62828]">
      <span aria-hidden className="inline-block h-1.5 w-1.5 rotate-45 bg-[#c62828]" />
      {children}
    </p>
  );
}
