import type { ReactElement } from "react";
import { Link } from "ui";

function Description(): ReactElement {
  return (
    <>
      Gene assignment based on machine-learning prioritisation of credible set features. Only scores
      above 0.05 are shown. Source:{" "}
      <Link to="https://platform-docs.opentargets.org/credible-set#locus-to-gene-l2g" external>
        Open Targets
      </Link>
    </>
  );
}

export default Description;
