import Catalogue from "@/components/Catalogue";
import Seo from "@/components/Seo";

export default function Gallery() {
  return (
    <>
      <Seo
        title="Product Gallery | Visto Homeware"
        description="See Visto Homeware food containers, lunch boxes, water bottles, mugs and casseroles in real kitchens and homes."
        path="/gallery"
      />
      <Catalogue gallery />
    </>
  );
}
