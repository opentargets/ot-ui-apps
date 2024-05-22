import { Link } from "ui";

type DescriptionProps = {
  variantId: string;
};

function Description({ variantId }: DescriptionProps) {
  return (
    <>
      Literature-based curation associating <strong>{variantId}</strong>{" "} to disease evidence. Source:{" "}
      <Link to="https://www.uniprot.org" external>
        UniProt
      </Link>
    </>
  );
}

export default Description;