# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Dev server with Turbopack (http://localhost:3000)
npm run build    # Production build
npm start        # Serve production build
npm run lint     # ESLint (next/core-web-vitals)
```

No test framework is configured — there are no tests.

## Stack

Next.js 15 **Pages Router** (not App Router — there is no `app/` directory despite `./app/**` appearing in `tailwind.config.js` content globs). React 19, plain JavaScript (no TypeScript), Tailwind CSS 3, GSAP for animation, `lucide-react` for icons. Path alias `@/*` maps to the repo root (`jsconfig.json`).

## Architecture

This is a **static marketing/catalog site, not a transactional store.** There is no cart, checkout, payment, or backend persistence. Product CTAs ("Get Quote") scroll to the on-page contact section. `pages/api/hello.js` is the stock scaffold and unused.

**Single data source — `data/products.js`.** Every page `import`s the `products` array and helpers directly at module scope; there is no `getStaticProps`/`getServerSideProps`/`getStaticPaths` anywhere, so pages render from this static module at build time. The module also exports `categories`, `sizes`, `priceRanges`, and helper functions (`searchProducts`, `getProductsByCategory`, `getProductById`, etc.). To add or change a product, edit this file.

**Pages** (`pages/`): `index.js` (homepage — hero, carousel, stats, testimonials, contact), `products.js` (searchable/filterable grid), `gallery.js` (Masonry view), plus `_app.js`/`_document.js`.

### Conventions and gotchas

- **No shared layout.** The navbar and footer are copy-pasted inline into `index.js`, `products.js`, and `gallery.js`. A nav/footer change must be applied to all three files (and there is no `Layout` component to introduce one).
- **Products have no `price` field.** `pages/products.js` filters and sorts on `product.price` (the "Price: Low/High" sort options and the `priceRanges` filter), but since the field is absent these are silent no-ops. The prices in `README.md` are documentation only — they are not in the data. Don't assume price logic works; wire up a `price` field first if pricing is needed.
- **The homepage carousel duplicates product data.** `ProductCarousel` in `index.js` has its own hardcoded array — it does not read from `data/products.js`. Featured-product changes there are separate.
- **Image paths must match `public/` filenames exactly**, including literal spaces and inconsistent extensions (`.jpg` vs `.jpeg`), e.g. `/FEEL FRESH LONG 900ml..jpeg` (note the double dot). `product.img` / `product.images` are these exact strings. Adding a product means dropping the image in `public/` and referencing its exact name.

### SEO (a primary goal of this project)

Every page sets metadata via `next/head` (title, description, Open Graph, Twitter Card, canonical) **and** emits Schema.org JSON-LD with `<script type="application/ld+json">{JSON.stringify(...)}</script>`, built by mapping over `products`. Canonical/OG URLs are hardcoded to `https://vistohomeware.com`. `public/sitemap.xml` and `public/robots.txt` are static and maintained by hand. When adding a page or product, keep these in sync.

### Animation

GSAP with `ScrollTrigger`, registered behind a `typeof window !== 'undefined'` guard (it cannot run during SSR). `components/Masonry.js` is a custom absolute-positioned grid laid out and animated entirely with GSAP via `useMedia`/`useMeasure` hooks; it preloads images before animating and expects items shaped `{ id, img, height, name?, size?, url? }`. `gallery.js`'s `convertToMasonryItems` adapts products into that shape, synthesizing varied `height` values for the masonry effect.

### Styling

Tailwind with custom palettes in `tailwind.config.js`: **`burgundy`** (primary brand color, used as `burgundy-800`/`900`) and **`rose`**, plus custom `fade-in`/`slide-up`/`float` animations. Inter is loaded via `next/font/google` in `_app.js` and exposed as the CSS variable `--font-inter` (referenced by the Tailwind `sans` font family). Global styles live in `styles/globals.css`; Masonry-specific styles in `styles/Masonry.css`. ESLint disables `react/no-unescaped-entities`.
