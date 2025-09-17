import { Link, DisplayVariantId } from "ui";

type DescriptionProps = {
  variantId: string;
  referenceAllele: string;
  alternateAllele: string;
};

function Description({ variantId, referenceAllele, alternateAllele }: DescriptionProps) {
  return (
    <>
      Enhancer–gene regulatory region predictions overlapping with{" "}
      <strong>
        <DisplayVariantId
          variantId={variantId}
          referenceAllele={referenceAllele}
          alternateAllele={alternateAllele}
        />
      </strong>. Source:{" "}
      <Link to="https://doi.org/10.1101/2023.11.09.563812" external>
        ENCODE rE2G
      </Link>
    </>
  );
}

export default Description; 