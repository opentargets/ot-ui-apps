import { Link } from "ui";

function Description({ name }) {
  return (
    <>
      GWAS studies associated with <strong>{name}</strong>. Source:{" "}
      <Link external to="https://www.ebi.ac.uk/gwas/studies" >
        GWAS Catalog
      </Link>
      ,{" "}
      <Link external to="https://r10.finngen.fi" >
        FinnGen
      </Link>
      .
    </>
  );
}

export default Description;
