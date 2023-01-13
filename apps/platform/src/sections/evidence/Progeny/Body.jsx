import React from 'react';
import { useQuery } from '@apollo/client';
import { Typography } from '@material-ui/core';

import { DataTable } from '../../../components/Table';
import { defaultRowsPerPageOptions, naLabel } from '../../../constants';
import Description from './Description';
import Link from '../../../components/Link';
import SectionItem from '../../../components/Section/SectionItem';
import ScientificNotation from '../../../components/ScientificNotation';
import { sentenceCase } from '../../../utils/global';
import Summary from './Summary';
import Tooltip from '../../../components/Tooltip';
import usePlatformApi from '../../../hooks/usePlatformApi';
import { dataTypesMap } from '../../../dataTypes';

import PROGENY_QUERY from './sectionQuery.gql';
const reactomeUrl = id => `https://identifiers.org/reactome:${id}`;

const columns = [
  {
    id: 'disease',
    label: 'Disease/phenotype',
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
    filterValue: ({ disease, diseaseFromSource }) =>
      [disease.name, diseaseFromSource].join(),
  },
  {
    id: 'pathwayName',
    label: 'Significant pathway',
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
    id: 'resourceScore',
    label: (
      <>
        <i>p</i>-value
      </>
    ),
    numeric: true,
    sortable: true,
    renderCell: ({ resourceScore }) => (
      <ScientificNotation number={resourceScore} />
    ),
  },
];

export function Body({ definition, id, label }) {
  const { data: summaryData } = usePlatformApi(
    Summary.fragments.ProgenySummaryFragment
  );
  const count = summaryData.progeny.count;
  
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
    size: count,
  };

  const request = useQuery(PROGENY_QUERY, {
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
          dataDownloaderFileStem={`otgenetics-${ensgId}-${efoId}`}
          order="asc"
          rows={data.disease.evidences.rows}
          pageSize={10}
          rowsPerPageOptions={defaultRowsPerPageOptions}
          showGlobalFilter
          sortBy="resourceScore"
          query={PROGENY_QUERY.loc.source.body}
          variables={variables}
        />
      )}
    />
  );
}
