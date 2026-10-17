// Contact form fields, validation and the plain-text summary used for the
// email, shared by the contact page and /api/contact.
export const ENQUIRY_TYPES = [
  ["retail", "Buying for my home"],
  ["wholesale", "Wholesale or bulk order"],
  ["other", "Something else"],
];

export const enquiryTypeLabel = (type) =>
  (ENQUIRY_TYPES.find(([id]) => id === type) || ENQUIRY_TYPES[2])[1];

export const emptyEnquiry = {
  name: "",
  phone: "",
  email: "",
  type: "retail",
  product: "",
  quantity: "",
  message: "",
};

export function validateEnquiry(d) {
  const errors = {};
  if (d.name.trim().length < 2) errors.name = "Enter your name.";
  const digits = d.phone.replace(/\D/g, "");
  if (digits.length < 10 || digits.length > 13)
    errors.phone =
      "Enter a 10-digit mobile number, with the country code if you're outside India.";
  if (d.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email.trim()))
    errors.email = "Enter a valid email address, or leave it blank.";
  if (d.message.trim().length < 5)
    errors.message = "Tell us which products you need and anything else we should know.";
  return errors;
}

export function enquirySummary(d) {
  const details = [
    ["Name", d.name],
    ["Phone", d.phone],
    ["Email", d.email],
    ["Enquiry", enquiryTypeLabel(d.type)],
    ["Product", d.product],
    ["Quantity", d.quantity],
  ]
    .filter(([, value]) => value.trim())
    .map(([label, value]) => `${label}: ${value.trim()}`);
  return [d.message.trim(), "", ...details].join("\n");
}
