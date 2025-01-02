import { ReactNode } from "react";
import { Link, OtScoreLinearBar, OtTable, SectionItem } from "ui";
import { useQuery } from "@apollo/client";

import { definition } from ".";
import Description from "./Description";
import { naLabel } from "../../constants";
import LOCUS2GENE_QUERY from "./Locus2GeneQuery.gql";
import { Tooltip } from "@mui/material";

type BodyProps = {
  studyLocusId: string;
  entity: string;
};

const columns = [
  {
    id: "gene",
    label: "Gene",
    enableHiding: false,
    renderCell: ({ target }) => {
      if (!target) return naLabel;
      return <Link to={`../target/${target?.id}`}>{target?.approvedSymbol}</Link>;
    },
    exportValue: ({ target }) => target?.id,
  },
  {
    id: "score",
    label: "L2G score",
    sortable: true,
    tooltip:
      "Machine learning prediction linking a gene to a credible set using all features. Score range [0,1].",
    renderCell: ({ score }) => {
      if (!score) return naLabel;
      return (
        <Tooltip title={score.toFixed(3)}>
          <OtScoreLinearBar variant="determinate" value={score * 100} />
        </Tooltip>
      );
    },
  },
];

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
      renderBody={() => {
        return (
          <OtTable
            showGlobalFilter
            dataDownloader
            dataDownloaderFileStem={`${studyLocusId}-locus2gene`}
            columns={columns}
            loading={request.loading}
            rows={request.data?.credibleSet.l2GPredictions.rows}
            query={LOCUS2GENE_QUERY.loc.source.body}
            variables={variables}
          />
        );
      }}
    />
  );
}
export default Body;
