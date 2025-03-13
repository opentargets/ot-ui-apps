import { Link } from "ui";

type DescriptionProps = {
  studyId: string;
};

function Description({ studyId }: DescriptionProps) {
  return (
    <>
      GWAS studies that share traits with study <strong>{studyId}</strong>. Source{" "}
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
