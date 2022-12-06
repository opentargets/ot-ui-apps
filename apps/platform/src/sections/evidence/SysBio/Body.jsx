import React from 'react';
import { useQuery } from '@apollo/client';

import { DataTable } from '../../../components/Table';
import Description from './Description';
import { defaultRowsPerPageOptions, naLabel } from '../../../constants';
import { epmcUrl } from '../../../utils/urls';
import Link from '../../../components/Link';
import { PublicationsDrawer } from '../../../components/PublicationsDrawer';
import SectionItem from '../../../components/Section/SectionItem';
import Summary from './Summary';
import Tooltip from '../../../components/Tooltip';
import usePlatformApi from '../../../hooks/usePlatformApi';
import { dataTypesMap } from '../../../dataTypes';

import SYSBIO_QUERY from './sectionQuery.gql';

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
    renderCell: ({ pathways, studyOverview }) =>
      pathways?.length >= 1 ? (
        studyOverview ? (
          <Tooltip title={studyOverview} showHelpIcon>
            {pathways[0].name}
          </Tooltip>
        ) : (
          pathways[0].name
        )
      ) : (
        naLabel
      ),
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

export function Body({ definition, id, label }) {
  const { data: summaryData } = usePlatformApi(
    Summary.fragments.SysBioSummaryFragment
  );
  const count = summaryData.sysBio.count;

  if(!count || count < 1) {
    return null
  }

  return <BodyCore definition={definition} id={id} label={label} count={count} />
}

export function BodyCore({ definition, id, label, count }) {
  const { ensgId, efoId } = id;

  const variables = { 
    ensemblId: ensgId, 
    efoId, 
    size:count 
  };

  const request = useQuery(SYSBIO_QUERY, {
    variables,
  });

  return (
    <SectionItem
      definition={definition}
      chipText={dataTypesMap.affected_pathway}
      request={request}
      renderDescription={() => <Description symbol={label.symbol} name={label.name} />}
      renderBody={data => (
        <DataTable
          columns={columns}
          dataDownloader
          dataDownloaderFileStem={`${definition.id}-${ensgId}-${efoId}`}
          rows={data.disease.evidences.rows}
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
