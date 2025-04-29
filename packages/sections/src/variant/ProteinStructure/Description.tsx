import { Link, DisplayVariantId } from "ui";

type DescriptionProps = {
  variantId: string;
  referenceAllele: string;
  alternateAllele: string;
  targetId: string;
};

// !! HARD CODE SOME OF DESCRIPTIPN FOR NOW !!
function Description({ variantId, referenceAllele, alternateAllele, targetId }: DescriptionProps) {
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
      overlaps <Link to={`/target/${targetId}`}>{targetId}</Link> at positions XXXX. Source:{" "}
      <Link to="/">Open Targets</Link> and{" "}
      <Link external to="https://www.uniprot.org/">
        UniProt
      </Link>
      .
    </>
  );
}

export default Description;
