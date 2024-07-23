import { useQuery } from "@apollo/client";
import { Typography } from "@mui/material";
import { Link, SectionItem, Tooltip, OtTable, ScientificNotation } from "ui";

import { definition } from ".";
import Description from "./Description";
import { dataTypesMap } from "../../dataTypes";
import SLAPENRICH_QUERY from "./sectionQuery.gql";
import { sentenceCase } from "../../utils/global";
import { defaultRowsPerPageOptions, naLabel, sectionsBaseSizeQuery } from "../../constants";

const reactomeUrl = id => `https://identifiers.org/reactome:${id}`;

const columns = [
  {
    id: "disease",
    label: "Disease/phenotype",
    renderCell: ({ disease, diseaseFromSource }) => (
      <Tooltip
        title={
          <>
            <Typography variant="subtitle2" display="block" align="center">
              Reported disease or phenotype:
            </Typography>
            <Typography variant="caption" display="block" align="center">
              {sentenceCase(diseaseFromSource)}
            </Typography>
          </>
        }
        showHelpIcon
      >
        <Link to={`/disease/${disease.id}`}>{disease.name}</Link>
      </Tooltip>
    ),
    filterValue: ({ disease, diseaseFromSource }) => [disease.name, diseaseFromSource].join(),
  },
  {
    id: "pathwayName",
    label: "Significant pathway",
    renderCell: ({ pathways }) =>
      pathways?.length >= 1 ? (
        <Link external to={reactomeUrl(pathways[0].id)}>
          {pathways[0].name}
        </Link>
      ) : (
        naLabel
      ),
  },
  {
    id: "resourceScore",
    label: (
      <>
        <i>p</i>-value
      </>
    ),
    numeric: true,
    sortable: true,
    renderCell: ({ resourceScore }) => <ScientificNotation number={resourceScore} />,
  },
];

function Body({ id, label, entity }) {
  const { ensgId, efoId } = id;
  const variables = {
    ensemblId: ensgId,
    efoId,
    size: sectionsBaseSizeQuery,
  };

  const request = useQuery(SLAPENRICH_QUERY, {
    variables,
  });

  return (
    <SectionItem
      definition={definition}
      entity={entity}
      chipText={dataTypesMap.affected_pathway}
      request={request}
      renderDescription={() => <Description symbol={label.symbol} name={label.name} />}
      renderBody={data => (
        <OtTable
          columns={columns}
          dataDownloader
          dataDownloaderFileStem={`otgenetics-${ensgId}-${efoId}`}
          order="asc"
          rows={data.disease.slapEnrich.rows}
          pageSize={10}
          rowsPerPageOptions={defaultRowsPerPageOptions}
          showGlobalFilter
          sortBy="resourceScore"
          query={SLAPENRICH_QUERY.loc.source.body}
          variables={variables}
        />
      )}
    />
  );
}

export default Body;
