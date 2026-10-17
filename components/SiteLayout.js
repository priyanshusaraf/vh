import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import {
  ArrowUpRight,
  ArrowRight,
  Download,
  Menu,
  X,
  Mail,
  Phone,
} from "lucide-react";
import siteConfig from "@/lib/siteConfig";

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
export function Contact() {
  return (
    <section className="contact-section wrap" id="contact">
      <div>
        <h2>Product & wholesale enquiries</h2>
        <p>Contact our team for pricing, availability and bulk orders.</p>
      </div>
      <div className="contact-links">
        <a href={`mailto:${siteConfig.business.email}`}>
          <Mail size={21} />
          <span>
            <small>WRITE TO US</small>
            {siteConfig.business.email}
          </span>
          <ArrowUpRight />
        </a>
        <a href={`tel:${siteConfig.business.telephone}`}>
          <Phone size={21} />
          <span>
            <small>GIVE US A CALL</small>+91 98310 33736
          </span>
          <ArrowUpRight />
        </a>
        <p>
          1/2, Chanditala Branch Road, Kolkata 700053
          <br />
          West Bengal, India
        </p>
      </div>
    </section>
  );
}
export default function SiteLayout({ children, className = "" }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const links = [
    ["/products", "Our products"],
    ["/gallery", "In everyday life"],
    ["/#about", "Our story"],
  ];
  return (
    <div className={`site-shell ${className}`}>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <div className="announcement">
        Thoughtfully made. Happily used.{" "}
        <span>Homeware for your every day.</span>
        <a href="/catalogue.pdf" target="_blank" rel="noreferrer">
          Explore the catalogue <ArrowUpRight size={13} />
        </a>
      </div>
      <header className="site-header">
        <div className="nav-inner wrap">
          <Link
            href="/"
            aria-label="Visto Homeware home"
            onClick={() => setOpen(false)}
          >
            <Brand />
          </Link>
          <nav
            aria-label="Main navigation"
            className={open ? "main-nav is-open" : "main-nav"}
          >
            {links.map(([href, label]) => (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                aria-current={router.pathname === href ? "page" : undefined}
              >
                {label}
              </Link>
            ))}
          </nav>
          <Link
            className="nav-contact"
            href="/#contact"
            onClick={() => setOpen(false)}
          >
            Get in touch <ArrowUpRight size={17} />
          </Link>
          <button
            className="menu-toggle"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen(!open)}
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </header>
      <main id="main">{children}</main>
      <Contact />
      <footer>
        <div className="footer-top wrap">
          <div>
            <Link href="/" aria-label="Visto Homeware home">
              <Brand />
            </Link>
            <p>Kitchen, dining & home essentials.</p>
          </div>
          <div>
            <span className="eyebrow">EXPLORE</span>
            <Link href="/products">All products</Link>
            <Link href="/gallery">Product gallery</Link>
            <Link href="/#about">Our story</Link>
          </div>
          <div>
            <span className="eyebrow">MAKE YOURSELF AT HOME</span>
            <Link href="/#contact">
              Contact us <ArrowUpRight size={14} />
            </Link>
            <a href="/catalogue.pdf" target="_blank" rel="noreferrer">
              Download catalogue <Download size={14} />
            </a>
            <a href="mailto:smplastics@gmail.com">
              Retail & wholesale enquiries <ArrowRight size={14} />
            </a>
          </div>
        </div>
        <div className="footer-bottom wrap">
          <span>
            © {new Date().getFullYear()} Visto Homeware. All rights reserved.
          </span>
          <span>Kolkata, West Bengal, India.</span>
        </div>
      </footer>
    </div>
  );
}
