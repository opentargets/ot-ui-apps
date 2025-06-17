import { ReactElement } from "react";
import { useQuery } from "@apollo/client";
import { SectionItem } from "ui";
import { definition } from ".";
import Description from "./Description";
import MOLECULAR_STRUCTURE_QUERY from "./MolecularStructureQuery.gql";
import Viewer from "./Viewer";

type BodyProps = {
  id: string;
  entity: string;
};

export function Body({ id, entity }: BodyProps): ReactElement {
  const variables = {
    variantId: id,
  };
  const request = useQuery(MOLECULAR_STRUCTURE_QUERY, {
    variables,
  });

  const variant = request.data?.variant;
  const proteinCodingCoordinatesRow = variant?.proteinCodingCoordinates?.rows?.[0];

  return (
    <SectionItem
      definition={definition}
      request={request}
      entity={entity}
      renderDescription={() => (
        <Description
          variantId={variant?.id}
          referenceAllele={variant?.referenceAllele}
          alternateAllele={variant?.alternateAllele}
          targetId={proteinCodingCoordinatesRow?.target?.id}
          targetApprovedSymbol={proteinCodingCoordinatesRow?.target?.approvedSymbol}
          uniprotAccession={proteinCodingCoordinatesRow?.uniprotAccessions?.[0]}
        />
      )}
      renderBody={() => {
        return <Viewer row={proteinCodingCoordinatesRow} />;
      }}
    />
  );
}

export default Body;
