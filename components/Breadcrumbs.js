import Link from "next/link";
import { JsonLd } from "@/components/Seo";
import siteConfig from "@/lib/siteConfig";

// Visible breadcrumb trail plus the matching BreadcrumbList structured data.
// The last item is the current page and has no href.
export default function Breadcrumbs({ items }) {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: items.map((item, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: item.name,
            ...(item.href && { item: siteConfig.baseUrl + item.href }),
          })),
        }}
      />
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <ol>
          {items.map((item) => (
            <li key={item.name}>
              {item.href ? (
                <Link href={item.href}>{item.name}</Link>
              ) : (
                <span aria-current="page">{item.name}</span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
