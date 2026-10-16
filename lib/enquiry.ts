/**
 * Enquiry form — shared by the client form and the /api/enquiry route handler, so the rules
 * the visitor sees are the rules the server enforces.
 */
export type Intent = "lease" | "visit";

export type EnquiryValues = {
  name: string;
  company: string;
  email: string;
  phone: string;
  industry: string;
  requirement: string;
  visitDate: string;
  consent: boolean;
  website: string; // honeypot — must stay empty
};

export type EnquiryErrors = Partial<Record<keyof EnquiryValues, string>>;

export const INDUSTRIES = ["FMCG", "E-commerce", "Retail", "Automotive", "Pharma", "Logistics", "Others"];

export function validateEnquiry(v: EnquiryValues, intent: Intent): EnquiryErrors {
  const e: EnquiryErrors = {};
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

/** What is forwarded to the destination (CRM / email / automation webhook). */
export type EnquiryPayload = {
  intent: Intent;
  name: string;
  company: string;
  email: string;
  phone: string;
  industry: string;
  requirement: string;
  visitDate: string | null;
  consent: true;
  submittedAt: string;
  source: string;
};
