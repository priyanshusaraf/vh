import { products, categories } from "@/data/products";
import siteConfig from "@/lib/siteConfig";
import { absoluteUrl, categoryPath, productImages, productPath } from "@/lib/catalog";

const escape = (s) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// Built from the product data, so new products and categories are listed
// automatically. Product photos are included for Google Images.
function sitemap() {
  const page = (path, images = []) =>
    `  <url>\n    <loc>${escape(siteConfig.baseUrl + path)}</loc>\n${images
      .map(
        (src) =>
          `    <image:image><image:loc>${escape(absoluteUrl(src))}</image:loc></image:image>\n`,
      )
      .join("")}  </url>`;
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${[
  page("/"),
  page("/products"),
  page("/gallery"),
  page("/contact"),
  ...categories.map((c) => page(categoryPath(c.id))),
  ...products.map((p) => page(productPath(p), productImages(p))),
].join("\n")}
</urlset>
`;
}

export function getServerSideProps({ res }) {
  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=86400, stale-while-revalidate=604800",
  );
  res.end(sitemap());
  return { props: {} };
}

export default function Sitemap() {
  return null;
}
