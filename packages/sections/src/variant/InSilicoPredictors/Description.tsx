import { Link } from "ui";

type DescriptionProps = {
  variantId: string;
};

function Description({ variantId }: DescriptionProps) {
  return (
    <>
      Predicted functional effect of <strong>{variantId}</strong>. {" "}Source:{" "}
      <Link to="https://www.ensembl.org/info/docs/tools/vep/index.html" external>
        VEP
      </Link>
      ,{" "}
      <Link to="https://gnomad.broadinstitute.org/" external>
        gnomAD
      </Link>
    </>
  );
}

export default Description;