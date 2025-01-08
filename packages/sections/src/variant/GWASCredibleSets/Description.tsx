import { Link, DisplayVariantId } from "ui";

type DescriptionProps = {
  variantId: string;
  referenceAllele: string;
  alternateAllele: string;
};

function Description({ variantId, referenceAllele, alternateAllele }: DescriptionProps) {
  return (
    <>
      95% credible sets associated with complex traits containing{" "}
      <strong>
        <DisplayVariantId
          variantId={variantId}
          referenceAllele={referenceAllele}
          alternateAllele={alternateAllele}
        />
      </strong>
      . Source{" "}
      <Link to="https://home.opentargets.org/merged-product-documentation" external>
        Open Targets
      </Link>
    </>
  );
}

export default Description;
