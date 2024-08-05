import { useQuery } from "@apollo/client";
import { Link, SectionItem, Tooltip, PublicationsDrawer, OtTable } from "ui";

import { definition } from ".";
import Description from "./Description";
import { epmcUrl } from "../../utils/urls";
import SYSBIO_QUERY from "./sectionQuery.gql";
import { dataTypesMap } from "../../dataTypes";
import { defaultRowsPerPageOptions, naLabel, sectionsBaseSizeQuery } from "../../constants";

const getColumns = label => [
  {
    id: "disease",
    label: "Disease/phenotype",
    renderCell: ({ disease }) => <Link to={`/disease/${disease.id}`}>{disease.name}</Link>,
    filterValue: ({ disease }) => disease.name,
  },
  {
    id: "pathwayName",
    label: "Gene set",
    renderCell: ({ pathways, studyOverview }) => {
      if (pathways && pathways.length >= 1 && studyOverview) {
        return (
          <Tooltip title={studyOverview} showHelpIcon>
            {pathways[0].name}
          </Tooltip>
        );
      }
      if (pathways && pathways.length >= 1) {
        return pathways[0].name;
      }
      return naLabel;
    },
  },
  {
    id: "literature",
    label: "Literature",
    renderCell: ({ literature }) => {
      const literatureList =
        literature?.reduce((acc, id) => {
          if (id !== "NA") {
            acc.push({
              name: id,
              url: epmcUrl(id),
              group: "literature",
            });
          }
          return acc;
        }, []) || [];
      return (
        <PublicationsDrawer entries={literatureList} symbol={label.symbol} name={label.name} />
      );
    },
  },
];

function Body({ id, label, entity }) {
  const { ensgId, efoId } = id;

  const variables = {
    ensemblId: ensgId,
    efoId,
    size: sectionsBaseSizeQuery,
  };

  const request = useQuery(SYSBIO_QUERY, {
    variables,
  });

  const columns = getColumns(label);

  return (
    <SectionItem
      definition={definition}
      chipText={dataTypesMap.affected_pathway}
      request={request}
      entity={entity}
      renderDescription={() => <Description symbol={label.symbol} name={label.name} />}
      renderBody={data => (
        <OtTable
          columns={columns}
          dataDownloader
          dataDownloaderFileStem={`otgenetics-${ensgId}-${efoId}`}
          rows={data.disease.sysBio.rows}
          pageSize={10}
          rowsPerPageOptions={defaultRowsPerPageOptions}
          showGlobalFilter
          query={SYSBIO_QUERY.loc.source.body}
          variables={variables}
        />
      )}
    />
  );
}

export default Body;
