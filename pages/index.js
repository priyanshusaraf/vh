import Link from "next/link";
import Image from "next/image";
import Head from "next/head";
import {
  ArrowRight,
  ArrowUpRight,
  Layers3,
  Leaf,
  PackageCheck,
  MoveDown,
} from "lucide-react";
import Seo from "@/components/Seo";
import SiteLayout from "@/components/SiteLayout";
import ProductCard from "@/components/ProductCard";
import { products, categories } from "@/data/products";
import siteConfig from "@/lib/siteConfig";
const collections = [
  {
    id: "containers",
    label: "A place for everything.",
    name: "Kitchen & storage",
    img: "/new-products/G-16.jpg",
  },
  {
    id: "lunch-boxes",
    label: "Made for your midday.",
    name: "Lunch boxes & tiffins",
    img: "/new-products/T-5.png",
  },
  {
    id: "water-bottles",
    label: "Take a little freshness along.",
    name: "Bottles & hydration",
    img: "/new-products/WA-16.png",
  },
  {
    id: "casseroles",
    label: "Bring everyone together.",
    name: "Serveware & casseroles",
    img: "/new-products/CS-2.jpeg",
  },
];
export default function Home() {
  return (
    <SiteLayout>
      <Seo
        title="Visto Homeware — A little more order. A lot more joy."
        description="Thoughtful homeware for everyday living. Explore Visto food containers, lunch boxes, bottles, casseroles and home essentials. Based in Kolkata, India."
      />
      <Head>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: siteConfig.brand,
            url: siteConfig.baseUrl,
            logo: siteConfig.baseUrl + "/vh-logo.png",
            email: siteConfig.business.email,
            telephone: siteConfig.business.telephone,
          })}
        </script>
      </Head>
      <section className="hero wrap">
        <div className="hero-copy">
          <span className="eyebrow">
            <span className="small-dot" /> EVERYDAY LIVING, THOUGHTFULLY MADE
          </span>
          <h1>
            Little things.
            <br />
            Better <span>living.</span>
          </h1>
          <p>
            Fresh kitchens. Packed lunches. Beautifully organised homes. Make
            the everyday feel a little more special with Visto.
          </p>
          <Link href="/products" className="button button-dark">
            Find your everyday essentials <ArrowUpRight size={19} />
          </Link>
          <div className="hero-foot">
            <span>
              Designed for real life.
              <br />
              <strong>Made for your home.</strong>
            </span>
            <a href="#collections" aria-label="Explore our collections">
              <MoveDown size={20} />
            </a>
          </div>
        </div>
        <div className="hero-visual">
          <Image
            src="/new-products/G-12.jpg"
            alt="Visto Snap Fresh containers filled with nuts and pasta on a sunny kitchen counter"
            fill
            priority
            sizes="(max-width: 760px) 100vw, 60vw"
          />
          <div className="hero-image-top">
            <span>THE EVERYDAY COLLECTION</span>
            <span>VISTO HOMEWARE</span>
          </div>
          <Link href="/products?product=g-12" className="hero-product">
            <div>
              <span>FRESH THINKING. SMART STORAGE.</span>
              <h2>
                Meet your kitchen’s
                <br />
                new best friend.
              </h2>
            </div>
            <span className="round-arrow">
              <ArrowUpRight />
            </span>
          </Link>
        </div>
      </section>
      <div className="benefits wrap">
        <span>
          <Layers3 /> Less clutter. More space.
        </span>
        <span>
          <Leaf /> Thoughtful everyday design.
        </span>
        <span>
          <PackageCheck /> Ready for your routine.
        </span>
      </div>
      <section className="section wrap" id="collections">
        <div className="section-heading">
          <div>
            <span className="eyebrow">A HOME FOR EVERY ESSENTIAL</span>
            <h2>Find your kind of everyday.</h2>
          </div>
          <Link href="/products" className="text-link">
            Explore all {categories.length} collections{" "}
            <ArrowUpRight size={18} />
          </Link>
        </div>
        <div className="collections">
          {collections.map((c) => (
            <Link
              className="collection-card"
              key={c.id}
              href={`/products?category=${c.id}`}
            >
              <div className="collection-image">
                <Image
                  src={c.img}
                  alt={c.name}
                  fill
                  sizes="(max-width: 600px) 80vw, (max-width: 900px) 45vw, 25vw"
                />
                <span className="round-arrow">
                  <ArrowUpRight size={20} />
                </span>
              </div>
              <h3>{c.name}</h3>
              <p>{c.label}</p>
            </Link>
          ))}
        </div>
      </section>
      <section className="feature-story">
        <div className="story-image">
          <Image
            src="/Container_002.jpg"
            alt="Clear Visto containers keeping biscuits and snacks neatly organised"
            fill
            sizes="(max-width: 760px) 100vw, 55vw"
          />
        </div>
        <div className="story-copy">
          <span className="eyebrow">A FRESH TAKE ON THE EVERYDAY</span>
          <h2>
            Everything in
            <br />
            its happy place.
          </h2>
          <p>
            The morning rush feels easier when everything is right where it
            belongs. Discover storage that keeps your kitchen organised and your
            favourites close at hand.
          </p>
          <Link
            href="/products?category=containers"
            className="button button-dark"
          >
            Meet your storage essentials <ArrowUpRight size={18} />
          </Link>
          <div className="story-note">
            <span>GOOD DESIGN.</span>
            <span>GREAT EVERYDAYS.</span>
          </div>
        </div>
      </section>
      <section className="section wrap">
        <div className="section-heading">
          <div>
            <span className="eyebrow">GET TO KNOW THE RANGE</span>
            <h2>Small upgrades. Big difference.</h2>
          </div>
          <Link href="/products" className="text-link">
            View all products <ArrowUpRight size={18} />
          </Link>
        </div>
        <div className="product-grid featured-grid">
          {["g-7", "ch-2", "cs-1", "wa-16"].map((id) => (
            <ProductCard key={id} product={products.find((p) => p.id === id)} />
          ))}
        </div>
      </section>
      <section className="about-section wrap" id="about">
        <span className="eyebrow">HELLO, WE’RE VISTO.</span>
        <div>
          <h2>
            For the homes we live in.
            <br />
            <span>And the lives we fill them with.</span>
          </h2>
          <div className="about-bottom">
            <p>
              We believe good homeware should fit naturally into your day. From
              the first cup of coffee to the last container tucked away, Visto
              brings practical design to the moments that make a home.
            </p>
            <p>
              Based in Kolkata, we bring together a wide range of kitchen,
              dining and household essentials. Thoughtfully chosen. Easy to
              love. Ready for real life.
            </p>
          </div>
          <Link className="text-link" href="/#contact">
            Get to know us <ArrowRight size={18} />
          </Link>
        </div>
      </section>
      <section className="catalogue-banner wrap">
        <div>
          <span className="eyebrow">
            YOUR NEXT EVERYDAY FAVOURITE IS IN HERE
          </span>
          <h2>
            One catalogue.
            <br />
            So many possibilities.
          </h2>
          <a
            href="/catalogue.pdf"
            target="_blank"
            rel="noreferrer"
            className="button button-light"
          >
            Explore the full catalogue <ArrowUpRight size={18} />
          </a>
        </div>
        <div className="catalogue-visual">
          <Image
            src="/new-products/G-14.jpg"
            alt="A colourful set of Visto storage containers"
            fill
            sizes="(max-width:760px) 90vw, 45vw"
          />
        </div>
      </section>
    </SiteLayout>
  );
}
