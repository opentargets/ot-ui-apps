import { Link } from "ui";

function Description() {
  return (
    <>
      Set of variants with 95% probability of containing the causal variant. Source:{" "}
      <Link to="https://home.opentargets.org/merged-product-documentation" external>
        Open Targets
      </Link>
    </>
  );
}

export default Description;
