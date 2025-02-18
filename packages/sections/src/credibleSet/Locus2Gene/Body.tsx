import { ReactNode } from "react";
import { SectionItem } from "ui";
import { useQuery } from "@apollo/client";
import { definition } from ".";
import LOCUS2GENE_QUERY from "./Locus2GeneQuery.gql";
import HeatmapTable from "./HeatmapTable";
import Description from "./Description";

type BodyProps = {
  studyLocusId: string;
  entity: string;
};

const columns = [];

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
          columns={columns}
        />
      )}
    />
  );
}
export default Body;
