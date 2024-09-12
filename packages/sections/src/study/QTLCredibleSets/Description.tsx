import { Link } from "ui";

type DescriptionProps = {
  studyId: string;
};

function Description({ studyId }: DescriptionProps) {
  return (
    <>
      molQTL 99% credible sets associated with study{" "}
      <strong>{studyId}</strong>. Source{" "}
      <Link external to="https://www.ebi.ac.uk/eqtl/" >
        eQTL Catalog
      </Link>
    </>
  );
}

export default Description;