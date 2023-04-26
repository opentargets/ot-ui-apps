import { useQuery } from '@apollo/client';
import { Typography } from '@material-ui/core';
import usePlatformApi from '../../../hooks/usePlatformApi';
import { dataTypesMap } from '../../../dataTypes';
import SectionItem from '../../../components/Section/SectionItem';
import { DataTable } from '../../../components/Table';
import Tooltip from '../../../components/Tooltip';
import ScientificNotation from '../../../components/ScientificNotation';
import Summary from './Summary';
import Description from './Description';
import Link from '../../../components/Link';
import { sentenceCase } from '../../../utils/global';

import EXPRESSION_ATLAS_QUERY from './ExpressionAtlasQuery.gql';

const columns = [
  {
    id: 'disease.name',
    label: 'Disease/phenotype',
    renderCell: ({ disease, diseaseFromSource }) => (
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
    ),
  },
  {
    id: 'studyId',
    label: 'Experiment ID',
    renderCell: ({ studyId }) => (
      <Link external to={`http://www.ebi.ac.uk/gxa/experiments/${studyId}`}>
        {studyId}
      </Link>
    ),
  },
  {
    id: 'contrast',
    label: 'Experiment details',
    renderCell: ({ contrast, studyOverview }) => (
      <Tooltip title={studyOverview} showHelpIcon>
        <span>{contrast}</span>
      </Tooltip>
    ),
  },
  {
    id: 'confidence',
    label: 'Experiment confidence',
    renderCell: ({ confidence }) => (
      <Tooltip
        title={
          <Typography variant="caption" display="block" align="center">
            As defined by the{' '}
            <Link external to="https://www.ebi.ac.uk/gxa/FAQ.html">
              Expression Atlas Guideline
            </Link>
          </Typography>
        }
        showHelpIcon
      >
        {sentenceCase(confidence)}
      </Tooltip>
    ),
  },
  {
    id: 'log2FoldChangeValue',
    label: (
      <>
        Log<sub>2</sub> fold change
      </>
    ),
    numeric: true,
    sortable: true,
  },
  {
    id: 'log2FoldChangePercentileRank',
    label: 'Percentile',
    numeric: true,
    sortable: true,
  },
  {
    id: 'resourceScore',
    label: (
      <>
        <i>p</i>-value
      </>
    ),
    renderCell: ({ resourceScore }) => (
      <ScientificNotation number={resourceScore} />
    ),
    numeric: true,
    sortable: true,
  },
];

export function Body({ definition, id, label }) {
  const { data: summaryData } = usePlatformApi(
    Summary.fragments.expressionAtlasSummary
  );
  const { count } = summaryData.expressionAtlasSummary;

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

  const request = useQuery(EXPRESSION_ATLAS_QUERY, {
    variables,
  });

  return (
    <SectionItem
      definition={definition}
      chipText={dataTypesMap.rna_expression}
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
            sortBy="resourceScore"
            order="asc"
            query={EXPRESSION_ATLAS_QUERY.loc.source.body}
            variables={variables}
          />
        );
      }}
    />
  );
}
