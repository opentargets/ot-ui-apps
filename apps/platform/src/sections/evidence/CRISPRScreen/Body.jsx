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
import Link from '../../../components/Link';
import { defaultRowsPerPageOptions } from '../../../constants';
import { naLabel } from '../../../constants';
import { PublicationsDrawer } from '../../../components/PublicationsDrawer';
import _ from 'lodash';

import CRISPR_QUERY from './CrisprScreenQuery.gql';

// This will hold more sources in future releases
const sources = {
  crispr_brain: {
    name: 'CRISPRBrain',
    url: 'https://crisprbrain.org/',
  },
};

// format the diseaseFromSource field: remove the "essential genes" info
// this might be sorted at data level at some point
const parseDiseaseName = d => d.toLowerCase().replace('essential genes / ', '');

const getColumns = label => [
  {
    id: 'diseaseFromSourceMappedId',
    label: 'Reported disease',
    renderCell: row => {
      const disease = parseDiseaseName(row.diseaseFromSource);
      return (
        <Link to={`/disease/${row.diseaseFromSourceMappedId}`}>
          {_.capitalize(disease)}
        </Link>
      );
    },
    filterValue: row =>
      row.diseaseFromSource + ', ' + row.diseaseFromSourceMappedId,
  },
  {
    id: 'studyId',
    label: 'Study Identifier',
    renderCell: row => (
      <Link
        external
        to={`https://crisprbrain.org/simple-screen/?screen=${row.studyId}`}
      >
        {row.studyId}
      </Link>
    ),
  },
  {
    id: 'contrast',
    label: 'Contrast / Study overview',
    renderCell: row => {
      // trim the last '.' - this could also be addressed at data level perhaps?
      const overview = row.studyOverview?.endsWith('.')
        ? row.studyOverview.slice(0, -1)
        : row.studyOverview;
      if (row.contrast && overview) {
        return (
          <Tooltip
            showHelpIcon
            title={
              <TooltipStyledLabel
                label={'Screen library'}
                description={row.crisprScreenLibrary}
              />
            }
          >
            <span>
              {row.contrast} / {overview}
            </span>
          </Tooltip>
        );
      } else if (row.contrast) {
        return <span>{row.contrast}</span>;
      } else if (overview) {
        return <span>{overview}</span>;
      }
    },
    filterValue: row => row.contrast + '; ' + row.studyOverview,
  },
  {
    id: 'cellType',
    label: 'Cell type',
    renderCell: row => row.cellType,
    filterValue: row => row.cellType,
    width: '12%',
  },
  {
    id: 'log2FoldChangeValue',
    label: 'log2 fold change',
    renderCell: row =>
      row.log2FoldChangeValue
        ? parseFloat(row.log2FoldChangeValue.toFixed(6))
        : naLabel,
    width: '9%',
  },
  {
    id: 'resourceScore',
    label: 'Significance',
    renderCell: row => {
      if (row.resourceScore && row.statisticalTestTail) {
        return (
          <Tooltip
            showHelpIcon
            title={
              <TooltipStyledLabel
                label={'Statistical test tail'}
                description={row.statisticalTestTail}
              />
            }
          >
            <span>{parseFloat(row.resourceScore.toFixed(6))}</span>
          </Tooltip>
        );
      } else {
        return row.resourceScore
          ? parseFloat(row.resourceScore.toFixed(6))
          : naLabel;
      }
    },
    filterValue: row => row.resourceScore + '; ' + row.statisticalTestTail,
    width: '9%',
  },
  {
    id: 'projectId',
    label: 'Source',
    renderCell: row => (
      <Link external to={sources[row.projectId]?.url}>
        {sources[row.projectId].name}
      </Link>
    ),
    filterValue: row => row.projectId,
    width: '9%',
  },
  {
    id: 'literature',
    label: 'Publication',
    renderCell: ({ literature }) => {
      if (!literature) return naLabel;
      return (
        <PublicationsDrawer
          entries={[{ name: literature[0] }]}
          symbol={label.symbol}
          name={label.name}
        />
      );
    },
    filterValue: ({ literature }) => literature,
    width: '9%',
  },
];

const exportColumns = [
  {
    label: 'disease',
    exportValue: row => parseDiseaseName(row.diseaseFromSource),
  },
  {
    label: 'disease id',
    exportValue: row => row.diseaseFromSourceMappedId,
  },
  {
    label: 'study identifier',
    exportValue: row => row.studyId,
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
    label: 'log2 fold change',
    exportValue: row => row.log2FoldChangeValue,
  },
  {
    label: 'significance',
    exportValue: row => row.resourceScore,
  },
  {
    label: 'statistical test tail',
    exportValue: row => row.statisticalTestTail,
  },
  {
    label: 'source',
    exportValue: row => row.projectId,
  },
  {
    label: 'publication',
    exportValue: row => row.literature.join(', '),
  },
];

export function BodyCore({ definition, id, label, count }) {
  const { ensgId, efoId } = id;
  const request = useQuery(CRISPR_QUERY, {
    variables: {
      ensemblId: ensgId,
      efoId,
      size: count,
    },
  });

  const columns = getColumns(label);

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
            dataDownloaderColumns={exportColumns}
            dataDownloaderFileStem={`${ensgId}-${efoId}-crisprscreen`}
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

export function Body({ definition, id, label }) {
  const { data: summaryData } = usePlatformApi(
    Summary.fragments.CrisprScreenSummary
  );
  const { count } = summaryData.CrisprScreenSummary;

  if (!count || count < 1) {
    return null;
  }

  return (
    <BodyCore definition={definition} id={id} label={label} count={count} />
  );
}
