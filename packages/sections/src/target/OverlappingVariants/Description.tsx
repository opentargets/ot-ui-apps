import { Link } from "ui";

type DescriptionProps = {
  symbol: string;
};

// !! HARD CODE SOME OF DESCRIPTIPN FOR NOW !!
function Description({ symbol }: DescriptionProps) {
  return (
    <>
      Variants that overlap <strong>{symbol}</strong>. Source:{" "}
      {/* !! GET CORRECT LINK TO OT DOCS FOR LINK !! */}
      <Link to="/">Open Targets</Link> and{" "}
      <Link external to="https://www.uniprot.org/">
        UniProt
      </Link>
      .
    </>
  );
}

export default Description;
