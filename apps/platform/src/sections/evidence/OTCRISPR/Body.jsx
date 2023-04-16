import React from 'react';
import { useQuery } from '@apollo/client';
import usePlatformApi from '../../../hooks/usePlatformApi';
import SectionItem from '../../../components/Section/SectionItem';
import { DataTable } from '../../../components/Table';
import { dataTypesMap } from '../../../dataTypes';
import Summary from './Summary';
import Description from './Description';
import Tooltip from '../../../components/Tooltip';
import TooltipStyledLabel from '../../../components/TooltipStyledLabel';
import { makeStyles } from '@mui/styles';
import Link from '../../../components/Link';
import { defaultRowsPerPageOptions } from '../../../constants';

import CRISPR_QUERY from './OTCrisprQuery.gql';

const useStyles = makeStyles(theme => {
  return {
    significanceIcon: {
      color: theme.palette.primary.main,
    },
  };
});

const getColumns = classes => [
  {
    id: 'disease',
    label: 'Reported disease',
    renderCell: row => (
      <Link to={`/disease/${row.disease.id}`}>{row.disease.name}</Link>
    ),
    filterValue: row => row.disease.name + ', ' + row.disease.id,
  },
  {
    id: 'projectId',
    label: 'OTAR project code',
    renderCell: row => (
      <Link external to={`http://home.opentargets.org/${row.projectId}`}>
        {row.projectId}
      </Link>
    ),
  },
  {
    id: 'contrast',
    label: 'Contrast / Study overview',
    renderCell: row => {
      if (row.contrast && row.studyOverview) {
        return (
          <Tooltip
            showHelpIcon
            title={
              <TooltipStyledLabel
                label={'Study overview'}
                description={row.studyOverview}
              />
            }
          >
            <span>{row.contrast}</span>
          </Tooltip>
        );
      } else if (row.contrast) {
        return <span>{row.contrast}</span>;
      } else if (row.studyOverview) {
        return <span>{row.studyOverview}</span>;
      }
    },
    width: '25%',
    filterValue: row => row.contrast + '; ' + row.studyOverview,
  },
  {
    id: 'cellType',
    label: 'Cell type',
    renderCell: row =>
      row.cellLineBackground ? (
        <Tooltip
          showHelpIcon
          title={
            <TooltipStyledLabel
              label={'Cell line background'}
              description={row.cellLineBackground}
            />
          }
        >
          <span>{row.cellType}</span>
        </Tooltip>
      ) : (
        row.cellType
      ),
    filterValue: row => row.cellType + '; ' + row.cellLineBackground,
  },
  {
    id: 'log2FoldChangeValue',
    label: 'log2 fold change',
    renderCell: row =>
      row.log2FoldChangeValue ? row.log2FoldChangeValue : 'N/A',
  },
  {
    id: 'resourceScore',
    label: 'Significance',
    filterValue: row => row.resourceScore + '; ' + row.statisticalTestTail,
    renderCell: row =>
      row.resourceScore ? parseFloat(row.resourceScore.toFixed(6)) : 'N/A',
  },
  {
    id: 'releaseVersion',
    label: 'Release version',
  },
];

const exportColumns = [
  {
    label: 'disease',
    exportValue: row => row.disease.name,
  },
  {
    label: 'disease id',
    exportValue: row => row.disease.id,
  },
  {
    label: 'OTAR project code',
    exportValue: row => row.projectId,
  },
  {
    label: 'contrast',
    exportValue: row => row.contrast,
  },
  {
    label: 'study overview',
    exportValue: row => row.studyOverview,
  },
  {
    label: 'cell type',
    exportValue: row => row.cellType,
  },
  {
    label: 'cell line background',
    exportValue: row => row.cellLineBackground,
  },
  {
    label: 'CRISPR screen library',
    exportValue: row => row.crisprScreenLibrary,
  },
  {
    label: 'resource score',
    exportValue: row => row.resourceScore,
  },
  {
    label: 'statistical test tail',
    exportValue: row => row.statisticalTestTail,
  },
];

export function Body({ definition, id, label }) {
  const { data: summaryData } = usePlatformApi(
    Summary.fragments.OtCrisprSummary
  );
  const count = summaryData.OtCrisprSummary.count;

  if (!count || count < 1) {
    return null;
  }

  return (
    <BodyCore definition={definition} id={id} label={label} count={count} />
  );
}

export function BodyCore({ definition, id, label, count }) {
  const { ensgId, efoId } = id;
  const request = useQuery(CRISPR_QUERY, {
    variables: {
      ensemblId: ensgId,
      efoId,
      size: count,
    },
  });
  const classes = useStyles();

  return (
    <SectionItem
      definition={definition}
      chipText={dataTypesMap.ot_partner}
      request={request}
      renderDescription={() => (
        <Description symbol={label.symbol} name={label.name} />
      )}
      renderBody={({ disease }) => {
        const { rows } = disease.evidences;
        return (
          <DataTable
            columns={getColumns(classes)}
            rows={rows}
            dataDownloader
            dataDownloaderColumns={exportColumns}
            dataDownloaderFileStem={`${ensgId}-${efoId}-otcrispr`}
            showGlobalFilter
            sortBy="resourceScore"
            fixed
            noWrap={false}
            noWrapHeader={false}
            rowsPerPageOptions={defaultRowsPerPageOptions}
          />
        );
      }}
    />
  );
}
