import { Link, DisplayVariantId } from "ui";
import { identifiersOrgLink } from "../../utils/global";

type DescriptionProps = {
  variantId: string;
  referenceAllele: string;
  alternateAllele: string;
  evidences: any;
};

function Description({
      variantId,
      referenceAllele,
      alternateAllele,
      evidences,
    }: DescriptionProps) {
  
  const { targetFromSourceId } = evidences.rows[0];
  
  return (
    <>
      Literature-based curation associating{" "}
      <strong>
        <DisplayVariantId
          variantId={variantId}
          referenceAllele={referenceAllele}
          alternateAllele={alternateAllele}
        />
      </strong>
      {" "} to a disease/phenotype. Source:{" "}
      <Link external to={identifiersOrgLink("uniprot", targetFromSourceId)}>
        UniProt ({targetFromSourceId})
      </Link>
    </>
  );
}

export default Description;