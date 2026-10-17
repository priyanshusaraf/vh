import siteConfig from "@/lib/siteConfig";
import {
  ENQUIRY_TYPES,
  emptyEnquiry,
  enquirySummary,
  enquiryTypeLabel,
  validateEnquiry,
} from "@/lib/enquiry";

export const config = { api: { bodyParser: { sizeLimit: "16kb" } } };

const LIMITS = {
  name: 100,
  phone: 30,
  email: 200,
  product: 200,
  quantity: 100,
  message: 4000,
};

// Emails contact-form enquiries through Resend (https://resend.com).
// Needs RESEND_API_KEY; CONTACT_TO_EMAIL (comma-separated) defaults to the
// business email, and CONTACT_FROM_EMAIL to Resend's shared test sender,
// which can only deliver to the address that owns the Resend account.
export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "method_not_allowed" });
  }
  const body = req.body && typeof req.body === "object" ? req.body : {};

  // Bots fill the hidden "website" field; accept and drop their submissions.
  if (typeof body.website === "string" && body.website.trim())
    return res.status(200).json({ ok: true });

  const enquiry = { ...emptyEnquiry };
  for (const [field, max] of Object.entries(LIMITS))
    if (typeof body[field] === "string")
      enquiry[field] = body[field].slice(0, max);
  if (ENQUIRY_TYPES.some(([id]) => id === body.type)) enquiry.type = body.type;

  const fields = validateEnquiry(enquiry);
  if (Object.keys(fields).length)
    return res.status(400).json({ error: "invalid", fields });

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return res.status(503).json({ error: "not_configured" });

  const name = enquiry.name.replace(/\s+/g, " ").trim();
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from:
        process.env.CONTACT_FROM_EMAIL ||
        "Visto Homeware website <onboarding@resend.dev>",
      to: (process.env.CONTACT_TO_EMAIL || siteConfig.business.email)
        .split(",")
        .map((address) => address.trim()),
      subject: `${enquiryTypeLabel(enquiry.type)}: enquiry from ${name}`,
      text: enquirySummary(enquiry),
      ...(enquiry.email.trim() && { reply_to: enquiry.email.trim() }),
    }),
  }).catch((error) => ({ ok: false, status: 0, text: async () => String(error) }));

  if (!response.ok) {
    console.error("Contact email failed", response.status, await response.text());
    return res.status(502).json({ error: "send_failed" });
  }
  return res.status(200).json({ ok: true });
}
