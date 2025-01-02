import { Link } from "ui";

type DescriptionProps = {
  studyId: string;
};

function Description({ studyId }: DescriptionProps) {
  return (
    <>
      molQTL credible sets associated with study <strong>{studyId}</strong>. Source{" "}
      <Link external to="https://www.ebi.ac.uk/eqtl/">
        eQTL Catalog
      </Link>
      ,{" "}
      <Link external to="https://www.synapse.org/Synapse:syn51364943/wiki/622119">
        UKB-PPP
      </Link>
    </>
  );
}

export default Description;
