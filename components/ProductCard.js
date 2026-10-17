import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { ArrowUpRight, Heart } from "lucide-react";
import { currentDesign } from "@/lib/designs";
import { categories } from "@/data/products";
export default function ProductCard({
  product,
  liked,
  onToggleLike,
  title = product.name,
  imageDimensions,
}) {
  const router = useRouter();
  const inCatalogue =
    router.pathname === "/products" || router.pathname === "/gallery";
  const href = {
    pathname: inCatalogue ? router.pathname : "/products",
    query: {
      ...(inCatalogue
        ? router.query
        : currentDesign(router.query) !== "everyday"
          ? { design: currentDesign(router.query) }
          : {}),
      product: product.id,
    },
  };
  return (
    <article className="product-card">
      <div
        className={
          imageDimensions ? "product-image natural-image" : "product-image"
        }
      >
        <Link
          href={href}
          shallow={inCatalogue}
          scroll={!inCatalogue}
          aria-label={`View ${product.name}`}
        >
          <Image
            src={product.img}
            alt={product.name}
            {...(imageDimensions
              ? { width: imageDimensions[0], height: imageDimensions[1] }
              : { fill: true })}
            sizes="(max-width: 600px) 90vw, (max-width: 1000px) 45vw, 25vw"
          />
        </Link>
        {product.isNew && <span className="product-badge">NEW TO VISTO</span>}
        {onToggleLike && (
          <button
            className="save-button"
            onClick={() => onToggleLike(product.id)}
            aria-label={liked ? "Remove from favorites" : "Add to favorites"}
            aria-pressed={liked}
          >
            <Heart size={18} fill={liked ? "currentColor" : "none"} />
          </button>
        )}
      </div>
      <div className="product-meta">
        <span>{categories.find((c) => c.id === product.category)?.name}</span>
        <span>{product.size}</span>
      </div>
      <Link
        className="product-title"
        href={href}
        shallow={inCatalogue}
        scroll={!inCatalogue}
      >
        <h3>{title}</h3>
        <ArrowUpRight size={19} />
      </Link>
    </article>
  );
}
