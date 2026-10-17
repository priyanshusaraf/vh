import Link from "next/link";
import SiteLayout from "@/components/SiteLayout";
import Seo from "@/components/Seo";
import { categoryList } from "@/lib/categories";
import { categoryPath } from "@/lib/catalog";

export default function NotFound() {
  return (
    <SiteLayout>
      <Seo
        title="Page not found | Visto Homeware"
        description="This page doesn't exist. Browse Visto Homeware products by category."
        path="/404"
        noindex
      />
      <section className="not-found wrap">
        <h1>This page doesn't exist</h1>
        <p>The link may be old or mistyped. Pick a category to keep browsing.</p>
        <div className="not-found-links">
          {categoryList.map((c) => (
            <Link key={c.id} href={categoryPath(c.id)}>
              {c.name}
            </Link>
          ))}
        </div>
        <Link className="button button-red" href="/products">
          Browse all products
        </Link>
      </section>
    </SiteLayout>
  );
}
