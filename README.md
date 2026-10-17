# Visto Homeware

The website for Visto Homeware, Kolkata: a catalogue of food containers, container sets, lunch boxes, water bottles, drinkware, casseroles and household products, with enquiries by WhatsApp, phone, email and a contact form. Built with Next.js 15 (Pages Router) and deployed on Vercel.

## Running it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
```

## Pages

| URL | What it is |
| --- | --- |
| `/` | Homepage |
| `/products` | All products, with search and saved favourites |
| `/products/<category>` | One page per category, e.g. `/products/water-bottles` |
| `/products/<category>/<product>` | One page per product |
| `/gallery` | Product photos in a gallery layout |
| `/contact` | Enquiry form, WhatsApp, phone, email and map |
| `/sitemap.xml` | Generated from the product data |

## Editing content

- **Products:** `data/products.js`. Put the photo in `public/` and use its exact filename.
- **Categories:** `lib/categories.js`, including each category's search title and description.
- **Business details** (phone, WhatsApp, email, GSTIN, address): `lib/siteConfig.js`.
- **Catalogue PDF:** `public/catalogue.pdf`. Update the size label in `lib/siteConfig.js` if the file changes.
- **Favicon and app icons:** run `node scripts/generate-icons.mjs` after changing `public/vh-logo.png`.

## Contact form email

The form emails enquiries through [Resend](https://resend.com). In Vercel, under Project Settings > Environment Variables, set:

- `RESEND_API_KEY` (required)
- `CONTACT_TO_EMAIL`: where enquiries go. Defaults to the business email.
- `CONTACT_FROM_EMAIL`: a sender on a domain verified in Resend. Without one, Resend only delivers to the email address that owns the Resend account.

Until the key is set, the form offers to send the enquiry on WhatsApp or by email instead, with the message filled in.
