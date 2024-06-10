import { Link } from "ui";

type DescriptionProps = {
  variantId: string;
};

function Description({ variantId }: DescriptionProps) {
  return (
    <>
      Genotypes in <strong>{variantId}</strong> known to affect drug response. Source:{" "}
      <Link external to="https://www.pharmgkb.org/">
        PharmGKB
      </Link>
      .
    </>
  );
}

export default Description;