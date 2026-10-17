import Catalogue from "@/components/Catalogue";
import Seo, { JsonLd } from "@/components/Seo";
import { products } from "@/data/products";
import { categoryList, getCategory } from "@/lib/categories";
import siteConfig from "@/lib/siteConfig";
import { absoluteUrl, categoryPath, productPath } from "@/lib/catalog";

export function getStaticPaths() {
  return {
    paths: categoryList
      .filter((c) => products.some((p) => p.category === c.id))
      .map((c) => ({ params: { category: c.id } })),
    fallback: false,
  };
}

export function getStaticProps({ params }) {
  return { props: { categoryId: params.category } };
}

export default function CategoryPage({ categoryId }) {
  const category = getCategory(categoryId);
  const items = products.filter((p) => p.category === categoryId);
  return (
    <>
      <Seo
        title={`${category.title} | Visto Homeware`}
        description={category.description}
        path={categoryPath(categoryId)}
        ogImage={absoluteUrl(category.image)}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: category.title,
          url: siteConfig.baseUrl + categoryPath(categoryId),
          mainEntity: {
            "@type": "ItemList",
            numberOfItems: items.length,
            itemListElement: items.map((p, i) => ({
              "@type": "ListItem",
              position: i + 1,
              url: siteConfig.baseUrl + productPath(p),
              name: p.name,
            })),
          },
        }}
      />
      <Catalogue categoryId={categoryId} />
    </>
  );
}
