import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { Search, X, Heart, LayoutGrid, Grid2X2 } from "lucide-react";
import SiteLayout, { CatalogueLink } from "@/components/SiteLayout";
import ProductCard from "@/components/ProductCard";
import Breadcrumbs from "@/components/Breadcrumbs";
import { products, categories, searchProducts } from "@/data/products";
import { getCategory } from "@/lib/categories";
import { categoryPath, productPath } from "@/lib/catalog";

const PAGE_SIZE = 48;

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

// The catalogue at /products, each category page at /products/[category]
// (`categoryId`), and the gallery (`gallery`), which filters by ?category=
// and shows photos uncropped using `photoSizes` ({ [productId]: [w, h] }).
export default function Catalogue({
  gallery = false,
  categoryId = null,
  photoSizes = {},
}) {
  const router = useRouter();
  const query = router.query;
  const { liked, toggleLike } = useLikes();
  const [onlySaved, setOnlySaved] = useState(false);
  const [sort, setSort] = useState("featured");
  const [masonry, setMasonry] = useState(gallery);

  const search = typeof query.search === "string" ? query.search : "";
  const shown = Math.max(PAGE_SIZE, Number(query.show) || 0);
  const active =
    categoryId ||
    (gallery && getCategory(query.category) ? query.category : "all");
  const category = getCategory(active);

  // Send links from the previous site (/products?product= and
  // /products?category=) to the pages that replaced them.
  useEffect(() => {
    if (!router.isReady || gallery || categoryId) return;
    const old = products.find((p) => p.id === query.product);
    if (old) router.replace(productPath(old));
    else if (getCategory(query.category))
      router.replace(categoryPath(query.category));
  }, [router, gallery, categoryId, query.product, query.category]);

  const setQuery = (changes) => {
    const next = { ...query, ...changes };
    Object.keys(next).forEach((k) => {
      if (!next[k] || next[k] === "all") delete next[k];
    });
    router.replace({ pathname: router.pathname, query: next }, undefined, {
      shallow: true,
      scroll: false,
    });
  };
  const clearFilters = () => {
    setOnlySaved(false);
    setQuery({ search: "", show: "", ...(gallery && { category: "" }) });
  };

  let results = (search.trim() ? searchProducts(search.trim()) : products).filter(
    (p) =>
      (active === "all" || p.category === active) &&
      (!onlySaved || liked.has(p.id)),
  );
  if (sort === "az")
    results = [...results].sort((a, b) => a.name.localeCompare(b.name));
  // Category pages are short enough to list everything, so every product is
  // linked from its category in the initial HTML.
  const visible = categoryId ? results : results.slice(0, shown);
  const filtered = search || onlySaved || (gallery && active !== "all");

  const tab = (id, name, count) => {
    const selected = active === id;
    const label = (
      <>
        {name} <span>{count}</span>
      </>
    );
    return gallery ? (
      <button
        key={id}
        className={selected ? "active" : ""}
        aria-pressed={selected}
        onClick={() => setQuery({ category: id, show: "" })}
      >
        {label}
      </button>
    ) : (
      <Link
        key={id}
        href={id === "all" ? "/products" : categoryPath(id)}
        className={selected ? "active" : ""}
        aria-current={selected ? "page" : undefined}
      >
        {label}
      </Link>
    );
  };

  return (
    <SiteLayout>
      <section className="catalogue-heading wrap">
        {categoryId && (
          <Breadcrumbs
            items={[
              { name: "Home", href: "/" },
              { name: "Products", href: "/products" },
              { name: category.name },
            ]}
          />
        )}
        <div>
          <h1>{gallery ? "Gallery" : category ? category.name : "All products"}</h1>
          <CatalogueLink />
        </div>
      </section>
      <section className="catalogue-body wrap">
        <div className="catalogue-toolbar">
          <label className="search-field">
            <Search size={19} />
            <input
              aria-label="Search products"
              type="search"
              placeholder={
                category
                  ? `Search ${category.name.toLowerCase()}`
                  : "Search containers, lunch boxes, bottles…"
              }
              value={search}
              onChange={(e) => setQuery({ search: e.target.value, show: "" })}
            />
          </label>
          <button
            className={"saved-filter " + (onlySaved ? "active" : "")}
            aria-pressed={onlySaved}
            onClick={() => setOnlySaved(!onlySaved)}
          >
            <Heart size={17} /> Saved <span>{liked.size}</span>
          </button>
          <label className="sort-field">
            <span className="sr-only">Sort products</span>
            <select value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="featured">Featured</option>
              <option value="az">Name: A to Z</option>
            </select>
          </label>
          {gallery && (
            <button
              className="view-button"
              aria-label={masonry ? "Show as grid" : "Show as gallery"}
              onClick={() => setMasonry(!masonry)}
            >
              {masonry ? <LayoutGrid size={20} /> : <Grid2X2 size={20} />}
            </button>
          )}
        </div>
        <nav className="category-tabs" aria-label="Product categories">
          {tab("all", "All products", products.length)}
          {categories.map((c) => tab(c.id, c.name, c.count))}
        </nav>
        <div className="results-line">
          <p role="status">
            {results.length} {results.length === 1 ? "product" : "products"}
          </p>
          {filtered && (
            <button onClick={clearFilters}>
              Clear filters <X size={14} />
            </button>
          )}
        </div>
        {results.length ? (
          <>
            <div className={masonry ? "gallery-grid" : "product-grid"}>
              {visible.map((p, i) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  priority={i < 4}
                  photoSize={masonry ? photoSizes[p.id] : undefined}
                  liked={liked.has(p.id)}
                  onToggleLike={toggleLike}
                />
              ))}
            </div>
            {visible.length < results.length && (
              <div className="load-more">
                <p>
                  Showing {visible.length} of {results.length} products
                </p>
                <button
                  className="button button-outline"
                  onClick={() => setQuery({ show: String(shown + PAGE_SIZE) })}
                >
                  Show more products
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="empty-state">
            <h2>
              {onlySaved
                ? "No saved products yet"
                : `No products match “${search}”`}
            </h2>
            <p>
              {onlySaved
                ? "Tap the heart on any product to save it here."
                : "Check the spelling, or search for a product type such as “tiffin” or “bottle”."}
            </p>
            <button className="button button-red" onClick={clearFilters}>
              {onlySaved ? "Show all products" : "Clear search"}
            </button>
          </div>
        )}
      </section>
    </SiteLayout>
  );
}
