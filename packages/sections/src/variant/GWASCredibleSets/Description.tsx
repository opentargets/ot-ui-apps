import { Link } from "ui";

type DescriptionProps = {
  variantId: string;
};

function Description({ variantId }: DescriptionProps) {
  return (
    <>
      GWAS 99% credible sets containing <strong>{variantId}</strong>. Source{" "}
      <Link to="../" >
        Open Targets
      </Link>
    </>
  );
}

export default Description;