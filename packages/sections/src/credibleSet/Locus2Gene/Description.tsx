import { ReactElement } from "react";
import { Link } from "ui";

function Description(): ReactElement {
  return (
    <>
      Gene assignment based on machine-learning prioritisation of credible set features [Feature
      metrics coming soon]. Source:{" "}
      <Link to="https://home.opentargets.org/merged-product-documentation" external>
        Open Targets
      </Link>
    </>
  );
}

export default Description;
