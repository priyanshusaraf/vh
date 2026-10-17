import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import { getCategory } from "@/lib/categories";
import { productPath } from "@/lib/catalog";

export default function ProductCard({ product, liked, onToggleLike, priority = false }) {
  const href = productPath(product);
  // Long sizes such as "350+250*2+75+400 =1325 ml" are already in the name.
  const size =
    product.size?.length <= 12 && !product.name.includes(product.size)
      ? product.size
      : null;
  return (
    <article className="product-card">
      <div className="product-image">
        <Link href={href} tabIndex={-1} aria-hidden="true">
          <Image
            src={product.img}
            alt={product.name}
            fill
            priority={priority}
            sizes="(max-width: 760px) 46vw, (max-width: 1100px) 30vw, 22vw"
          />
        </Link>
        {onToggleLike && (
          <button
            className="save-button"
            onClick={() => onToggleLike(product.id)}
            aria-label={
              liked
                ? `Remove ${product.name} from saved`
                : `Save ${product.name}`
            }
            aria-pressed={liked}
          >
            <Heart size={18} fill={liked ? "currentColor" : "none"} />
          </button>
        )}
      </div>
      <div className="product-meta">
        <span>{getCategory(product.category)?.name}</span>
        {size && <span>{size}</span>}
      </div>
      <h3 className="product-title">
        <Link href={href}>{product.name}</Link>
      </h3>
    </article>
  );
}
