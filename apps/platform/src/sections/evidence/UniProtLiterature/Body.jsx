import React from 'react';
import { useQuery } from '@apollo/client';
import { Typography } from '@mui/material';
import { identifiersOrgLink } from '../../../utils/global';
import Link from '../../../components/Link';
import usePlatformApi from '../../../hooks/usePlatformApi';
import Tooltip from '../../../components/Tooltip';
import SectionItem from '../../../components/Section/SectionItem';
import { PublicationsDrawer } from '../../../components/PublicationsDrawer';
import { DataTable } from '../../../components/Table';
import { defaultRowsPerPageOptions } from '../../../constants';
import { epmcUrl } from '../../../utils/urls';
import Summary from './Summary';
import Description from './Description';
import { sentenceCase } from '../../../utils/global';
import { dataTypesMap } from '../../../dataTypes';

import UNIPROT_LITERATURE_QUERY from './UniprotLiteratureQuery.gql';

const columns = [
  {
    id: 'disease.name',
    label: 'Disease/phenotype',
    renderCell: ({ disease, diseaseFromSource }) => {
      return (
        <Tooltip
          title={
            <>
              <Typography variant="subtitle2" display="block" align="center">
                Reported disease or phenotype:
              </Typography>
              <Typography variant="caption" display="block" align="center">
                {diseaseFromSource}
              </Typography>
            </>
          }
          showHelpIcon
        >
          <Link to={`/disease/${disease.id}`}>{disease.name}</Link>
        </Tooltip>
      );
    },
  },
  {
    id: 'targetFromSourceId',
    label: 'Reported protein',
    renderCell: ({ targetFromSourceId, studyId }) => {
      return (
        <Link external to={identifiersOrgLink('uniprot', targetFromSourceId)}>
          {targetFromSourceId}
        </Link>
      );
    },
  },
  {
    id: 'confidence',
    label: 'Confidence',
    renderCell: ({ confidence }) => {
      return <>{sentenceCase(confidence)}</>;
    },
  },
  {
    label: 'Literature',
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
    Summary.fragments.UniprotLiteratureSummary
  );
  const count = summaryData.uniprotLiteratureSummary.count;

  if (!count || count < 1) {
    return null;
  }

  return (
    <BodyCore definition={definition} id={id} label={label} count={count} />
  );
}

export function BodyCore({ definition, id, label, count }) {
  const { ensgId: ensemblId, efoId } = id;

  const variables = {
    ensemblId,
    efoId,
    size: count,
  };

  const request = useQuery(UNIPROT_LITERATURE_QUERY, {
    variables,
  });
  return (
    <SectionItem
      definition={definition}
      chipText={dataTypesMap.genetic_association}
      request={request}
      renderDescription={() => (
        <Description symbol={label.symbol} diseaseName={label.name} />
      )}
      renderBody={({ disease }) => {
        const { rows } = disease.evidences;
        return (
          <DataTable
            columns={columns}
            rows={rows}
            dataDownloader
            showGlobalFilter
            rowsPerPageOptions={defaultRowsPerPageOptions}
            query={UNIPROT_LITERATURE_QUERY.loc.source.body}
            variables={variables}
          />
        );
      }}
    />
  );
}
