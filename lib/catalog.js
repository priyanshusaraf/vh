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

// Short URLs for products whose names carry packaging notes or long size
// breakdowns, keyed by product id. Other products use their slugified name.
// When changing a URL here, add the old one to data/url-redirects.json.
const SLUGS = {
  "b-6": "snap-fresh-rectangle-lock-cap-300ml",
  "b-7": "snap-fresh-rectangle-lock-cap-1200ml",
  "b-8": "snap-fresh-rectangle-lock-cap-1500ml",
  "b-9": "snap-fresh-rectangle-lock-cap-2000ml",
  "c-3": "snap-fresh-long-lock-cap-900ml",
  "c-4": "snap-fresh-long-lock-cap-1700ml",
  "g-1": "neo-lock-container-600ml-2-piece-set",
  "g-2": "neo-lock-container-1100ml-2-piece-set",
  "g-3": "neo-lock-container-1500ml-2-piece-set",
  "g-4": "twin-bite-1400ml",
  "g-5": "lock-tight-square-container-3-piece-set",
  "g-6": "lock-tight-round-container-3-piece-set",
  "g-7": "snap-fresh-square-container-3-piece-set",
  "g-8": "elite-festival-jar-2-piece-set",
  "g-9": "elite-festival-jar-4-piece-set",
  "g-10": "flip-festival-jar-2-piece-set",
  "g-11": "flip-festival-jar-4-piece-set",
  "g-12": "snap-fresh-rectangle-container-3-piece-set",
  "g-13": "hot-smart-740ml-3-compartment",
  "g-13a": "hot-smart-240ml-3-compartment",
  "g-14": "bingo-3-piece-set-300-750-1500ml",
  "g-26": "bingo-3-piece-set-300-600-1000ml",
  "g-18": "polories-steel-chapati-box",
  "g-19": "pop-n-treat-1325ml",
  "g-20": "elegant-steel-chapati-box",
  "ts-1": "trendy-small-lunch-box-650ml",
  "ts-2": "trendy-big-lunch-box-900ml",
  "ts-3": "elegant-lunch-box-800ml",
  "ts-4": "curve-lunch-box-650ml",
  "ts-5": "trinex-lunch-box-800ml",
  "ts-6": "lunch-box-combo-1000ml",
  "ts-7": "microsafe-magic-meal-1000ml",
  "ts-8": "magic-meal-1000ml",
  "wa-1": "ozon-700-insulated-bottle",
  "wa-2": "ozon-900-insulated-bottle",
  "wa-3": "beauty-700-insulated-bottle",
  "wa-4": "beauty-900-insulated-bottle",
  "wa-5": "campa-700-insulated-bottle",
  "wa-6": "campa-900-insulated-bottle",
  "wa-7": "legend-2500",
  "wa-8": "legend-5000",
};

export const productSlug = (product) =>
  SLUGS[product.id] || slugify(product.name);

export const productPath = (product) =>
  `${categoryPath(product.category)}/${productSlug(product)}`;

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
