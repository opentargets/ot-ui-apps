import { Link } from "ui";

type DescriptionProps = {
  studyId: string;
};

function Description({ studyId }: DescriptionProps) {
  return (
    <>
      95% GWAS credible sets associated with study <strong>{studyId}</strong>. Source{" "}
      <Link to="https://platform-docs.opentargets.org/study#gwas-molqtl-credible-sets" external>
        Open Targets
      </Link>
    </>
  );
}

export default Description;
