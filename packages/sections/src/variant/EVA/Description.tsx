import { Link, DisplayVariantId } from "ui";

type DescriptionProps = {
  variantId: string;
  referenceAllele: string;
  alternateAllele: string;
};

function Description({ variantId, referenceAllele, alternateAllele }: DescriptionProps) {
  return (
    <>
      Genetic variation from clinical submissions associating{" "}
      <strong>
        <DisplayVariantId
          variantId={variantId}
          referenceAllele={referenceAllele}
          alternateAllele={alternateAllele}
        />
      </strong>{" "}
      to a disease/phenotype. Source:{" "}
      <Link to="https://www.ebi.ac.uk/eva/" external>
        EVA
      </Link>
    </>
  );
}

export default Description;
