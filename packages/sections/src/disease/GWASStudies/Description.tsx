import { Link } from "ui";

type DescriptionProps = {
  name: string;
};

function Description({ name }: DescriptionProps) {
  return (
    <>
      GWAS associated with <strong>{name}</strong>. Source:{" "}
      <Link external to="https://www.ebi.ac.uk/gwas/studies">
        GWAS Catalog
      </Link>
      ,{" "}
      <Link external to="https://r12.finngen.fi">
        FinnGen
      </Link>
      .
    </>
  );
}

export default Description;
