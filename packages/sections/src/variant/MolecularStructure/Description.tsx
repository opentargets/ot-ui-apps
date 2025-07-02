import { Link, DisplayVariantId } from "ui";

type DescriptionProps = {
  variantId: string;
  referenceAllele: string;
  alternateAllele: string;
  targetId: string;
  targetApprovedSymbol: string;
  uniprotAccession: string;
};

// !! HARD CODE SOME OF DESCRIPTIPN FOR NOW !!
function Description({
  variantId,
  referenceAllele,
  alternateAllele,
  targetId,
  targetApprovedSymbol,
  uniprotAccession,
}: DescriptionProps) {
  return (
    <>
      <strong>
        <DisplayVariantId
          variantId={variantId}
          referenceAllele={referenceAllele}
          alternateAllele={alternateAllele}
        />
      </strong>{" "}
      reference amino acid highlighted in predicted structural model of{" "}
      <Link to={`/target/${targetId}`}>{targetApprovedSymbol}</Link>. Source:{" "}
      <Link external to={`https://alphafold.ebi.ac.uk/entry/${uniprotAccession}`}>
        AlphafoldDB
      </Link>{" "}
      and{" "}
      <Link external to="https://platform-docs.opentargets.org/variant">
        Open Targets
      </Link>
      .
    </>
  );
}

export default Description;
