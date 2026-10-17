import Head from "next/head";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import Link from "@/components/DesignLink";
import SiteLayout from "@/components/SiteLayout";
import ProductCard from "@/components/ProductCard";
import { products } from "@/data/products";
import { designs } from "@/lib/designs";

function Photo({
  src,
  alt,
  className = "",
  priority = false,
  sizes = "(max-width:760px) 100vw, 50vw",
}) {
  return (
    <div className={"concept-photo " + className}>
      <Image src={src} alt={alt} fill sizes={sizes} priority />
    </div>
  );
}
function Selection({ ids }) {
  return (
    <div className="concept-products">
      {ids.map((id) => (
        <ProductCard key={id} product={products.find((p) => p.id === id)} />
      ))}
    </div>
  );
}
function Showroom() {
  return (
    <>
      <section className="showroom-hero">
        <Photo
          src="/Container_005.jpg"
          alt="Visto food storage containers on a dark studio backdrop"
          priority
          sizes="100vw"
        />
        <div className="showroom-shade" aria-hidden="true" />
        <div className="showroom-hero-copy">
          <h1>
            Kitchen &amp; home
            <br />
            essentials.
          </h1>
          <p>Food storage, lunch boxes and serveware for home and on the go.</p>
          <Link href="/products" className="showroom-button">
            Browse products
          </Link>
        </div>
      </section>
      <section className="showroom-intro concept-wrap">
        <h2>Browse by category</h2>
      </section>
      <section
        className="showroom-collections concept-wrap"
        id="showroom-collections"
      >
        <Link
          href="/products?category=containers"
          className="showroom-collection-large"
        >
          <Photo
            src="/new-products/G-16.jpg"
            alt="Visto storage with a green handle and fresh tomatoes"
          />
          <div className="showroom-overlay">
            <h2>Food storage</h2>
          </div>
        </Link>
        <div className="showroom-collection-stack">
          <Link href="/products?category=water-bottles">
            <Photo
              src="/new-products/WA-16.png"
              alt="The black Sleeko water bottle"
            />
            <div className="showroom-overlay">
              <h3>Water bottles</h3>
            </div>
          </Link>
          <Link href="/products?category=casseroles">
            <Photo
              src="/new-products/CS-2.jpeg"
              alt="Visto Ambrosia casserole"
            />
            <div className="showroom-overlay">
              <h3>Casseroles</h3>
            </div>
          </Link>
        </div>
      </section>
      <section className="showroom-selection concept-wrap">
        <div className="showroom-section-title">
          <h2>Featured products</h2>
          <Link href="/products" className="showroom-text-link">
            View all products
          </Link>
        </div>
        <Selection ids={["wa-16", "cs-1", "g-15", "ch-2"]} />
      </section>
      <section className="showroom-panorama">
        <Photo
          src="/new-products/G-12.jpg"
          alt="Stacked Visto Snap Fresh containers in a home kitchen"
          sizes="100vw"
        />
        <div>
          <h2>
            Snap Fresh
            <br />
            container sets
          </h2>
          <Link
            href="/products?category=container-sets"
            className="showroom-button"
          >
            View container sets
          </Link>
        </div>
      </section>
      <section className="showroom-final concept-wrap" id="about">
        <h2>Visto Homeware</h2>
        <p>
          Based in Kolkata, we offer kitchen, dining and household products for
          homes and retailers. Browse our full range in the catalogue, or
          contact us for product details and bulk orders.
        </p>
        <a
          href="/catalogue.pdf"
          target="_blank"
          rel="noreferrer"
          className="showroom-button"
        >
          Download catalogue
        </a>
      </section>
    </>
  );
}
function Bold() {
  const favourites = [
    { id: "g-14", title: "Bingo container set", dimensions: [2528, 1684] },
    { id: "t-5", title: "Mighty lunch box", dimensions: [1448, 1086] },
    { id: "wa-2", title: "Ozon insulated bottle", dimensions: [1122, 1402] },
    { id: "cs-2", title: "Ambrosia casserole", dimensions: [1086, 1448] },
  ];
  return (
    <>
      <section className="bold-hero">
        <div className="bold-hero-copy">
          <h1>
            Good things.
            <br />
            Live here.
          </h1>
          <p>Kitchen and home essentials for every day.</p>
          <Link href="/products" className="bold-button">
            Explore products <ArrowUpRight size={22} />
          </Link>
        </div>
        <div className="bold-collage">
          <Link
            href="/products?category=container-sets"
            className="bold-polaroid bold-polaroid-main"
          >
            <Photo
              src="/new-products/G-14.jpg"
              alt="Red-lidded Visto containers on a sunny kitchen counter"
              priority
            />
          </Link>
          <Link
            href="/products?category=lunch-boxes"
            className="bold-polaroid bold-polaroid-small"
          >
            <Photo
              src="/new-products/T-5.png"
              alt="A teal Visto lunch box"
              priority
            />
          </Link>
        </div>
      </section>
      <section className="bold-favourites concept-wrap">
        <div className="bold-section-heading">
          <h2>Everyday favourites.</h2>
          <Link href="/products" className="bold-button bold-button-dark">
            All products <ArrowUpRight size={21} />
          </Link>
        </div>
        <div className="concept-products">
          {favourites.map((item) => (
            <ProductCard
              key={item.id}
              product={products.find((p) => p.id === item.id)}
              title={item.title}
              imageDimensions={item.dimensions}
            />
          ))}
        </div>
      </section>
      <section className="bold-life" id="about">
        <Photo
          src="/new-products/TS-7.png"
          alt="A bright Visto lunch box packed with a meal"
        />
        <div>
          <h2>
            Lunch,
            <br />
            <span>packed.</span>
          </h2>
          <p>Lunch boxes for work, school and days out.</p>
          <Link
            href="/products?category=lunch-boxes"
            className="bold-button bold-button-dark"
          >
            Explore lunch boxes <ArrowUpRight size={22} />
          </Link>
        </div>
      </section>
      <section className="bold-manifesto concept-wrap">
        <h2>
          From Kolkata,
          <br />
          <span>for your home.</span>
        </h2>
        <div>
          <p>
            Discover {products.length} kitchen, dining and household essentials,
            brought together by Visto.
          </p>
          <Link href="/gallery" className="bold-button bold-button-dark">
            View the gallery <ArrowUpRight size={22} />
          </Link>
        </div>
      </section>
      <section className="bold-catalogue">
        <h2>The full collection.</h2>
        <a
          href="/catalogue.pdf"
          target="_blank"
          rel="noreferrer"
          className="bold-button"
        >
          View catalogue <ArrowUpRight size={22} />
        </a>
      </section>
    </>
  );
}
export default function DesignConcept({ variant }) {
  const design = designs.find((d) => d.id === variant);
  return (
    <SiteLayout>
      <Head>
        <title>{`${design.name} — Visto Homeware Design Preview`}</title>
        <meta name="description" content={design.description} />
        <meta name="robots" content="noindex,nofollow" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      {variant === "showroom" ? <Showroom /> : <Bold />}
    </SiteLayout>
  );
}
export function getStaticPaths() {
  return {
    paths: designs
      .filter((d) => d.id !== "everyday")
      .map((d) => ({ params: { variant: d.id } })),
    fallback: false,
  };
}
export function getStaticProps({ params }) {
  return { props: { variant: params.variant } };
}
