import { Link } from "ui";

type DescriptionProps = {
  studyId: string;
};

function Description({ studyId }: DescriptionProps) {
  return (
    <>
      GWAS studies that share associated traits with study {" "}
      <strong>{studyId}</strong>. Source{" "}
      <Link external to="https://www.ebi.ac.uk/gwas/studies" >
        GWAS Catalog
      </Link>
      ,{" "}
      <Link external to="https://r10.finngen.fi" >
        FinnGenR10
      </Link>
    </>
  );
}

export default Description;