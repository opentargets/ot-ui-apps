import { ReactElement } from "react";
import { Link } from "ui";

function Description(): ReactElement {
  return (
    <>
      Source: <Link to="../">Open Targets</Link>
    </>
  );
}

export default Description;
