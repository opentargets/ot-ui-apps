import { Link, DisplayVariantId } from "ui";
import { identifiersOrgLink } from "../../utils/global";

type DescriptionProps = {
  variantId: string;
  referenceAllele: string;
  alternateAllele: string;
  data: any;
};

function Description({ variantId, data }: DescriptionProps) {
  const { targetFromSourceId } = data.variant.uniProtVariants[0];
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