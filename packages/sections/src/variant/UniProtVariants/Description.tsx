import { Link } from "ui";
import { identifiersOrgLink } from "../../utils/global";

type DescriptionProps = {
  variantId: string;
  data: any;
};

function Description({ variantId, data }: DescriptionProps) {
  return (
    <>
      Literature-based curation associating <strong>{variantId}</strong>{" "} to a disease/phenotype. Source:{" "}
      <Link external to={identifiersOrgLink("uniprot", data.variant.uniProtVariants[0].targetFromSourceId)}>
        UniProt
      </Link>
    </>
  );
}

export default Description;