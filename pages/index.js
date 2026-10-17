import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Download } from "lucide-react";
import Seo, { JsonLd } from "@/components/Seo";
import SiteLayout, { CatalogueLink } from "@/components/SiteLayout";
import ProductCard from "@/components/ProductCard";
import { products, categories } from "@/data/products";
import siteConfig from "@/lib/siteConfig";
import { categoryPath, productPath } from "@/lib/catalog";

const HERO_PRODUCT = "g-12";
const FEATURED = ["g-7", "g-15", "cs-1", "wa-16"];
const collections = [
  { id: "containers", name: "Kitchen & storage", img: "/new-products/G-16.jpg" },
  { id: "lunch-boxes", name: "Lunch boxes & tiffins", img: "/new-products/T-5.png" },
  { id: "water-bottles", name: "Bottles & hydration", img: "/new-products/WA-16.png" },
  { id: "casseroles", name: "Serveware & casseroles", img: "/new-products/CS-2.jpeg" },
];

// Only the handful of products shown here are sent to the page, rather than
// bundling the whole catalogue into the homepage.
export function getStaticProps() {
  const card = ({ id, name, category, size, img }) => ({
    id,
    name,
    category,
    img,
    ...(size && { size }),
  });
  const hero = products.find((p) => p.id === HERO_PRODUCT);
  return {
    props: {
      total: products.length,
      categoryCount: categories.length,
      hero: { href: productPath(hero), img: hero.img, name: hero.name },
      featured: FEATURED.map((id) => card(products.find((p) => p.id === id))),
    },
  };
}

const { business } = siteConfig;

export default function Home({ total, categoryCount, hero, featured }) {
  return (
    <SiteLayout>
      <Seo
        title="Visto Homeware | Food Containers, Lunch Boxes & Water Bottles, Kolkata"
        description={`Visto Homeware makes airtight food containers, container sets, lunch boxes, water bottles, mugs, casseroles and household products. Browse ${total} products, download the 2026 catalogue, or ask for retail and wholesale prices.`}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Organization",
          name: siteConfig.brand,
          url: siteConfig.baseUrl,
          logo: siteConfig.baseUrl + "/icon-512.png",
          email: business.email,
          telephone: business.telephone,
          taxID: business.gstin,
          address: {
            "@type": "PostalAddress",
            streetAddress: business.streetAddress,
            addressLocality: business.addressLocality,
            addressRegion: business.addressRegion,
            postalCode: business.postalCode,
            addressCountry: business.addressCountry,
          },
          contactPoint: {
            "@type": "ContactPoint",
            telephone: business.telephone,
            email: business.email,
            contactType: "sales",
            areaServed: "IN",
          },
        }}
      />
      <section className="hero wrap">
        <div className="hero-copy">
          <h1>
            Little things.
            <br />
            Better <span>living.</span>
          </h1>
          <div className="hero-actions">
            <CatalogueLink className="button button-red">
              <Download size={18} /> Download catalogue
            </CatalogueLink>
            <Link className="button button-outline" href="/products">
              Browse all {total} products <ArrowUpRight size={18} />
            </Link>
          </div>
        </div>
        <Link className="hero-visual" href={hero.href} aria-label={hero.name}>
          <Image
            src={hero.img}
            alt={hero.name}
            fill
            priority
            sizes="(max-width: 760px) 100vw, 60vw"
          />
        </Link>
      </section>
      <section className="section wrap" aria-labelledby="collections">
        <div className="section-heading">
          <h2 id="collections">Find your kind of everyday.</h2>
          <Link href="/products" className="text-link">
            Explore all {categoryCount} collections <ArrowUpRight size={18} />
          </Link>
        </div>
        <div className="collections">
          {collections.map((c) => (
            <Link className="collection-card" key={c.id} href={categoryPath(c.id)}>
              <div className="collection-image">
                <Image
                  src={c.img}
                  alt=""
                  fill
                  sizes="(max-width: 760px) 46vw, 25vw"
                />
                <span className="round-arrow">
                  <ArrowUpRight size={20} />
                </span>
              </div>
              <h3>{c.name}</h3>
            </Link>
          ))}
        </div>
      </section>
      <section className="feature-story" aria-labelledby="storage">
        <div className="story-image">
          <Image
            src="/Container_002.jpg"
            alt="Clear Visto containers keeping biscuits and snacks neatly organised"
            fill
            sizes="(max-width: 760px) 100vw, 55vw"
          />
        </div>
        <div className="story-copy">
          <h2 id="storage">
            Everything in
            <br />
            its happy place.
          </h2>
          <Link href={categoryPath("containers")} className="button button-red">
            Browse food containers <ArrowUpRight size={18} />
          </Link>
        </div>
      </section>
      <section className="section wrap" aria-labelledby="featured">
        <div className="section-heading">
          <h2 id="featured">Small upgrades. Big difference.</h2>
          <Link href="/products" className="text-link">
            View all products <ArrowUpRight size={18} />
          </Link>
        </div>
        <div className="product-grid">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
      <section className="catalogue-banner wrap" aria-labelledby="catalogue">
        <div>
          <h2 id="catalogue">
            One catalogue.
            <br />
            So many possibilities.
          </h2>
          <CatalogueLink className="button button-light">
            <Download size={18} /> Download catalogue
          </CatalogueLink>
        </div>
        <div className="catalogue-visual">
          <Image
            src="/new-products/G-14.jpg"
            alt="A colourful set of Visto storage containers"
            fill
            sizes="(max-width: 760px) 90vw, 45vw"
          />
        </div>
      </section>
    </SiteLayout>
  );
}
