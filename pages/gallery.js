import Catalogue from "@/components/Catalogue";
import Seo from "@/components/Seo";
import { products } from "@/data/products";
import imageSizes from "@/data/image-sizes.json";

// Photo sizes let the gallery show every photo uncropped, at its own shape.
export function getStaticProps() {
  return {
    props: {
      photoSizes: Object.fromEntries(
        products
          .filter((p) => imageSizes[p.img])
          .map((p) => [p.id, imageSizes[p.img]]),
      ),
    },
  };
}

export default function Gallery({ photoSizes }) {
  return (
    <>
      <Seo
        title="Product Gallery | Visto Homeware"
        description="See Visto Homeware food containers, lunch boxes, water bottles, mugs and casseroles in real kitchens and homes."
        path="/gallery"
      />
      <Catalogue gallery photoSizes={photoSizes} />
    </>
  );
}
