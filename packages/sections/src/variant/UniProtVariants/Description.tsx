import { Link, DisplayVariantId } from "ui";
import { identifiersOrgLink } from "@ot/utils";

type DescriptionProps = {
  variantId: string;
  referenceAllele: string;
  alternateAllele: string;
  targetFromSourceId: string | null;
};

function Description({
  variantId,
  referenceAllele,
  alternateAllele,
  targetFromSourceId,
}: DescriptionProps) {
  if (!targetFromSourceId) return;
  return (
    <>
      Literature-based curation associating{" "}
      <strong>
        <DisplayVariantId
          variantId={variantId}
          referenceAllele={referenceAllele}
          alternateAllele={alternateAllele}
        />
      </strong>{" "}
      to a disease/phenotype. Source:{" "}
      {targetFromSourceId && (
        <Link external to={identifiersOrgLink("uniprot", targetFromSourceId)}>
          UniProt ({targetFromSourceId})
        </Link>
      )}
    </>
  );
}

export default Description;
