// Run with: node scripts/check-designs.mjs (no test framework needed).
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

// The Next.js project transpiles .js modules; load this standalone helper as ESM.
const source = await readFile(
  new URL("../lib/designs.js", import.meta.url),
  "utf8",
);
const { designs, currentDesign, designHref } = await import(
  `data:text/javascript,${encodeURIComponent(source)}`
);

assert.deepEqual(
  designs.map((d) => d.id),
  ["everyday", "showroom", "bold"],
);
assert.equal(currentDesign({}), "everyday");
assert.equal(currentDesign({ variant: "bold" }), "bold");
assert.equal(currentDesign({ design: "showroom" }), "showroom");
assert.equal(currentDesign({ design: "editorial" }), "everyday");
assert.equal(designHref("/#contact", "showroom"), "/concepts/showroom#contact");
assert.equal(designHref("/concepts/bold", "everyday"), "/");
assert.equal(designHref("/gallery", "bold"), "/gallery?design=bold");
assert.equal(designHref("/catalogue.pdf", "bold"), "/catalogue.pdf");
assert.equal(
  designHref("mailto:smplastics@gmail.com", "showroom"),
  "mailto:smplastics@gmail.com",
);
assert.equal(designHref("/concepts", "showroom"), "/concepts");
const product = new URL(
  designHref(
    "/products?search=coffee&category=drinkware&product=ch-2&design=bold",
    "showroom",
  ),
  "http://localhost",
);
assert.equal(product.searchParams.get("search"), "coffee");
assert.equal(product.searchParams.get("category"), "drinkware");
assert.equal(product.searchParams.get("product"), "ch-2");
assert.equal(product.searchParams.get("design"), "showroom");
assert.equal(
  new URL(
    designHref(product.pathname + product.search, "everyday"),
    "http://localhost",
  ).searchParams.has("design"),
  false,
);
console.log(
  "Passed: design selection, internal/external links, anchors, filter and product preservation.",
);
