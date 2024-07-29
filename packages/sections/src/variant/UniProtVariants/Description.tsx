import { Link } from "ui";
import { identifiersOrgLink } from "../../utils/global";

type DescriptionProps = {
  variantId: string;
  data: any;
};

function Description({ variantId, data }: DescriptionProps) {
  const { targetFromSourceId } = data.variant.uniProtVariants[0];
  return (
    <>
      Literature-based curation associating <strong>{variantId}</strong>{" "} to a disease/phenotype. Source:{" "}
      <Link external to={identifiersOrgLink("uniprot", targetFromSourceId)}>
        UniProt ({targetFromSourceId})
      </Link>
    </>
  );
}

export default Description;