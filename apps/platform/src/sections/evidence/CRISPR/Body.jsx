import { Link as RouterLink } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { Link } from '@material-ui/core';
import usePlatformApi from '../../../hooks/usePlatformApi';
import SectionItem from '../../../components/Section/SectionItem';
import { DataTable, TableDrawer } from '../../../components/Table';
import { dataTypesMap } from '../../../dataTypes';
import { naLabel } from '../../../constants';
import Summary from './Summary';
import Description from './Description';

import CRISPR_QUERY from './CrisprQuery.gql';

const columns = [
  {
    id: 'disease.name',
    label: 'Disease/phenotype',
    renderCell: ({ disease }) => (
      <Link component={RouterLink} to={`/disease/${disease.id}`}>
        {disease.name}
      </Link>
    ),
  },
  {
    label: 'Reported disease/phenotype',
    renderCell: ({ diseaseCellLines, diseaseFromSource }) => {
      if (!diseaseCellLines) return naLabel;

      const cellLines = diseaseCellLines.map(line => ({
        name: line.name,
        url: `https://cellmodelpassports.sanger.ac.uk/passports/${line.id}`,
        group: 'Cancer Cell Lines',
      }));

      return (
        <TableDrawer
          entries={cellLines}
          message={`${diseaseCellLines.length} ${diseaseFromSource} cell lines`}
        />
      );
    },
    filterValue: ({ diseaseFromSource }) => diseaseFromSource,
  },
  {
    id: 'resourceScore',
    label: 'Priority score',
    renderCell: ({ resourceScore }) => resourceScore.toFixed(3),
  },
];

export function Body({ definition, id, label }) {
  const { data: summaryData } = usePlatformApi(Summary.fragments.crisprSummary);
  const { count } = summaryData.crisprSummary;

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

  const request = useQuery(CRISPR_QUERY, {
    variables,
  });

  return (
    <SectionItem
      definition={definition}
      chipText={dataTypesMap.affected_pathway}
      request={request}
      renderDescription={() => (
        <Description symbol={label.symbol} name={label.name} />
      )}
      renderBody={({ disease }) => {
        const { rows } = disease.evidences;
        return (
          <DataTable
            columns={columns}
            rows={rows}
            dataDownloader
            showGlobalFilter
            query={CRISPR_QUERY.loc.source.body}
            variables={variables}
          />
        );
      }}
    />
  );
}
