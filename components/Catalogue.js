import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import Head from "next/head";
import Link from "next/link";
import { currentDesign, designs, designHref } from "@/lib/designs";
import {
  Search,
  X,
  ArrowUpRight,
  Heart,
  LayoutGrid,
  Grid2X2,
} from "lucide-react";
import SiteLayout from "@/components/SiteLayout";
import Seo from "@/components/Seo";
import ProductCard from "@/components/ProductCard";
import { products, categories, searchProducts } from "@/data/products";
import siteConfig from "@/lib/siteConfig";

// Keep saved products compatible with the original site's local storage.
function useLikes() {
  const [liked, setLiked] = useState(new Set());
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("visto:liked") || "[]");
      if (Array.isArray(saved)) setLiked(new Set(saved));
    } catch {}
  }, []);
  const toggleLike = (id) =>
    setLiked((previous) => {
      const next = new Set(previous);
      next.has(id) ? next.delete(id) : next.add(id);
      try {
        localStorage.setItem("visto:liked", JSON.stringify([...next]));
      } catch {}
      return next;
    });
  return { liked, toggleLike };
}
function ProductDetails({ product, onClose }) {
  const router = useRouter();
  const dialog = useRef(null);
  useEffect(() => {
    const element = dialog.current;
    const previous = document.activeElement;
    element.showModal();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = overflow;
      element.close();
      previous?.focus();
    };
  }, []);
  return (
    <dialog
      ref={dialog}
      className="product-dialog"
      onCancel={onClose}
      onClick={(e) => {
        if (e.target === dialog.current) onClose();
      }}
      aria-labelledby="detail-title"
    >
      <button
        className="dialog-close"
        onClick={onClose}
        aria-label="Close product details"
      >
        <X />
      </button>
      <div className="detail-image">
        <Image
          src={product.img}
          alt={product.name}
          fill
          sizes="(max-width:760px) 90vw, 45vw"
        />
      </div>
      <div className="detail-copy">
        <span className="eyebrow">
          {categories.find((c) => c.id === product.category)?.name}
        </span>
        <h2 id="detail-title">{product.name}</h2>
        <p>{product.description}</p>
        <dl>
          {[
            ["Capacity", product.size],
            ["Material", product.material],
            ["Dimensions", product.dimensions],
            ["Product code", product.id.toUpperCase()],
          ]
            .filter(([, v]) => v)
            .map(([k, v]) => (
              <div key={k}>
                <dt>{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
        </dl>
        {product.features?.length > 0 && (
          <div className="detail-features">
            {product.features.map((f) => (
              <span key={f}>{f}</span>
            ))}
          </div>
        )}
        <a
          className="button button-dark"
          href={`mailto:${siteConfig.business.email}?subject=${encodeURIComponent("Product enquiry: " + product.name)}&body=${encodeURIComponent("Hello Visto,\n\nI would like to know more about " + product.name + " (" + product.id + ").\n\nQuantity required: \nDelivery location: \n\nThank you.")}`}
        >
          Enquire about this product <ArrowUpRight size={18} />
        </a>
        <small>
          Contact our team for pricing, availability and bulk orders.
        </small>
        <nav
          className="detail-design-options"
          aria-label="Preview product in another design"
        >
          <span>PREVIEW DESIGN</span>
          {designs.map((d) => (
            <Link
              key={d.id}
              href={designHref(router.asPath, d.id)}
              shallow
              scroll={false}
              aria-current={
                currentDesign(router.query) === d.id ? "page" : undefined
              }
            >
              {d.name}
            </Link>
          ))}
        </nav>
      </div>
    </dialog>
  );
}
export default function Catalogue({ gallery = false }) {
  const router = useRouter();
  const { liked, toggleLike } = useLikes();
  const [onlySaved, setOnlySaved] = useState(false);
  const [sort, setSort] = useState("featured");
  const [limit, setLimit] = useState(24);
  const [masonry, setMasonry] = useState(gallery);
  const search =
    typeof router.query.search === "string" ? router.query.search : "";
  const category =
    typeof router.query.category === "string" ? router.query.category : "all";
  const selected = products.find((p) => p.id === router.query.product);
  const update = (key, value) => {
    const query = { ...router.query };
    if (!value || value === "all") delete query[key];
    else query[key] = value;
    if (key !== "product") setLimit(24);
    router.replace({ pathname: router.pathname, query }, undefined, {
      shallow: true,
      scroll: false,
    });
  };
  let results = (search ? searchProducts(search.trim()) : products).filter(
    (p) =>
      (category === "all" || p.category === category) &&
      (!onlySaved || liked.has(p.id)),
  );
  if (sort === "az")
    results = [...results].sort((a, b) => a.name.localeCompare(b.name));
  if (sort === "new")
    results = [...results].sort(
      (a, b) => Number(!!b.isNew) - Number(!!a.isNew),
    );
  const title = gallery
    ? "A little everyday inspiration."
    : "Good things for every room.";
  return (
    <SiteLayout>
      <Seo
        title={`${gallery ? "Product Gallery" : "Our Products"} | Visto Homeware`}
        description={
          gallery
            ? "See Visto homeware in everyday life. Explore kitchen storage, lunch boxes, bottles and household products."
            : "Explore the complete Visto Homeware collection. Find containers, lunch boxes, bottles and more. Contact us for prices and wholesale enquiries."
        }
        path={gallery ? "/gallery" : "/products"}
      />
      <Head>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: gallery ? "Visto product gallery" : "Visto product catalogue",
            numberOfItems: products.length,
            itemListElement: products.map((p, i) => ({
              "@type": "ListItem",
              position: i + 1,
              url: siteConfig.baseUrl + "/products?product=" + p.id,
              name: p.name,
            })),
          })}
        </script>
      </Head>
      <section className="catalogue-heading wrap">
        <span className="eyebrow">
          {gallery ? "VISTO, IN REAL LIFE" : "THE VISTO COLLECTION"}
        </span>
        <h1>{title}</h1>
        <div>
          <p>
            {gallery
              ? "Fresh ideas for the spaces you call home. Take a closer look."
              : "From the kitchen counter to your daily commute. Find your next everyday favourite."}
          </p>
          <a
            className="text-link"
            href="/catalogue.pdf"
            target="_blank"
            rel="noreferrer"
          >
            Download catalogue <ArrowUpRight size={17} />
          </a>
        </div>
      </section>
      <section className="catalogue-body wrap">
        <div className="catalogue-toolbar">
          <label className="search-field">
            <Search size={19} />
            <input
              aria-label="Search products"
              type="search"
              placeholder="Find something for your everyday…"
              value={search}
              onChange={(e) => update("search", e.target.value)}
            />
          </label>
          <button
            className={"saved-filter " + (onlySaved ? "active" : "")}
            aria-pressed={onlySaved}
            onClick={() => {
              setOnlySaved(!onlySaved);
              setLimit(24);
            }}
          >
            <Heart size={17} /> Saved <span>{liked.size}</span>
          </button>
          <label className="sort-field">
            <span className="sr-only">Sort products</span>
            <select value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="featured">Featured</option>
              <option value="new">Newest additions</option>
              <option value="az">Name: A to Z</option>
            </select>
          </label>
          {gallery && (
            <button
              className="view-button"
              aria-label={
                masonry ? "Switch to grid view" : "Switch to masonry view"
              }
              onClick={() => setMasonry(!masonry)}
            >
              {masonry ? <LayoutGrid size={20} /> : <Grid2X2 size={20} />}
            </button>
          )}
        </div>
        <div className="category-tabs" aria-label="Product categories">
          <button
            className={category === "all" ? "active" : ""}
            aria-pressed={category === "all"}
            onClick={() => update("category", "all")}
          >
            All products <span>{products.length}</span>
          </button>
          {categories.map((c) => (
            <button
              className={category === c.id ? "active" : ""}
              aria-pressed={category === c.id}
              key={c.id}
              onClick={() => update("category", c.id)}
            >
              {c.name} <span>{c.count}</span>
            </button>
          ))}
        </div>
        <div className="results-line">
          <p role="status">
            {results.length} {results.length === 1 ? "essential" : "essentials"}
            {category !== "all"
              ? " in " +
                (categories.find((c) => c.id === category)?.name || category)
              : " for better everyday living"}
          </p>
          {(search || category !== "all" || onlySaved) && (
            <button
              onClick={() => {
                setOnlySaved(false);
                setLimit(24);
                router.replace(
                  {
                    pathname: router.pathname,
                    query: router.query.design
                      ? { design: router.query.design }
                      : {},
                  },
                  undefined,
                  { shallow: true, scroll: false },
                );
              }}
            >
              Clear filters <X size={14} />
            </button>
          )}
        </div>
        {results.length ? (
          <>
            <div className={masonry ? "gallery-grid" : "product-grid"}>
              {results.slice(0, limit).map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  liked={liked.has(p.id)}
                  onToggleLike={toggleLike}
                />
              ))}
            </div>
            {results.length > limit && (
              <div className="load-more">
                <p>
                  Showing {Math.min(limit, results.length)} of {results.length}{" "}
                  products
                </p>
                <button
                  className="button button-outline"
                  onClick={() => setLimit(limit + 24)}
                >
                  Discover more products <ArrowUpRight size={18} />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="empty-state">
            <Search size={35} />
            <h2>
              {onlySaved
                ? "Your favourites will feel at home here."
                : "Nothing here just yet."}
            </h2>
            <p>
              {onlySaved
                ? "Tap the heart on a product to save it."
                : "Try a different search or clear your filters to explore the collection."}
            </p>
            <button
              className="button button-dark"
              onClick={() => {
                setOnlySaved(false);
                router.replace(
                  {
                    pathname: router.pathname,
                    query: router.query.design
                      ? { design: router.query.design }
                      : {},
                  },
                  undefined,
                  {
                    shallow: true,
                    scroll: false,
                  },
                );
              }}
            >
              Explore all products <ArrowUpRight size={18} />
            </button>
          </div>
        )}
      </section>
      {selected && (
        <ProductDetails
          key={selected.id}
          product={selected}
          onClose={() => update("product", "")}
        />
      )}
    </SiteLayout>
  );
}
