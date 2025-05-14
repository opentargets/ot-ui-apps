import type { ReactElement } from "react";
import { DisplayVariantId, Link } from "ui";

type DescriptionProps = {
  variantId: string;
  referenceAllele: string;
  alternateAllele: string;
};

function Description({
  variantId,
  referenceAllele,
  alternateAllele,
}: DescriptionProps): ReactElement {
  return (
    <>
      95% credible sets fine-mapped from quantitative trait loci associated with molecular traits
      containing{" "}
      <strong>
        <DisplayVariantId
          variantId={variantId}
          referenceAllele={referenceAllele}
          alternateAllele={alternateAllele}
        />
      </strong>
      . Source{" "}
      <Link to="https://platform-docs.opentargets.org/variant#variant-to-phenotype" external>
        Open Targets
      </Link>
    </>
  );
}

export default Description;
