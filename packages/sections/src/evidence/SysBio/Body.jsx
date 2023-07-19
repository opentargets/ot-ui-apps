import { useQuery } from '@apollo/client';
import { Link, SectionItem, Tooltip } from 'ui';

import { definition } from '.';
import Description from './Description';
import { epmcUrl } from '../../utils/urls';
import SYSBIO_QUERY from './sectionQuery.gql';
import { dataTypesMap } from '../../dataTypes';
import { DataTable } from '../../components/Table';
import { defaultRowsPerPageOptions, naLabel } from '../../constants';
import { PublicationsDrawer } from '../../components/PublicationsDrawer';

const columns = [
  {
    id: 'disease',
    label: 'Disease/phenotype',
    renderCell: ({ disease }) => (
      <Link to={`/disease/${disease.id}`}>{disease.name}</Link>
    ),
    filterValue: ({ disease }) => disease.name,
  },
  {
    id: 'pathwayName',
    label: 'Gene set',
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
    id: 'literature',
    renderCell: ({ literature }) => {
      const literatureList =
        literature?.reduce((acc, id) => {
          if (id !== 'NA') {
            acc.push({
              name: id,
              url: epmcUrl(id),
              group: 'literature',
            });
          }
          return acc;
        }, []) || [];
      return <PublicationsDrawer entries={literatureList} />;
    },
  },
];

function Body({ id, label, entity }) {
  const { ensgId, efoId } = id;

  const variables = {
    ensemblId: ensgId,
    efoId,
  };

  const request = useQuery(SYSBIO_QUERY, {
    variables,
  });

  return (
    <SectionItem
      definition={definition}
      chipText={dataTypesMap.affected_pathway}
      request={request}
      entity={entity}
      renderDescription={() => (
        <Description symbol={label.symbol} name={label.name} />
      )}
      renderBody={data => (
        <DataTable
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
