import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import SiteLayout, { CatalogueLink } from "@/components/SiteLayout";
import Seo, { JsonLd } from "@/components/Seo";
import Breadcrumbs from "@/components/Breadcrumbs";
import ProductCard from "@/components/ProductCard";
import { WhatsAppIcon } from "@/components/Icons";
import { products } from "@/data/products";
import imageSizes from "@/data/image-sizes.json";
import { getCategory } from "@/lib/categories";
import siteConfig from "@/lib/siteConfig";
import { trackEvent } from "@/lib/track";
import {
  absoluteUrl,
  categoryPath,
  productEnquiryText,
  productImages,
  productPath,
  slugify,
  whatsappHref,
} from "@/lib/catalog";

// Ratings and review counts in the data are not real reviews, so they are
// never sent to the page.
const FIELDS = [
  "id",
  "name",
  "description",
  "category",
  "size",
  "material",
  "dimensions",
  "weight",
  "colors",
  "features",
  "img",
  "images",
  "seo",
];
const pick = (p) =>
  Object.fromEntries(FIELDS.filter((k) => p[k] != null).map((k) => [k, p[k]]));

export function getStaticPaths() {
  return {
    paths: products.map((p) => ({
      params: { category: p.category, slug: slugify(p.name) },
    })),
    fallback: false,
  };
}

export function getStaticProps({ params }) {
  const product = products.find(
    (p) => p.category === params.category && slugify(p.name) === params.slug,
  );
  if (!product) return { notFound: true };
  // Show the next products in the same category, wrapping round to the start.
  const siblings = products.filter((p) => p.category === product.category);
  const at = siblings.indexOf(product);
  const related = [...siblings.slice(at + 1), ...siblings.slice(0, at)].slice(
    0,
    4,
  );
  const photoSizes = Object.fromEntries(
    productImages(product)
      .filter((src) => imageSizes[src])
      .map((src) => [src, imageSizes[src]]),
  );
  return {
    props: { product: pick(product), related: related.map(pick), photoSizes },
  };
}

export default function ProductPage({ product, related, photoSizes }) {
  const category = getCategory(product.category);
  const images = productImages(product);
  const [image, setImage] = useState(images[0]);
  const path = productPath(product);
  // Size the photo box to the photo, so wide shots aren't letterboxed in a
  // square; very tall photos are capped at 4:5.
  const [w, h] = photoSizes[image] || [1, 1];
  const specs = [
    ["Capacity", product.size],
    ["Material", product.material],
    ["Dimensions", product.dimensions],
    ["Weight", product.weight],
    ["Colours", product.colors?.join(", ")],
    ["Product code", product.id.toUpperCase()],
  ].filter(([, value]) => value);

  return (
    <SiteLayout>
      <Seo
        title={`${(product.seo?.title || product.name).replace(/\s*[|-]\s*Visto Homeware$/i, "")} | Visto Homeware`}
        description={product.seo?.description || product.description}
        path={path}
        ogImage={absoluteUrl(images[0])}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Product",
          name: product.name,
          description: product.description,
          sku: product.id.toUpperCase(),
          image: images.map(absoluteUrl),
          url: siteConfig.baseUrl + path,
          category: category.name,
          brand: { "@type": "Brand", name: siteConfig.brand },
          ...(product.material && { material: product.material }),
          ...(product.size && { size: product.size }),
        }}
      />
      <div className="product-page wrap">
        <Breadcrumbs
          items={[
            { name: "Home", href: "/" },
            { name: "Products", href: "/products" },
            { name: category.name, href: categoryPath(category.id) },
            { name: product.name },
          ]}
        />
        <div className="product-layout">
          <div className="product-media">
            <div
              className="product-photo"
              style={{ aspectRatio: Math.max(w / h, 0.8) }}
            >
              <Image
                src={image}
                alt={product.name}
                fill
                priority
                sizes="(max-width: 760px) 100vw, 50vw"
              />
            </div>
            {images.length > 1 && (
              <div className="product-thumbs">
                {images.map((src, i) => (
                  <button
                    key={src}
                    aria-label={`Show photo ${i + 1} of ${images.length}`}
                    aria-pressed={src === image}
                    onClick={() => setImage(src)}
                  >
                    <Image src={src} alt="" fill sizes="80px" />
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="product-info">
            <h1>{product.name}</h1>
            <p className="product-description">{product.description}</p>
            <div className="product-actions">
              <a
                className="button button-red"
                href={whatsappHref(productEnquiryText(product))}
                target="_blank"
                rel="noopener"
                onClick={() =>
                  trackEvent("whatsapp_click", { from: "product", product: product.id })
                }
              >
                <WhatsAppIcon /> Ask on WhatsApp
              </a>
              <Link
                className="button button-outline"
                href={{ pathname: "/contact", query: { product: product.id } }}
              >
                Get a quote
              </Link>
            </div>
            <dl className="spec-list">
              {specs.map(([label, value]) => (
                <div key={label}>
                  <dt>{label}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
            {product.features?.length > 0 && (
              <ul className="feature-list" aria-label="Features">
                {product.features.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
            )}
            <CatalogueLink />
          </div>
        </div>
      </div>
      {related.length > 0 && (
        <section className="section wrap" aria-labelledby="related">
          <div className="section-heading">
            <h2 id="related">More {category.name.toLowerCase()}</h2>
            <Link className="text-link" href={categoryPath(category.id)}>
              All {category.name.toLowerCase()} <ArrowRight size={17} />
            </Link>
          </div>
          <div className="product-grid">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </SiteLayout>
  );
}
