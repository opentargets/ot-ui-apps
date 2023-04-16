import React from 'react';
import { useQuery } from '@apollo/client';
import { Typography } from '@mui/material';
import Link from '../../../components/Link';
import usePlatformApi from '../../../hooks/usePlatformApi';
import SectionItem from '../../../components/Section/SectionItem';
import Tooltip from '../../../components/Tooltip';
import { DataTable } from '../../../components/Table';
import { defaultRowsPerPageOptions, naLabel } from '../../../constants';
import { dataTypesMap } from '../../../dataTypes';
import Summary from './Summary';
import Description from './Description';

import CLINGEN_QUERY from './ClingenQuery.gql';

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
    id: 'allelicRequirements',
    label: 'Allelic requirement',
    renderCell: ({ allelicRequirements }) => {
      return !allelicRequirements ? (
        naLabel
      ) : allelicRequirements.length === 1 ? (
        allelicRequirements[0]
      ) : (
        <ul
          style={{
            margin: 0,
            padding: 0,
            listStyle: 'none',
          }}
        >
          {allelicRequirements.map(allelicRequirement => {
            return <li key={allelicRequirement}>{allelicRequirement}</li>;
          })}
        </ul>
      );
    },
    filterValue: ({ allelicRequirements }) =>
      allelicRequirements ? allelicRequirements.join() : '',
  },
  {
    id: 'confidence',
    label: 'Classification',
    renderCell: ({ confidence, urls }) => {
      return (
        <Tooltip
          title={
            <>
              <Typography variant="caption" display="block" align="center">
                As defined by the{' '}
                <Link
                  external
                  to="https://thegencc.org/faq.html#validity-termsdelphi-survey"
                >
                  GenCC Guidelines
                </Link>
              </Typography>
            </>
          }
          showHelpIcon
        >
          {urls && urls[0]?.url ? (
            <Link external to={urls[0].url}>
              {confidence}
            </Link>
          ) : (
            confidence
          )}
        </Tooltip>
      );
    },
  },
];

export function Body({ definition, id, label }) {
  const { data: summaryData } = usePlatformApi(
    Summary.fragments.ClinGenSummaryFragment
  );
  const count = summaryData.clingenSummary.count;

  if (!count || count < 1) {
    return null;
  }

  return (
    <BodyCore definition={definition} id={id} label={label} count={count} />
  );
}

export function BodyCore({ definition, id, label, count }) {
  const { ensgId, efoId } = id;

  const variables = {
    ensemblId: ensgId,
    efoId,
    size: count,
  };

  const request = useQuery(CLINGEN_QUERY, {
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
            query={CLINGEN_QUERY.loc.source.body}
            variables={variables}
          />
        );
      }}
    />
  );
}
