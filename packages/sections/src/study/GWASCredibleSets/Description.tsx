import { Link } from "ui";

type DescriptionProps = {
  studyId: string;
};

function Description({ studyId }: DescriptionProps) {
  return (
    <>
      95% GWAS credible sets associated with study <strong>{studyId}</strong>. Source{" "}
      <Link to="https://home.opentargets.org/merged-product-documentation" external>
        Open Targets
      </Link>
    </>
  );
}

export default Description;
