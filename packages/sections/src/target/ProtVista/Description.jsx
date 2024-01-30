import { Link } from "ui";

function Description({ symbol }) {
  return (
    <>
      <strong>{symbol}</strong> functional, positional and structural protein information. Source:{" "}
      <Link external to="https://www.uniprot.org/">
        UniProt
      </Link>
      .
    </>
  );
}

export default Description;
