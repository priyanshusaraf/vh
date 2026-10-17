import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { ChevronDown, Layers, Grid2X2 } from "lucide-react";
import { currentDesign, designs, designHref } from "@/lib/designs";

export default function DesignSwitcher() {
  const router = useRouter();
  const [expanded, setExpanded] = useState(true);
  const active = currentDesign(router.query);
  if (router.pathname === "/concepts") return null;
  const context = ["/products", "/gallery"].includes(router.pathname)
    ? router.asPath
    : "/";
  return (
    <aside
      className={"design-switcher " + (!expanded ? "is-collapsed" : "")}
      aria-label="Design previews"
    >
      <button
        className="design-switcher-label"
        aria-expanded={expanded}
        aria-controls="design-options"
        onClick={() => setExpanded(!expanded)}
      >
        <Layers size={14} />
        <span>
          {expanded
            ? "DESIGN PREVIEW"
            : designs.find((d) => d.id === active).name}
        </span>
        <ChevronDown size={14} />
      </button>
      {expanded && (
        <nav id="design-options" aria-label="Choose a design">
          {designs.map((d) => (
            <Link
              key={d.id}
              href={designHref(context, d.id)}
              className={active === d.id ? "selected" : ""}
              aria-current={active === d.id ? "page" : undefined}
            >
              {d.name}
            </Link>
          ))}
          <Link
            href="/concepts"
            className="compare-link"
            aria-label="Compare all designs"
          >
            <Grid2X2 size={15} />
          </Link>
        </nav>
      )}
    </aside>
  );
}
