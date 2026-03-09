import { Link } from "ui";

function Description({ name }: any) {
  return (
    <>
      Investigational and approved drugs for <strong>{name}</strong> curated from clinical trial
      records and post-marketing package inserts. Source:{" "}
      <Link to="https://www.ebi.ac.uk/chembl/" external>
        ChEMBL
      </Link>
      {" "}and{" "}
      <Link to="https://platform-docs.opentargets.org/disease-or-phenotype/drugs" external>
        Open Targets
      </Link>
      .
    </>
  );
}

export default Description;
