import { Link, DisplayVariantId } from "ui";

type DescriptionProps = {
  variantId: string;
  referenceAllele: string;
  alternateAllele: string;
};

function Description({ variantId, referenceAllele, alternateAllele }: DescriptionProps) {
  return (
    <>
      Variant consequence prediction for{" "}
      <strong>
        <DisplayVariantId
          variantId={variantId}
          referenceAllele={referenceAllele}
          alternateAllele={alternateAllele}
        />
      </strong>. {" "}Source:{" "}
      <Link to="https://www.ensembl.org/info/docs/tools/vep/index.html" external>
        VEP
      </Link>
    </>
  );
}

export default Description;