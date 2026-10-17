import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { Mail, MapPin, Phone } from "lucide-react";
import SiteLayout from "@/components/SiteLayout";
import Seo, { JsonLd } from "@/components/Seo";
import { WhatsAppIcon } from "@/components/Icons";
import { products } from "@/data/products";
import siteConfig from "@/lib/siteConfig";
import { trackEvent } from "@/lib/track";
import { whatsappHref } from "@/lib/catalog";
import {
  ENQUIRY_TYPES,
  emptyEnquiry,
  enquirySummary,
  enquiryTypeLabel,
  validateEnquiry,
} from "@/lib/enquiry";

const { business } = siteConfig;

// Product names keyed by id, so ?product=<id> links can prefill the form.
export function getStaticProps() {
  return {
    props: {
      productNames: Object.fromEntries(products.map((p) => [p.id, p.name])),
    },
  };
}

function Field({ id, label, error, optional, children }) {
  return (
    <div className={error ? "field has-error" : "field"}>
      <label htmlFor={id}>
        {label}
        {optional && <span> (optional)</span>}
      </label>
      {children}
      {error && (
        <p className="field-error" id={`${id}-error`}>
          {error}
        </p>
      )}
    </div>
  );
}

function EnquiryForm({ productNames }) {
  const router = useRouter();
  const [form, setForm] = useState(emptyEnquiry);
  const [website, setWebsite] = useState("");
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle");
  const result = useRef(null);

  // The confirmation replaces the form, so bring it into view.
  useEffect(() => {
    if (status === "sent") result.current?.focus();
  }, [status]);

  useEffect(() => {
    if (!router.isReady) return;
    const { product, type } = router.query;
    setForm((f) => ({
      ...f,
      ...(productNames[product] && {
        product: productNames[product],
        message: f.message || `I'd like the price and availability of ${productNames[product]}.`,
      }),
      ...(ENQUIRY_TYPES.some(([id]) => id === type) && { type }),
    }));
  }, [router.isReady, router.query, productNames]);

  const set = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    if (errors[field]) setErrors((x) => ({ ...x, [field]: undefined }));
  };
  const describedBy = (field) => (errors[field] ? `${field}-error` : undefined);

  async function submit(e) {
    e.preventDefault();
    const found = validateEnquiry(form);
    setErrors(found);
    if (Object.keys(found).length) {
      document.getElementById(Object.keys(found)[0])?.focus();
      return;
    }
    setStatus("sending");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, website }),
      });
      if (response.ok) {
        setStatus("sent");
        trackEvent("enquiry_sent", { type: form.type });
        return;
      }
      const body = await response.json().catch(() => ({}));
      if (body.fields) {
        setErrors(body.fields);
        setStatus("idle");
        return;
      }
      setStatus("failed");
    } catch {
      setStatus("failed");
    }
  }

  if (status === "sent")
    return (
      <div className="form-result" role="status" ref={result} tabIndex={-1}>
        <h2>Enquiry sent</h2>
        <p>
          Thanks, {form.name.trim().split(" ")[0]}. Visto will reply on{" "}
          {form.phone.trim()}
          {form.email.trim() && ` or ${form.email.trim()}`}.
        </p>
        <button
          className="button button-outline"
          onClick={() => {
            setForm(emptyEnquiry);
            setStatus("idle");
          }}
        >
          Send another enquiry
        </button>
      </div>
    );

  const summary = enquirySummary(form);
  return (
    <form className="enquiry-form" onSubmit={submit} noValidate>
      <div className="field-row">
        <Field id="name" label="Name" error={errors.name}>
          <input
            id="name"
            autoComplete="name"
            value={form.name}
            onChange={set("name")}
            aria-invalid={!!errors.name}
            aria-describedby={describedBy("name")}
          />
        </Field>
        <Field id="phone" label="Mobile number" error={errors.phone}>
          <input
            id="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            value={form.phone}
            onChange={set("phone")}
            aria-invalid={!!errors.phone}
            aria-describedby={describedBy("phone")}
          />
        </Field>
      </div>
      <Field id="email" label="Email" optional error={errors.email}>
        <input
          id="email"
          type="email"
          autoComplete="email"
          value={form.email}
          onChange={set("email")}
          aria-invalid={!!errors.email}
          aria-describedby={describedBy("email")}
        />
      </Field>
      <fieldset className="type-options">
        <legend>What's this about?</legend>
        {ENQUIRY_TYPES.map(([id, label]) => (
          <label key={id} className={form.type === id ? "selected" : ""}>
            <input
              type="radio"
              name="type"
              value={id}
              checked={form.type === id}
              onChange={set("type")}
            />
            {label}
          </label>
        ))}
      </fieldset>
      <div className="field-row">
        <Field id="product" label="Product" optional>
          <input
            id="product"
            list="product-names"
            value={form.product}
            onChange={set("product")}
          />
          <datalist id="product-names">
            {Object.values(productNames).map((name) => (
              <option key={name} value={name} />
            ))}
          </datalist>
        </Field>
        <Field id="quantity" label="Quantity" optional>
          <input
            id="quantity"
            inputMode="numeric"
            value={form.quantity}
            onChange={set("quantity")}
          />
        </Field>
      </div>
      <Field id="message" label="Message" error={errors.message}>
        <textarea
          id="message"
          rows={5}
          value={form.message}
          onChange={set("message")}
          aria-invalid={!!errors.message}
          aria-describedby={describedBy("message")}
        />
      </Field>
      {/* Hidden from people; bots that fill it in are ignored. */}
      <div className="honeypot" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input
          id="website"
          tabIndex={-1}
          autoComplete="off"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
        />
      </div>
      {status === "failed" && (
        <div className="form-failed" role="alert">
          <p>
            Your enquiry couldn't be sent from this form. Send it on WhatsApp
            or by email instead; your message is already filled in.
          </p>
          <div>
            <a
              className="button button-red"
              href={whatsappHref(`Hello Visto,\n\n${summary}`)}
              target="_blank"
              rel="noopener"
            >
              <WhatsAppIcon /> Send on WhatsApp
            </a>
            <a
              className="button button-outline"
              href={`mailto:${business.email}?subject=${encodeURIComponent(
                `${enquiryTypeLabel(form.type)}: enquiry from ${form.name.trim()}`,
              )}&body=${encodeURIComponent(summary)}`}
            >
              <Mail size={18} /> Send by email
            </a>
          </div>
        </div>
      )}
      <button
        className="button button-red submit-button"
        type="submit"
        disabled={status === "sending"}
      >
        {status === "sending" ? "Sending…" : "Send enquiry"}
      </button>
    </form>
  );
}

export default function Contact({ productNames }) {
  return (
    <SiteLayout>
      <Seo
        title="Contact Visto Homeware | Kolkata"
        description="Contact Visto Homeware in Kolkata for prices, stock and wholesale orders of food containers, lunch boxes, water bottles and household products. WhatsApp or call +91 98310 33736."
        path="/contact"
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          name: siteConfig.brand,
          url: siteConfig.baseUrl,
          image: siteConfig.ogImage,
          logo: siteConfig.baseUrl + "/icon-512.png",
          telephone: business.telephone,
          email: business.email,
          taxID: business.gstin,
          address: {
            "@type": "PostalAddress",
            streetAddress: business.streetAddress,
            addressLocality: business.addressLocality,
            addressRegion: business.addressRegion,
            postalCode: business.postalCode,
            addressCountry: business.addressCountry,
          },
          geo: {
            "@type": "GeoCoordinates",
            latitude: business.latitude,
            longitude: business.longitude,
          },
          hasMap: business.mapsUrl,
        }}
      />
      <div className="contact-page wrap">
        <h1>Contact Visto Homeware</h1>
        <div className="contact-layout">
          <EnquiryForm productNames={productNames} />
          <aside className="contact-direct" aria-label="Other ways to reach us">
            <a
              href={whatsappHref("Hello Visto, I'd like to know more about your products.")}
              target="_blank"
              rel="noopener"
              onClick={() => trackEvent("whatsapp_click", { from: "contact" })}
            >
              <WhatsAppIcon size={22} />
              <span>
                WhatsApp<strong>{business.phoneDisplay}</strong>
              </span>
            </a>
            <a href={`tel:${business.telephone}`}>
              <Phone size={22} />
              <span>
                Call<strong>{business.phoneDisplay}</strong>
              </span>
            </a>
            <a href={`mailto:${business.email}`}>
              <Mail size={22} />
              <span>
                Email<strong>{business.email}</strong>
              </span>
            </a>
            <a href={business.mapsUrl} target="_blank" rel="noopener">
              <MapPin size={22} />
              <span>
                Visit
                <strong>
                  {business.streetAddress}, {business.addressLocality}{" "}
                  {business.postalCode}
                </strong>
              </span>
            </a>
            <p>GSTIN {business.gstin}</p>
          </aside>
        </div>
        <iframe
          className="contact-map"
          title="Map showing Visto Homeware on Chanditala Branch Road, Kolkata"
          src={business.mapEmbed}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </SiteLayout>
  );
}
