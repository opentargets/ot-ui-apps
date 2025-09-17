import { Link } from "ui";

function Description() {
  return (
    <>
      Set of variants with 95% probability of containing the causal variant. Source:{" "}
      <Link to="https://platform-docs.opentargets.org/credible-set#credible-set-variants" external>
        Open Targets
      </Link>
    </>
  );
}

export default Description;
