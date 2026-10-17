import Link from "next/link";
import { useRouter } from "next/router";
import { currentDesign, designHref } from "@/lib/designs";

export default function DesignLink({ href, ...props }) {
  const router = useRouter();
  return (
    <Link href={designHref(href, currentDesign(router.query))} {...props} />
  );
}
