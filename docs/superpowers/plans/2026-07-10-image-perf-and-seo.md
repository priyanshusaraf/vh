# Image Performance + Technical SEO Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make images load fast and progressively (no multi-MB downloads, no blocking gallery) and fix the technical SEO gaps, without modifying source image files.

**Architecture:** Delivery-only image optimization via `next/image` (Vercel runs the optimizer, serving AVIF/WebP). The gallery is converted from raw CSS backgrounds to lazy `next/image` and its all-or-nothing preload gate is removed. SEO metadata is centralized in a small `siteConfig` + `<Seo>` helper; robots/sitemap/structured-data are corrected; the catalogue link is repointed to the new PDF.

**Tech Stack:** Next.js 15 (Pages Router), React 19, plain JS, Tailwind 3, GSAP, `sharp` (already installed, transitive via Next).

## Global Constraints

- **Do NOT modify, compress, resize, move, or delete the source image files** in `public/` (e.g. `Container_*.jpg`, `FEEL FRESH *`). Fix delivery only.
- **No new routes / dynamic pages.** Technical SEO on the three existing pages only (`index.js`, `products.js`, `gallery.js`).
- **Do NOT delete** the old `public/product-catalogue.pdf` (flag only).
- **No test framework exists** — verification is `npm run build`, `npm run lint`, and manual dev-server inspection. There are no unit tests to write.
- **Git may be slow in this repo** (247 MB of assets). Run git with a timeout; if a commit hangs, skip it and continue — commits are not a correctness gate here.
- Deployment is Vercel; `output: export` is NOT set — the image optimizer runs. Do not add `output: 'export'`.
- Canonical/site base URL is `https://vistohomeware.com`.

---

### Task 1: Enable modern image formats and caching — `next.config.mjs`

**Files:**
- Modify: `next.config.mjs`

**Interfaces:**
- Consumes: nothing.
- Produces: `images` config used implicitly by every `next/image` across the app.

- [ ] **Step 1: Replace the config with the image settings**

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    // Cache optimized variants at the edge for 31 days.
    minimumCacheTTL: 60 * 60 * 24 * 31,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
};

export default nextConfig;
```

- [ ] **Step 2: Verify the build still succeeds**

Run: `npm run build`
Expected: Build completes with no config errors. (First build after this change is fine; warnings unrelated to `images` can be ignored.)

- [ ] **Step 3: Commit**

```bash
git add next.config.mjs
git commit -m "perf: enable AVIF/WebP and long image cache TTL"
```

---

### Task 2: Fix the gallery blocker — `components/Masonry.js`

The gallery currently (a) renders images as raw CSS `backgroundImage` (bypassing the optimizer, downloading full-size files) and (b) hides the whole gallery behind a `preloadImages` gate until every image finishes. This task switches to lazy `next/image` and removes the gate so the gallery paints immediately and images stream in.

**Files:**
- Modify: `components/Masonry.js`
- Modify: `styles/Masonry.css`

**Interfaces:**
- Consumes: `items` shaped `{ id, img, height, name?, size?, url? }` (unchanged — set by `gallery.js`'s `convertToMasonryItems`).
- Produces: same `Masonry` default export and props; no API change for `gallery.js`.

- [ ] **Step 1: Add the `next/image` import**

At the top of `components/Masonry.js`, after the existing imports, add:

```js
import NextImage from "next/image";
```

(Use the alias `NextImage` because the file already uses the browser `Image` constructor inside `preloadImages`, which will be removed in Step 3 — the alias avoids any collision during the edit.)

- [ ] **Step 2: Remove the blocking preload gate**

Delete the `preloadImages` function (the `const preloadImages = async (urls) => {...}` block) and the `imagesReady` state + effect. Concretely:

Remove:
```js
const [imagesReady, setImagesReady] = useState(false);
```
Remove the effect:
```js
useEffect(() => {
  preloadImages(items.map((i) => i.img)).then(() => setImagesReady(true));
}, [items]);
```
And remove the whole `const preloadImages = async (urls) => { ... };` definition above the component.

- [ ] **Step 3: Make the entrance animation run without waiting for images**

In the `useLayoutEffect` that runs the GSAP entrance/layout animation, change the early-return guard from `imagesReady` to `grid` readiness, and update the dependency array (drop `imagesReady`):

Replace:
```js
  useLayoutEffect(() => {
    if (!imagesReady) return;
```
with:
```js
  useLayoutEffect(() => {
    if (!grid.length) return;
```
And in that same `useLayoutEffect`'s dependency array, replace `[grid, imagesReady, stagger, animateFrom, blurToFocus, duration, ease]` with `[grid, stagger, animateFrom, blurToFocus, duration, ease]`.

- [ ] **Step 4: Render `next/image` instead of the CSS background**

Replace the `.item-img` `<div>` (the one with `style={{ backgroundImage: ... }}`) so the image is a lazy `next/image` filling the slot. The new `.item-img` block:

```jsx
<div className="item-img">
  <NextImage
    src={item.img}
    alt={item.name || "Visto Homeware product"}
    fill
    sizes="(min-width:1500px) 20vw, (min-width:1000px) 25vw, (min-width:600px) 33vw, (min-width:400px) 50vw, 100vw"
    className="object-cover"
    style={{ borderRadius: "12px" }}
  />
  {colorShiftOnHover && (
    <div
      className="color-overlay"
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background:
          "linear-gradient(45deg, rgba(255,0,150,0.5), rgba(0,150,255,0.5))",
        opacity: 0,
        pointerEvents: "none",
        borderRadius: "8px",
      }}
    />
  )}
  {item.name && (
    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 z-10">
      <h3 className="text-white font-semibold text-lg mb-1">{item.name}</h3>
      {item.size && (
        <p className="text-gray-200 text-sm">Size: {item.size}</p>
      )}
    </div>
  )}
</div>
```

Note: the `backgroundImage` inline style is gone; the overlay/name markup is preserved (name block gains `z-10` so it stays above the image).

- [ ] **Step 5: Give the image slot a placeholder background in CSS**

In `styles/Masonry.css`, update the `.item-img` rule so empty slots show a neutral color instead of white flashes, and remove the now-unused background-image properties:

```css
.item-img {
  width: 100%;
  height: 100%;
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  background-color: #f3f4f6; /* placeholder while the image loads */
}
```

(Leave the `.item-img { transform: translateZ(0); }` performance rule further down the file as-is.)

- [ ] **Step 6: Build and lint**

Run: `npm run build`
Expected: Build succeeds. No error about `next/image` usage in `Masonry.js`.
Run: `npm run lint`
Expected: No new errors from `Masonry.js` (the browser `Image` reference is gone).

- [ ] **Step 7: Manually verify the gallery**

Run: `npm run dev`, open `http://localhost:3000/gallery`.
Expected: The masonry grid animates in immediately (does not stay blank waiting for downloads); images appear progressively; scrolling triggers lazy loads. In DevTools Network, gallery image requests go through `/_next/image?...` (not the raw `.jpg`).

- [ ] **Step 8: Commit**

```bash
git add components/Masonry.js styles/Masonry.css
git commit -m "perf: gallery uses lazy next/image and no longer blocks on full-size preload"
```

---

### Task 3: Hero LCP priority + `sizes`/`priority` audit — `pages/index.js`, `pages/products.js`, `pages/gallery.js`

`priority` should mark only the single above-the-fold LCP image; it is currently applied to images rendered inside `.map()` loops (eagerly loading everything), and the mobile hero `<Image fill>` has no `sizes` and no `priority`.

**Files:**
- Modify: `pages/index.js` (mobile hero carousel image ~line 248)
- Modify: `pages/products.js` (grid image with `priority` ~line 313)
- Modify: `pages/gallery.js` (image with `priority` ~line 118)

**Interfaces:**
- Consumes: Task 1 `images` config.
- Produces: no exported interface; visual/loading behavior only.

- [ ] **Step 1: Give the mobile hero image `priority` + `sizes`**

In `pages/index.js`, the mobile carousel `<Image>` (currently):
```jsx
<Image
  src={product.image}
  alt={product.name}
  fill
  className="object-cover group-hover:scale-105 transition-transform duration-700"
/>
```
becomes:
```jsx
<Image
  src={product.image}
  alt={product.name}
  fill
  sizes="85vw"
  priority={index === 0}
  className="object-cover group-hover:scale-105 transition-transform duration-700"
/>
```
(`85vw` matches the `w-[85vw]` card; only the first slide is the LCP candidate.)

- [ ] **Step 2: Remove misused `priority` in the products grid**

In `pages/products.js` around line 307–313, find the `<Image>` that has a bare `priority` prop and is rendered inside a product `.map()`. Remove the `priority` line so it uses default lazy loading. Confirm that `<Image>` has a `sizes` prop; if it does not, add:
```jsx
sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
```

- [ ] **Step 3: Fix `priority` in the gallery header image**

In `pages/gallery.js` around line 112–118, the `<Image>` with `priority`: if it is a single hero/header image above the fold, keep `priority` but ensure it has a `sizes` prop; if it is inside a `.map()`, remove `priority` and add the same `sizes` as Step 2. (Inspect the surrounding JSX to decide — the rule is: at most one `priority` image per page, and it must be above the fold.)

- [ ] **Step 4: Grep for any remaining `fill` without `sizes`**

Run:
```bash
grep -n "fill" pages/index.js pages/products.js pages/gallery.js
```
For every `next/image` using `fill`, confirm a `sizes` prop exists nearby. Add a sensible `sizes` to any that lack one (match the container's rendered width). Ignore non-image `fill="none"` on SVGs and `fill-current` on icons.

- [ ] **Step 5: Build + lint + manual check**

Run: `npm run build` → Expected: succeeds.
Run: `npm run lint` → Expected: clean.
Run `npm run dev`, open `/` and `/products`. In the browser console, Expected: no Next.js warnings like "Image with src ... has 'fill' but is missing 'sizes'" or "has both 'priority' and 'loading'". The homepage hero image should be among the first network requests.

- [ ] **Step 6: Commit**

```bash
git add pages/index.js pages/products.js pages/gallery.js
git commit -m "perf: mark only the LCP image priority and give every fill image a sizes"
```

---

### Task 4: Generate an OG image + centralize SEO metadata (`siteConfig` + `<Seo>`)

Fixes: social preview image (real, absolute URL), favicon, obsolete `keywords`, and the copy-paste drift across three `<Head>` blocks.

**Files:**
- Create: `scripts/gen-og-image.mjs`
- Create: `public/og-image.jpg` (generated output — a new asset, NOT a source edit)
- Create: `lib/siteConfig.js`
- Create: `components/Seo.js`
- Modify: `pages/index.js`, `pages/products.js`, `pages/gallery.js` (their `<Head>` metadata)
- Modify: `pages/_document.js` (site-wide favicon links)

**Interfaces:**
- Consumes: nothing from prior tasks.
- Produces:
  - `siteConfig` (default export of `lib/siteConfig.js`): `{ baseUrl: string, brand: string, ogImage: string (absolute), business: {...} }`.
  - `<Seo title description path ogImage? >` (default export of `components/Seo.js`): renders `<title>`, description, canonical, Open Graph, and Twitter tags. `path` is the route (e.g. `"/products"`); the component builds the absolute canonical/OG URLs from `siteConfig.baseUrl`.

- [ ] **Step 1: Write the OG image generator script**

Create `scripts/gen-og-image.mjs`. It resizes an existing (already reasonably-sized) product photo onto a 1200×630 branded canvas. It only reads a source and writes a NEW file — it never overwrites a source.

```js
// Generates public/og-image.jpg (1200x630) for social sharing.
// Reads an existing product photo; writes a NEW file. Does not modify sources.
import sharp from 'sharp';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const source = path.join(root, 'public', 'FEEL FRESH LARGE 1500ml.jpeg');
const out = path.join(root, 'public', 'og-image.jpg');

const WIDTH = 1200;
const HEIGHT = 630;

const product = await sharp(source)
  .resize({ width: 760, height: 560, fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
  .toBuffer();

await sharp({
  create: {
    width: WIDTH,
    height: HEIGHT,
    channels: 3,
    background: { r: 255, g: 255, b: 255 }, // brand-neutral; swap to burgundy if preferred
  },
})
  .composite([{ input: product, gravity: 'east' }])
  .jpeg({ quality: 82 })
  .toFile(out);

console.log('Wrote', out);
```

- [ ] **Step 2: Run the generator and verify the asset**

Run: `node scripts/gen-og-image.mjs`
Expected: prints `Wrote .../public/og-image.jpg`.
Run: `ls -la public/og-image.jpg` → Expected: a file well under 300 KB exists.

If `sharp` fails to import, install it as a direct dev dependency and retry:
```bash
npm install --save-dev sharp && node scripts/gen-og-image.mjs
```

- [ ] **Step 3: Create `lib/siteConfig.js`**

```js
const baseUrl = 'https://vistohomeware.com';

const siteConfig = {
  baseUrl,
  brand: 'Visto Homeware',
  ogImage: `${baseUrl}/og-image.jpg`,
  business: {
    telephone: '+91-98310-33736',
    email: 'smplastics@gmail.com',
    streetAddress: '1/2, Chanditala Branch Road',
    addressLocality: 'Kolkata',
    addressRegion: 'West Bengal',
    postalCode: '700053',
    addressCountry: 'IN',
    latitude: 22.5726,
    longitude: 88.3639,
  },
};

export default siteConfig;
```

- [ ] **Step 4: Create `components/Seo.js`**

```jsx
import Head from 'next/head';
import siteConfig from '@/lib/siteConfig';

export default function Seo({ title, description, path = '/', ogImage }) {
  const url = `${siteConfig.baseUrl}${path}`;
  const image = ogImage || siteConfig.ogImage;

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="robots" content="index, follow" />
      <meta name="author" content={siteConfig.brand} />
      <link rel="canonical" href={url} />

      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content={siteConfig.brand} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Head>
  );
}
```

- [ ] **Step 5: Add site-wide favicon links in `_document.js`**

Replace the `<Head />` self-closing tag in `pages/_document.js` with real favicon links (the repo has a proper `favicon.ico`):

```jsx
<Head>
  <link rel="icon" href="/favicon.ico" sizes="any" />
  <link rel="apple-touch-icon" href="/vh-logo.png" />
</Head>
```

- [ ] **Step 6: Migrate `pages/index.js` `<Head>` to `<Seo>`**

Add the import at the top of `pages/index.js`:
```js
import Seo from '@/components/Seo';
```
In the returned JSX, replace the title/description/keywords/viewport/icon/OG/Twitter/robots/author/canonical tags at the top of the existing `<Head>` with a single `<Seo>` element (rendered as a sibling, not inside another `Head`):
```jsx
<Seo
  title="Visto Homeware - Premium Kitchen Containers, Tiffin Boxes & Food Storage Solutions"
  description="India's leading brand for premium kitchen containers, airtight food storage, tiffin boxes, water bottles & household products. BPA-free, microwave safe containers. Free delivery across India."
  path="/"
/>
```
Keep the geo `<meta>` tags and the JSON-LD `<script>` blocks (those are handled in Task 5). They can remain inside a separate `<Head>` block below `<Seo>` — Next merges multiple `Head` instances. **Delete** the `keywords` meta tag entirely (obsolete). Ensure the old `og:image="/vh-logo.png"`, `twitter:image="/vh-logo.png"`, `<link rel="icon" href="/vh-logo.png" />`, title, description, canonical, robots, author, and OG/Twitter title/description lines are removed (now provided by `<Seo>`).

- [ ] **Step 7: Migrate `pages/products.js` `<Head>` to `<Seo>`**

Add `import Seo from '@/components/Seo';` and replace the equivalent metadata tags with:
```jsx
<Seo
  title="Premium Kitchen Containers & Food Storage Solutions | Visto Homeware"
  description="Shop premium kitchen containers, airtight food storage solutions, tiffin boxes & household products. BPA-free containers for modern kitchens. Free shipping across India."
  path="/products"
/>
```
Remove the page's own title/description/OG/Twitter/canonical/icon/keywords tags. Keep its JSON-LD `<script>` (handled in Task 5).

- [ ] **Step 8: Migrate `pages/gallery.js` `<Head>` to `<Seo>`**

Add `import Seo from '@/components/Seo';` and replace with:
```jsx
<Seo
  title="Product Gallery - Visto Homeware | Premium Kitchen Containers & Storage Solutions"
  description="Explore our complete visual gallery of premium kitchen containers, food storage solutions, tiffin boxes, and homeware products. High-quality airtight containers for modern kitchens."
  path="/gallery"
/>
```
Remove the page's own title/description/OG/Twitter/canonical/icon tags. Keep its JSON-LD `<script>` (handled in Task 5).

- [ ] **Step 9: Build + verify metadata**

Run: `npm run build` → Expected: succeeds.
Run `npm run dev`, then for each of `/`, `/products`, `/gallery` view page source and Expected:
- exactly one `<title>`, one canonical, one `og:image` and it is `https://vistohomeware.com/og-image.jpg` (absolute),
- no `keywords` meta,
- favicon resolves to `/favicon.ico`.

- [ ] **Step 10: Commit**

```bash
git add scripts/gen-og-image.mjs public/og-image.jpg lib/siteConfig.js components/Seo.js pages/index.js pages/products.js pages/gallery.js pages/_document.js
git commit -m "seo: real absolute OG image, correct favicon, drop keywords, centralize metadata"
```

---

### Task 5: Clean up structured data (JSON-LD) — remove fabricated ratings, absolute image URLs

**Files:**
- Modify: `pages/index.js` (two `application/ld+json` blocks)
- Modify: `pages/products.js` (`application/ld+json` block containing `aggregateRating`)
- Modify: `pages/gallery.js` (`application/ld+json` block, if any image URLs are relative)

**Interfaces:**
- Consumes: `siteConfig.baseUrl` (import `siteConfig` where useful for absolute URLs).
- Produces: policy-compliant JSON-LD.

- [ ] **Step 1: Remove every `aggregateRating` object**

In `pages/index.js` and `pages/products.js`, delete the `"aggregateRating": { ... }` property (and its trailing comma handling) from each JSON-LD object. Do NOT replace with invented numbers — omit entirely. Search to confirm none remain:
```bash
grep -rn "aggregateRating" pages/
```
Expected after edit: no matches.

- [ ] **Step 2: Make JSON-LD image URLs absolute**

In the JSON-LD objects, change relative `image` values (e.g. `"/vh-logo.png"`, `"/FEEL FRESH MEDIUM 800ml.jpg"`) to absolute using the base URL, e.g. `"https://vistohomeware.com/og-image.jpg"` for the business logo/image, and `` `${siteConfig.baseUrl}/FEEL FRESH MEDIUM 800ml.jpg` `` for product images. Import `siteConfig` at the top of the file if not already present:
```js
import siteConfig from '@/lib/siteConfig';
```
Confirm no relative `"image": "/` remain in JSON-LD:
```bash
grep -n '"image": "/' pages/index.js pages/products.js pages/gallery.js
```
Expected: no matches.

- [ ] **Step 3: Build + validate JSON-LD**

Run: `npm run build` → Expected: succeeds (JSON-LD is `JSON.stringify`'d, so a syntax slip fails the build).
Run `npm run dev`, view source on `/`, copy each `application/ld+json` block into your notes and confirm it is valid JSON with no `aggregateRating` and only absolute image URLs.

- [ ] **Step 4: Commit**

```bash
git add pages/index.js pages/products.js pages/gallery.js
git commit -m "seo: remove fabricated aggregateRating and use absolute JSON-LD image URLs"
```

---

### Task 6: Fix robots.txt, sitemap.xml, and repoint the catalogue link

**Files:**
- Modify: `public/robots.txt`
- Modify: `public/sitemap.xml`
- Modify: `pages/index.js` (Download Catalogue `<a href>` ~line 628)

**Interfaces:**
- Consumes: nothing.
- Produces: crawler-facing config; no code interface.

- [ ] **Step 1: Repoint the catalogue link in `index.js`**

In `pages/index.js` change:
```jsx
href="/product-catalogue.pdf"
```
to:
```jsx
href="/catalogue.pdf"
```
(Leave the `download="Visto-Homeware-Catalogue.pdf"` attribute as-is.)

- [ ] **Step 2: Fix `public/robots.txt`**

- Remove the line `Disallow: /_next/` (it blocks optimized images and render-critical JS/CSS).
- Change `Allow: /product-catalogue.pdf` to `Allow: /catalogue.pdf`.
- Keep `Disallow: /api/`. Keep the sitemap line.

Verify:
```bash
grep -n "_next\|catalogue" public/robots.txt
```
Expected: no `_next` line; catalogue line reads `/catalogue.pdf`.

- [ ] **Step 3: Fix `public/sitemap.xml`**

- Delete every `<url>` block whose `<loc>` contains a `?` (the `?search=…` and `?category=…` entries — not distinct content).
- Change the catalogue `<loc>` from `.../product-catalogue.pdf` to `.../catalogue.pdf`.
- Update each remaining `<lastmod>` from `2024-01-15` to `2026-07-10`.
- Keep the four real entries: `/`, `/products`, `/gallery`, `/catalogue.pdf`.

Verify:
```bash
grep -n "loc\|lastmod" public/sitemap.xml
```
Expected: four `<loc>` lines, none containing `?`, catalogue is `/catalogue.pdf`, all `lastmod` are `2026-07-10`.

- [ ] **Step 4: Manual verification of the catalogue button**

Run `npm run dev`, open `/`, click "Download Catalogue".
Expected: downloads/opens the new `catalogue.pdf` (1.85 MB), not the old 42 MB file.

- [ ] **Step 5: Commit**

```bash
git add public/robots.txt public/sitemap.xml pages/index.js
git commit -m "seo: unblock /_next in robots, prune query-string sitemap URLs, repoint catalogue to new PDF"
```

- [ ] **Step 6: Flag the orphaned old PDF (no delete)**

Report to the user: `public/product-catalogue.pdf` (42 MB) is now unreferenced and can be deleted to shrink the repo — awaiting their approval per the plan constraints. Do not delete it in this task.

---

## Final Verification (after all tasks)

- [ ] `npm run build` succeeds and `npm run lint` is clean.
- [ ] `npm run dev`: homepage paints fast, hero image is an early request; `/gallery` renders immediately and streams images; Network shows `/_next/image` AVIF/WebP variants (KB-scale, not MB).
- [ ] No console warnings about missing `sizes` or misused `priority`.
- [ ] View source on all three pages: single title/canonical, absolute `og:image` → `/og-image.jpg`, no `keywords`, favicon `/favicon.ico`.
- [ ] `grep -rn "aggregateRating" pages/` → no matches.
- [ ] `robots.txt` has no `/_next/` disallow; `sitemap.xml` lists only real routes + `/catalogue.pdf` with fresh `lastmod`.
- [ ] Download Catalogue serves `/catalogue.pdf`.

## Coverage check against the spec

- A1 gallery blocker → Task 2. A2 hero LCP → Task 3. A3 priority/sizes audit → Task 3. A4 next.config → Task 1. A5 placeholders → Task 2 (CSS bg) + Task 3.
- B1 OG image → Task 4. B2 structured data → Task 5. B3 robots → Task 6. B4 favicon → Task 4. B5 sitemap → Task 6. B6 keywords/alt/h1 → Task 4 (keywords) + Tasks 2/3 (alt); single-`h1` verified during manual checks. B7 centralize → Task 4.
- C catalogue → Task 6 (+ index.js href).
