export const designs = [
  {
    id: "everyday",
    name: "Everyday",
    description: "Light, calm and product-led. The original redesign.",
    href: "/",
    image: "/new-products/G-12.jpg",
  },
  {
    id: "showroom",
    name: "Showroom",
    description:
      "Light pages with large product photography, dark image overlays and clear category browsing.",
    href: "/concepts/showroom",
    image: "/Container_005.jpg",
  },
  {
    id: "bold",
    name: "Bold",
    description:
      "Full of colour and character. Confident red, playful compositions and rounded details.",
    href: "/concepts/bold",
    image: "/new-products/G-14.jpg",
  },
];

export function currentDesign(query) {
  const requested = query.design || query.variant;
  return designs.some((d) => d.id === requested) ? requested : "everyday";
}

export function designHref(href, design) {
  if (
    typeof href !== "string" ||
    !href.startsWith("/") ||
    href.startsWith("//")
  )
    return href;
  const [pathAndQuery, hash] = href.split("#");
  const [pathname, search] = pathAndQuery.split("?");
  const query = new URLSearchParams(search);
  let path = pathname;
  if (path === "/" || designs.some((d) => d.href === path)) {
    path = designs.find((d) => d.id === design)?.href || "/";
    query.delete("design");
  } else if (path === "/products" || path === "/gallery") {
    if (design === "everyday") query.delete("design");
    else query.set("design", design);
  }
  return (
    path + (query.size ? "?" + query.toString() : "") + (hash ? "#" + hash : "")
  );
}
