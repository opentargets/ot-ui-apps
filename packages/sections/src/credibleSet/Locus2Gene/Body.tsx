import { useQuery } from "@apollo/client";
import type { ReactNode } from "react";
import { HeatmapTable, SectionItem } from "ui";
import { definition } from ".";
import Description from "./Description";
import LOCUS2GENE_QUERY from "./Locus2GeneQuery.gql";

type BodyProps = {
  studyLocusId: string;
  entity: string;
};

function Body({ studyLocusId, entity }: BodyProps): ReactNode {
  const variables = {
    studyLocusId: studyLocusId,
  };

  const request = useQuery(LOCUS2GENE_QUERY, {
    variables,
  });

  return (
    <SectionItem
      definition={definition}
      entity={entity}
      request={request}
      renderDescription={() => <Description />}
      renderBody={() => (
        <HeatmapTable
          loading={request.loading}
          data={request.data?.credibleSet.l2GPredictions}
          query={LOCUS2GENE_QUERY.loc.source.body}
          variables={variables}
        />
      )}
    />
  );
}
export default Body;
