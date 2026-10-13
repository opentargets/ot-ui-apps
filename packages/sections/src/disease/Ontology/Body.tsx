import { SectionItem } from "ui";

import Description from "./Description";
import ONTOLOGY_QUERY from "./OntologyQuery.gql";
import ONTOLOGY_ANCESTORS_QUERY from "./OntologyAncestorsQuery.gql";

import { useQuery } from "@apollo/client";
import { definition } from ".";
import OntologySubgraph from "./OntologySubgraph";
import type { DiseaseBodyProps } from "@ot/constants";

type Props = DiseaseBodyProps;

function Body({ id: efoId, label, entity }: Props) {
  const request = useQuery(ONTOLOGY_QUERY, {
    variables: { efoId },
  });

  // the API only returns ancestor ids on the disease; resolve them in a second
  // request to get their names and parents for the subgraph
  const ancestorIds: string[] = request.data?.disease?.ancestors ?? [];
  const ancestorsRequest = useQuery(ONTOLOGY_ANCESTORS_QUERY, {
    variables: { ids: ancestorIds, size: Math.max(ancestorIds.length, 1) },
    skip: ancestorIds.length === 0,
  });

  const combinedRequest = {
    loading: request.loading || ancestorsRequest.loading,
    error: request.error || ancestorsRequest.error,
    data:
      request.data && !ancestorsRequest.loading
        ? {
            disease: {
              ...request.data.disease,
              resolvedAncestors: ancestorsRequest.data?.diseases?.rows ?? [],
            },
          }
        : undefined,
  };

  return (
    <SectionItem
      definition={definition}
      entity={entity}
      request={combinedRequest}
      showContentLoading={true}
      renderDescription={() => <Description name={label} />}
      renderBody={() => <OntologySubgraph name={label} data={combinedRequest.data?.disease} />}
      chipText={label}
    />
  );
}

export default Body;
