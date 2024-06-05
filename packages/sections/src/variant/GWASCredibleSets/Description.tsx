import { Link } from "ui";

type DescriptionProps = {
  variantId: string;
};

function Description({ variantId }: DescriptionProps) {
  return (
    <>
      GWAS credible sets containing <strong>{variantId}</strong>. Source{" "}
      <Link to="https://www.ebi.ac.uk/gwas/" external>
        GWAS Catalog
      </Link>
      ,{" "}
      <Link to="https://www.finngen.fi/en" external>
        FinnGen
      </Link>
    </>
  );
}

export default Description;