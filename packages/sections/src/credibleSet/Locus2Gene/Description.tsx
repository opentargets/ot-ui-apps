import { ReactElement } from "react";
import { Link } from "ui";

function Description(): ReactElement {
  return (
    <>
      Genes prioritised by the L2G pipelines within this credible set. Source:{" "}
      <Link to="../">Open Targets</Link>
    </>
  );
}

export default Description;
