import { Link } from "ui";

function Description({ symbol }) {
  return (
    <>
      Genetic variants in that are associated with the response to{" "}
      <Link to={`/drug/drugid`}>drugid</Link>
      Source:{" "}
      <Link external to="https://www.pharmgkb.org/">
        PharmGKB
      </Link>
      .
    </>
  );
}

export default Description;
