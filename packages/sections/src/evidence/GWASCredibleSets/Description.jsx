import { Link } from "ui";

function Description({ symbol, name }) {
  return (
    <>
      95% GWAS credible sets prioritising <strong>{symbol}</strong> as likely causal gene for{" "}
      <strong>{name}</strong>. Source:{" "}
      <Link to="https://home.opentargets.org/merged-product-documentation" external>
        Open Targets
      </Link>
    </>
  );
}

export default Description;
