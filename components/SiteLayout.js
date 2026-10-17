import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { Download, Mail, Menu, Phone, X } from "lucide-react";
import siteConfig from "@/lib/siteConfig";
import { categoryList } from "@/lib/categories";
import { categoryPath, whatsappHref } from "@/lib/catalog";
import { trackEvent } from "@/lib/track";
import { WhatsAppIcon } from "@/components/Icons";

const { business, catalogue } = siteConfig;
const whatsappGreeting = whatsappHref(
  "Hello Visto, I'd like to know more about your products.",
);

export function Brand() {
  return (
    <span className="brand">
      <Image src="/vh-logo.png" alt="" width={49} height={50} />
      <span>
        VISTO<small>HOMEWARE</small>
      </span>
    </span>
  );
}

export function CatalogueLink({ className = "text-link", children }) {
  return (
    <a
      className={className}
      href={catalogue.href}
      target="_blank"
      rel="noopener"
      onClick={() => trackEvent("catalogue_download")}
    >
      {children || (
        <>
          Download catalogue <Download size={17} />
        </>
      )}
    </a>
  );
}

function ContactStrip() {
  return (
    <section className="contact-strip wrap" aria-labelledby="contact-strip">
      <h2 id="contact-strip">Product & wholesale enquiries</h2>
      <div className="contact-actions">
        <a
          href={whatsappGreeting}
          target="_blank"
          rel="noopener"
          onClick={() => trackEvent("whatsapp_click", { from: "strip" })}
        >
          <WhatsAppIcon />
          <span>
            WhatsApp<strong>{business.phoneDisplay}</strong>
          </span>
        </a>
        <a href={`tel:${business.telephone}`}>
          <Phone size={20} />
          <span>
            Call<strong>{business.phoneDisplay}</strong>
          </span>
        </a>
        <a href={`mailto:${business.email}`}>
          <Mail size={20} />
          <span>
            Email<strong>{business.email}</strong>
          </span>
        </a>
        <Link className="button button-red" href="/contact">
          Get a quote
        </Link>
      </div>
    </section>
  );
}

const links = [
  ["/products", "Products"],
  ["/gallery", "Gallery"],
  ["/contact", "Contact"],
];

export default function SiteLayout({ children }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const close = () => setOpen(false);
  return (
    <div className="site-shell">
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="site-header">
        <div className="nav-inner wrap">
          <Link href="/" aria-label="Visto Homeware home" onClick={close}>
            <Brand />
          </Link>
          <nav
            id="main-nav"
            aria-label="Main navigation"
            className={open ? "main-nav is-open" : "main-nav"}
          >
            {links.map(([href, label]) => (
              <Link
                key={href}
                href={href}
                onClick={close}
                aria-current={
                  router.pathname === href ||
                  (href === "/products" && router.pathname.startsWith(href))
                    ? "page"
                    : undefined
                }
              >
                {label}
              </Link>
            ))}
            <CatalogueLink className="nav-catalogue" />
          </nav>
          <Link className="button button-outline nav-cta" href="/contact" onClick={close}>
            Get a quote
          </Link>
          <button
            className="menu-toggle"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-controls="main-nav"
            aria-expanded={open}
            onClick={() => setOpen(!open)}
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </header>
      <main id="main">{children}</main>
      {router.pathname !== "/contact" && <ContactStrip />}
      <footer className="site-footer">
        <div className="footer-top wrap">
          <div className="footer-brand">
            <Link href="/" aria-label="Visto Homeware home">
              <Brand />
            </Link>
            <address>
              {business.streetAddress}
              <br />
              {business.addressLocality} {business.postalCode},{" "}
              {business.addressRegion}
            </address>
            <p>GSTIN {business.gstin}</p>
          </div>
          <nav aria-label="Product categories">
            <h2>Products</h2>
            {categoryList.map((c) => (
              <Link key={c.id} href={categoryPath(c.id)}>
                {c.name}
              </Link>
            ))}
          </nav>
          <nav aria-label="Visto Homeware">
            <h2>Visto</h2>
            <Link href="/products">All products</Link>
            <Link href="/gallery">Gallery</Link>
            <Link href="/contact">Contact</Link>
            <CatalogueLink className="" />
          </nav>
          <div>
            <h2>Contact</h2>
            <a href={`tel:${business.telephone}`}>{business.phoneDisplay}</a>
            <a href={`mailto:${business.email}`}>{business.email}</a>
            <a href={whatsappGreeting} target="_blank" rel="noopener">
              WhatsApp
            </a>
          </div>
        </div>
        <div className="footer-bottom wrap">
          © {new Date().getFullYear()} Visto Homeware. All rights reserved.
        </div>
      </footer>
      <a
        className="whatsapp-float"
        href={whatsappGreeting}
        target="_blank"
        rel="noopener"
        aria-label="Chat with Visto Homeware on WhatsApp"
        onClick={() => trackEvent("whatsapp_click", { from: "float" })}
      >
        <WhatsAppIcon size={28} />
      </a>
    </div>
  );
}
