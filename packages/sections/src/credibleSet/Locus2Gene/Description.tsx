import { ReactElement } from "react";
import { Link } from "ui";

function Description(): ReactElement {
  return (
    <>
      Gene assignment based on machine-learning prioritisation of credible set derived features. Source:{" "}
      <Link to="../">Open Targets</Link>
    </>
  );
}

export default Description;
