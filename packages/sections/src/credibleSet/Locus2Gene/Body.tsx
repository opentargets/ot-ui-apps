import { ReactNode } from "react";
import { Link, OtTable, SectionItem } from "ui";
import { useQuery } from "@apollo/client";

import { definition } from ".";
import Description from "./Description";
import { naLabel } from "../../constants";
import LOCUS2GENE_QUERY from "./Locus2GeneQuery.gql";

type BodyProps = {
  studyLocusId: string;
  entity: string;
};

const columns = [
  {
    id: "gene",
    label: "Gene",
    renderCell: ({ credibleSets }) => {
      if (!credibleSets) return naLabel;
      return (
        <Link to={`../target/${credibleSets?.l2Gpredictions.target.id}`}>
          {credibleSets?.l2Gpredictions.target.approvedSymbol}
        </Link>
      );
    },
  },
  {
    id: "score",
    label: "L2G score",
    sortable: true,
    numeric: true,
    tooltip:
      "Overall evidence linking a gene to this credible set using all features. Score range [0,1]",
    renderCell: ({ credibleSets }) => {
      if (!credibleSets) return naLabel;
      return <>{credibleSets?.l2Gpredictions.score}</>;
    },
  },
  {
    id: "proteinIds",
    label: "Protein Ids",
    renderCell: ({ credibleSets }) => {
      if (!credibleSets) return naLabel;
      return <>{credibleSets?.proteinIds}</>;
    },
  },
];

function Body({ studyLocusId, entity }: BodyProps): ReactNode {
  const variables = {
    studyLocusIds: [studyLocusId],
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
      renderBody={() => {
        return (
          <OtTable
            showGlobalFilter
            dataDownloader
            dataDownloaderFileStem={`${studyLocusId}-locus2gene`}
            sortBy="posteriorProbability"
            order="desc"
            columns={columns}
            loading={request.loading}
            rows={request.data?.credibleSets[0].locus}
            query={LOCUS2GENE_QUERY.loc.source.body}
            variables={variables}
          />
        );
      }}
    />
  );
}
export default Body;
