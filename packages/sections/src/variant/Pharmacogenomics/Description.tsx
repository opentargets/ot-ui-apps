import { Link, DisplayVariantId } from "ui";

type DescriptionProps = {
  variantId: string;
  referenceAllele: string;
  alternateAllele: string;
};

function Description({ variantId, referenceAllele, alternateAllele }: DescriptionProps) {
  return (
    <>
      Genotypes in{" "}
      <strong>
        <DisplayVariantId
          variantId={variantId}
          referenceAllele={referenceAllele}
          alternateAllele={alternateAllele}
        />
      </strong>{" "}
      known to affect drug response. Source:{" "}
      <Link external to="https://www.pharmgkb.org/">
        PharmGKB
      </Link>
      .
    </>
  );
}

export default Description;
