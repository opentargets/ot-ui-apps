import { Link } from "ui";

type DescriptionProps = {
  variantId: string;
};

function Description({ variantId }: DescriptionProps) {
  return (
    <>
      Variant consequence prediction for <strong>{variantId}</strong>. {" "}Source:{" "}
      <Link to="https://www.ensembl.org/info/docs/tools/vep/index.html" external>
        VEP
      </Link>
    </>
  );
}

export default Description;