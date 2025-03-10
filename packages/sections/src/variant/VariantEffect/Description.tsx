import { Link, DisplayVariantId } from "ui";

type DescriptionProps = {
  variantId: string;
  referenceAllele: string;
  alternateAllele: string;
};

function Description({ variantId, referenceAllele, alternateAllele }: DescriptionProps) {
  return (
    <>
      Predicted functional effect of{" "}
      <strong>
        <DisplayVariantId
          variantId={variantId}
          referenceAllele={referenceAllele}
          alternateAllele={alternateAllele}
        />
      </strong>
      . Source:{" "}
      <Link to="https://www.ensembl.org/info/docs/tools/vep/index.html" external>
        VEP
      </Link>
      ,{" "}
      <Link to="https://gnomad.broadinstitute.org/" external>
        gnomAD
      </Link>
    </>
  );
}

export default Description;
