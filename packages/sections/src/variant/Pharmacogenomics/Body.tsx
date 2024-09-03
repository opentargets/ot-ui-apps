import { useQuery } from "@apollo/client";
import { SectionItem } from "ui";
import { definition } from ".";
import Description from "./Description";
import PharmacogenomicsTable from "./PharmacogenomicsTable";
import PHARMACOGENOMICS_QUERY from "./PharmacogenomicsQuery.gql";

type BodyProps = {
  id: string,
  entity: string,
};

function Body({ id, entity }: BodyProps) {
  const variables = { variantId: id };
  
  const request = useQuery(PHARMACOGENOMICS_QUERY, {
    variables,
  });

  return (
    <SectionItem
      definition={definition}
      entity={entity}
      request={request}
      renderDescription={({ variant }) => (
        <Description
          variantId={variant.id}
          referenceAllele={variant.referenceAllele}
          alternateAllele={variant.alternateAllele}
        />
      )}
      renderBody={({ variant }) => (
        <PharmacogenomicsTable
          pharmacogenomics={variant.pharmacogenomics}
          query={PHARMACOGENOMICS_QUERY.loc.source.body}
          variables={variables}
        />
      )}
    />
  );
}

export default Body;