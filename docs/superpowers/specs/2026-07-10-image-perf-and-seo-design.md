# Visto Homeware — Image Performance + Technical SEO

**Date:** 2026-07-10
**Status:** Approved (pending spec review)

## Problem

1. **Images load late / the site feels slow.** Source images in `public/` are enormous
   (`Container_001.jpg` = 12.7 MB; many 4–12 MB; `public/` totals ~247 MB). The gallery
   (`components/Masonry.js`) renders them as raw CSS `backgroundImage` (bypassing Next's
   image optimizer) *and* blocks the entire gallery from painting until every full-size
   image finishes downloading. The mobile hero image lacks `priority`/`sizes`.
2. **SEO gaps.** Broken social preview images, a robots rule that blocks render-critical
   assets, fabricated review structured data, wrong favicon, and a stale/padded sitemap.
3. **Catalogue link is outdated.** A new `public/catalogue.pdf` (1.85 MB) was added; all
   references still point at the old `/product-catalogue.pdf` (42 MB).

## Constraints / Decisions (from the user)

- **Do NOT modify source image files.** Fix delivery only (`next/image` everywhere + fix
  the gallery). No compressing/overwriting/resizing originals.
- **Technical SEO on existing pages only.** No per-product / per-category indexable pages.
- Deployment target is **Vercel** (`sharp` present, no `output: export`), so Next's image
  optimizer runs and serves optimized AVIF/WebP to visitors.

## Goals / Success Criteria

- Above-the-fold paints fast; below-the-fold images stream in lazily as the user scrolls.
- Visitors never download the multi-MB originals — only optimized variants.
- The gallery paints immediately and fills in progressively (no all-or-nothing preload).
- Social share previews render a real image; structured data is policy-compliant.
- Google can crawl optimized images and render-critical JS/CSS.
- Every catalogue link/reference points at `/catalogue.pdf`.

## Non-Goals (explicitly out of scope)

- Compressing or resizing the source image files.
- Per-product or per-category pages / dynamic routes.
- Deleting the orphaned old `product-catalogue.pdf` (flag only, no delete without approval).
- Adding a `price` field or fixing the unrelated price sort no-op noted in CLAUDE.md.

---

## Part A — Image Performance (delivery-only)

### A1. Fix the gallery blocker — `components/Masonry.js` (highest impact)
- Replace the raw CSS `backgroundImage` on `.item-img` with `next/image` (`fill`,
  `object-cover`, lazy loading, appropriate `sizes` for the responsive column count).
- Remove the blocking `preloadImages` → `imagesReady` gate. Items should animate in on
  mount; each image loads independently and progressively (with a placeholder), so the
  gallery is visible immediately rather than after every image downloads.
- Preserve existing behavior: GSAP layout/positioning animation, hover scale, the
  name/size overlay, and click-through to `item.url`.

### A2. Hero LCP — `pages/index.js`
- Add `priority` and a correct `sizes` to the mobile hero carousel `<Image fill>`
  (~line 248) so the largest above-the-fold image is fetched first, not late.

### A3. Audit and correct `priority` usage
- `priority` must be on the single LCP image only. Remove it where it is applied to
  images rendered inside a `.map` (e.g. `products.js:313`, `gallery.js:118`); those should
  use the default lazy loading. Ensure every `fill` image has a `sizes` value (the mobile
  hero at `index.js:248` currently has none → defaults to 100vw srcset).

### A4. `next.config.mjs` image config
- `images.formats = ['image/avif', 'image/webp']`.
- Sane `deviceSizes` / `imageSizes`.
- A long `minimumCacheTTL` so optimized variants are reused across requests.

### A5. Placeholders
- Add a lightweight blur/solid-color placeholder so image slots don't flash empty while
  optimized variants load. (Dynamic `public/` sources use a small `blurDataURL` or a
  background color rather than static-import blur.)

### Tradeoff acknowledged
Keeping the originals means Vercel performs a one-time (then cached) optimization per
variant from the 12 MB source. Visitors still get small images; the cost is
image-optimization quota and occasional slow/large first-hit optimization. If that ever
becomes a problem, compressing sources is the remedy — no re-architecture required.

---

## Part B — Technical SEO (existing pages)

Applies to `pages/index.js`, `pages/products.js`, `pages/gallery.js` unless noted.

### B1. Social / Open Graph images
- `og:image` and `twitter:image` currently point at the relative `/vh-logo.png` (a 2 KB
  logo) — previews won't render. Change to an **absolute URL** to a real, properly-sized
  image. Prefer a dedicated 1200×630 OG asset (generate once with `sharp` into
  `public/` — a new asset, not touching sources) or, if simpler, an existing suitably
  sized product photo referenced by absolute URL.

### B2. Structured data (JSON-LD)
- Remove the fabricated `aggregateRating` (4.7 / 1,250 reviews) everywhere it appears
  (`index.js`, `products.js`) — it violates Google's structured-data policy and risks a
  manual action. Do not replace with invented numbers; omit until real ratings exist.
- Make all JSON-LD `image` URLs absolute.

### B3. `robots.txt`
- Remove `Disallow: /_next/` (it blocks `/_next/image` optimized images and
  render-critical JS/CSS). Keep `Disallow: /api/`.
- Update the catalogue `Allow` line to `/catalogue.pdf` (see Part C).

### B4. Favicon
- Reference the real `public/favicon.ico` (and an `apple-touch-icon`) instead of the PNG
  in the `<link rel="icon">` tags.

### B5. `sitemap.xml`
- Remove the `?search=…` and `?category=…` query-string entries (not distinct content;
  reads as manipulative). Keep the real routes: `/`, `/products`, `/gallery`,
  `/catalogue.pdf`.
- Refresh stale `lastmod` (currently all `2024-01-15`).

### B6. Minor
- Drop the obsolete `keywords` meta tag (ignored by search engines).
- Quick pass for descriptive `alt` text on key images and a single `<h1>` per page.

### B7. Centralize metadata (targeted improvement)
- The nav/footer/SEO metadata is copy-pasted across the three pages and has already
  drifted. Introduce a small `siteConfig` (base URL, brand, OG image path, business
  address/phone) and a reusable `<Seo>` helper so base URL, OG image, and structured data
  stay consistent. Keep it lightweight and focused on metadata correctness — not a broad
  layout refactor.

---

## Part C — Catalogue link fix

Repoint every reference from `/product-catalogue.pdf` to the new `/catalogue.pdf`:
- `pages/index.js` (~line 628) — the "Download Catalogue" `<a href>`.
- `public/robots.txt` (line 26) — `Allow:` line.
- `public/sitemap.xml` (line 81) — `<loc>`.

The old 42 MB `public/product-catalogue.pdf` becomes orphaned. **Flag only** — do not
delete without explicit approval.

---

## Verification

- `npm run build` succeeds; `npm run lint` clean.
- Run the app and confirm: homepage LCP image is `priority`; gallery paints immediately
  and images stream in; no console warnings about missing `sizes` or misused `priority`.
- Inspect Network tab: image requests go through `/_next/image` and return
  AVIF/WebP variants far smaller than the originals; below-the-fold images are lazy.
- View source / social-preview validators: OG/Twitter image is an absolute URL to a real
  image; JSON-LD has no `aggregateRating`; favicon resolves.
- `robots.txt` no longer disallows `/_next/`; `sitemap.xml` lists only real routes and
  `/catalogue.pdf`; the Download Catalogue button serves the new 1.85 MB PDF.
