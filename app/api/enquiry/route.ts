import { INDUSTRIES, validateEnquiry, type EnquiryPayload, type EnquiryValues, type Intent } from "@/lib/enquiry";

/**
 * POST /api/enquiry — validates the lease / site-visit enquiry on the server and forwards it
 * to ENQUIRY_WEBHOOK_URL (any CRM, email-relay or automation webhook that accepts JSON).
 *
 * - No ENQUIRY_WEBHOOK_URL in development: logs the enquiry and answers `delivered: false`.
 * - No ENQUIRY_WEBHOOK_URL in production: answers 503, so a missing destination is never
 *   mistaken for a sent enquiry. The destination is a pending client decision (HANDOVER §5).
 */
const MAX_BODY = 8_000;
const text = (x: unknown, max: number) => (typeof x === "string" ? x.trim().slice(0, max) : "");

export async function POST(request: Request) {
  const raw = await request.text();
  if (raw.length > MAX_BODY) return Response.json({ ok: false, error: "too_large" }, { status: 413 });

  let body: Record<string, unknown>;
  try {
    body = JSON.parse(raw);
  } catch {
    return Response.json({ ok: false, error: "bad_request" }, { status: 400 });
  }

  const intent: Intent = body.intent === "visit" ? "visit" : "lease";
  const values: EnquiryValues = {
    name: text(body.name, 120),
    company: text(body.company, 160),
    email: text(body.email, 200),
    phone: text(body.phone, 30),
    industry: text(body.industry, 40),
    requirement: text(body.requirement, 2000),
    visitDate: text(body.visitDate, 20),
    consent: body.consent === true,
    website: text(body.website, 100),
  };

  // Honeypot: pretend success so bots learn nothing
  if (values.website) return Response.json({ ok: true, delivered: true });

  const errors = validateEnquiry(values, intent);
  if (!INDUSTRIES.includes(values.industry)) errors.industry = "Please select your industry.";
  if (Object.keys(errors).length) return Response.json({ ok: false, error: "invalid", fields: errors }, { status: 422 });

  const payload: EnquiryPayload = {
    intent,
    name: values.name,
    company: values.company,
    email: values.email,
    phone: `+91 ${values.phone}`,
    industry: values.industry,
    requirement: values.requirement,
    visitDate: intent === "visit" ? values.visitDate : null,
    consent: true,
    submittedAt: new Date().toISOString(),
    source: "pathlogicity.com",
  };

  const url = process.env.ENQUIRY_WEBHOOK_URL;
  if (!url) {
    if (process.env.NODE_ENV === "production") return Response.json({ ok: false, error: "not_configured" }, { status: 503 });
    console.info("[enquiry] ENQUIRY_WEBHOOK_URL not set — not delivered:", payload);
    return Response.json({ ok: true, delivered: false });
  }

  try {
    const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload), signal: AbortSignal.timeout(10_000) });
    if (!res.ok) return Response.json({ ok: false, error: "upstream" }, { status: 502 });
  } catch {
    return Response.json({ ok: false, error: "upstream" }, { status: 502 });
  }
  return Response.json({ ok: true, delivered: true });
}
