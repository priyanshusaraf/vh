import Catalogue from "@/components/Catalogue";
import Seo, { JsonLd } from "@/components/Seo";
import { products } from "@/data/products";
import siteConfig from "@/lib/siteConfig";
import { productPath } from "@/lib/catalog";

export default function Products() {
  return (
    <>
      <Seo
        title="All Products | Visto Homeware, Kolkata"
        description={`Browse all ${products.length} Visto Homeware products: airtight food containers, container sets, lunch boxes, water bottles, mugs, casseroles and household essentials. Retail and wholesale enquiries welcome.`}
        path="/products"
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "Visto Homeware products",
          numberOfItems: products.length,
          itemListElement: products.map((p, i) => ({
            "@type": "ListItem",
            position: i + 1,
            url: siteConfig.baseUrl + productPath(p),
            name: p.name,
          })),
        }}
      />
      <Catalogue />
    </>
  );
}
