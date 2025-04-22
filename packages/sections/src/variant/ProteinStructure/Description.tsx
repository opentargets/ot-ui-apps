import { Link, DisplayVariantId } from "ui";

type DescriptionProps = {
  variantId: string;
  referenceAllele: string;
  alternateAllele: string;
};

// !! HARD CODE SOME OF DESCRIPTIPN FOR NOW !!
function Description({ variantId, referenceAllele, alternateAllele }: DescriptionProps) {
  return (
    <>
      Variant{" "}
      <strong>
        <DisplayVariantId
          variantId={variantId}
          referenceAllele={referenceAllele}
          alternateAllele={alternateAllele}
        />
      </strong>{" "}
      overlaps <strong>KRAS</strong> at positions 51-53. Source: <Link to="/">Open Targets</Link>{" "}
      and{" "}
      <Link external to="https://www.uniprot.org/">
        UniProt
      </Link>
      .
    </>
  );
}

export default Description;
