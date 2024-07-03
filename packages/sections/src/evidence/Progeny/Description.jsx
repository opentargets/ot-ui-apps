import { Link } from "ui";

function Description({ symbol, name }) {
  return (
    <>
      Pathway-level analysis of gene expression perturbation experiments associating{" "}
      <strong>{symbol}</strong> with <strong>{name}</strong>. Source:{" "}
      <Link to="https://saezlab.github.io/progeny/" external>
        PROGENy
      </Link>
    </>
  );
}

export default Description;
