# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Dev server with Turbopack (http://localhost:3000)
npm run build    # Production build
npm start        # Serve production build
npm run lint     # ESLint (next/core-web-vitals)
node scripts/generate-icons.mjs   # Rebuild favicon/app icons from public/vh-logo.png
node scripts/image-sizes.mjs      # Record photo sizes in data/image-sizes.json; re-run after adding photos
```

No test framework is configured — there are no tests.

## Stack

Next.js 15 **Pages Router** (not App Router — there is no `app/` directory despite `./app/**` appearing in `tailwind.config.js` content globs). React 19, plain JavaScript (no TypeScript), `lucide-react` for icons, Inter via `next/font/google`. Styling is plain CSS in `styles/globals.css` (Tailwind is installed but the pages don't use its classes). Path alias `@/*` maps to the repo root (`jsconfig.json`).

## Architecture

A **catalogue and enquiry site, not a store.** There is no cart, checkout or pricing. Conversions are catalogue downloads, WhatsApp chats, calls and contact-form enquiries.

**Data.** `data/products.js` holds every product; edit it to add or change products. `lib/categories.js` holds the category list, each category's search title/description and its homepage tile image; `data/products.js` builds `categories` (with counts) from it. Products have no `price`. Their `rating`/`reviews` fields are not real reviews: never show them or put them in structured data. Image paths must match `public/` filenames exactly, including spaces and odd extensions (e.g. `/FEEL FRESH LONG 900ml..jpeg`). `data/image-sizes.json` lets the gallery and product pages show photos uncropped at their own shape; photos missing from it fall back to a square box.

**URLs** come from `lib/catalog.js`: categories at `/products/[category]`, products at `/products/[category]/[slug]`. The slug is the slugified product name unless `SLUGS` in `lib/catalog.js` gives a shorter one. Renaming a product changes its URL unless it has a `SLUGS` entry, so when a URL changes, add `[old, new]` to `data/url-redirects.json`; `next.config.mjs` turns those into permanent redirects. Old `/products?product=<id>` and `/products?category=<id>` links are redirected client-side by `components/Catalogue.js`.

**Pages.**
- `index.js`: homepage. `getStaticProps` passes only the products shown, so the full catalogue isn't bundled.
- `products/index.js`, `products/[category]/index.js` and `gallery.js` all render `components/Catalogue.js`, which handles search (`?search=`), "show more" (`?show=`), saved favourites (localStorage key `visto:liked`) and category tabs. Tabs are links on catalogue pages and `?category=` filters on the gallery.
- `products/[category]/[slug].js`: product page with WhatsApp and quote buttons.
- `contact.js` and `api/contact.js`: the enquiry form. See below.
- `sitemap.xml.js` is generated from the data, so don't add a static `public/sitemap.xml` (it would conflict). Also `404.js`.

`components/SiteLayout.js` is the shared header, contact strip (hidden on `/contact`), footer and WhatsApp button. Business details (phone, WhatsApp number, email, GSTIN, address, map) live in `lib/siteConfig.js`.

**Contact form.** `/api/contact` validates with `lib/enquiry.js` (shared with the page), drops honeypot submissions and emails the enquiry through Resend. It needs `RESEND_API_KEY`; `CONTACT_TO_EMAIL` and `CONTACT_FROM_EMAIL` are optional (see `.env.example`). Without the key it returns 503, and the page offers to send the same message on WhatsApp or by email.

**Analytics.** `lib/track.js` sends Vercel Analytics custom events (`catalogue_download`, `whatsapp_click`, `enquiry_sent`), which are only recorded on paid Vercel plans.

### SEO

Every page uses `components/Seo.js` (title, description, canonical, Open Graph) and `JsonLd` for structured data:
- Organization on the homepage and LocalBusiness on the contact page.
- ItemList on `/products` and CollectionPage on each category page.
- Product plus BreadcrumbList on product pages.

Canonical and Open Graph URLs use `siteConfig.baseUrl` (`https://www.vistohomeware.com`; the bare domain redirects to www, so canonicals must use www). Product titles and descriptions come from each product's `seo` field, falling back to its name and description.

### Design rules (from the client)

- Keep the calm, light "Everyday" look: white pages, the logo's red (`--red`) as the accent, black and white otherwise, Inter for all text.
- No eyebrow labels, taglines or subtitles above or below headings, and no text over product photos. Headings stand alone, followed by content or a button.
- No loud full-bleed colour blocks or gimmicky layouts on the homepage.
- The catalogue download is the first button on the homepage.
