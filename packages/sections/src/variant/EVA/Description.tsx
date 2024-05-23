import { Link } from "ui";

type DescriptionProps = {
  variantId: string;
};

function Description({ variantId }: DescriptionProps) {
  return (
    <>
      Genetic variation from clinical submissions associating <strong>{variantId}</strong> to a disease/phenotype. Source:{" "}
      <Link to="https://www.ebi.ac.uk/eva/" external>
        EVA
      </Link>
    </>
  );
}

export default Description;
