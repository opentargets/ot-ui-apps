import { ReactElement } from "react";
import { Link, DisplayVariantId } from "ui";

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
      molQTL 99% credible sets containing{" "}
      <strong>
        <DisplayVariantId
          variantId={variantId}
          referenceAllele={referenceAllele}
          alternateAllele={alternateAllele}
        />
      </strong>
      . Source <Link to="/">Open Targets</Link>
    </>
  );
}

export default Description;
