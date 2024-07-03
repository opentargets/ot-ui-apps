import { Link } from "ui";

type DescriptionProps = {
  variantId: string;
};

function Description({ variantId }: DescriptionProps) {
  return (
    <>
      molQTL 99% credible sets containing <strong>{variantId}</strong>. Source{" "}
      <Link external to="https://www.ebi.ac.uk/eqtl/" >
        eQTL Catalog
      </Link>
    </>
  );
}

export default Description;