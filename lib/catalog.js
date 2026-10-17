// URL and enquiry helpers shared by the catalogue, product pages and sitemap.
// Kept free of data imports so client bundles don't pull in every product.
import siteConfig from "@/lib/siteConfig";

export function slugify(text) {
  return text
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export const categoryPath = (categoryId) => `/products/${categoryId}`;

export const productPath = (product) =>
  `${categoryPath(product.category)}/${slugify(product.name)}`;

// Image paths contain spaces and brackets, so encode them for absolute URLs.
export const absoluteUrl = (path) => siteConfig.baseUrl + encodeURI(path);

export const productImages = (product) =>
  product.images?.length ? product.images : [product.img];

export function whatsappHref(text) {
  return `https://wa.me/${siteConfig.business.whatsapp}?text=${encodeURIComponent(text)}`;
}

export function productEnquiryText(product) {
  return `Hello Visto, I'd like the price and availability of ${product.name} (code ${product.id.toUpperCase()}).`;
}
