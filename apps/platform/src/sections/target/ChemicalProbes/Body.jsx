import React from 'react';
import { Typography } from '@material-ui/core';
import { useQuery } from '@apollo/client';

import Link from '../../../components/Link';
import SectionItem from '../../../components/Section/SectionItem';
import Description from './Description';
import Tooltip from '../../../components/Tooltip';
import { naLabel } from '../../../constants';
import { DataTable } from '../../../components/Table';
import { defaultRowsPerPageOptions } from '../../../constants';
import ClinvarStars from '../../../components/ClinvarStars';

import CHEMICAL_PROBES_QUERY from './ChemicalProbes.gql';


/**
 * Style the tooltips as "label: value" with a bold label
 */
const TooltipStyledLabel = ({ label, value }) => {
  return (
    <Typography variant="body2">
      <span style={{ fontWeight: 'bold' }}>{label}:</span> {value}
    </Typography>
  );
};

const columns = [
  {
    id: 'id',
    label: 'Probe ID',
    renderCell: row => {
      // link to drug page if drugid is available; also add tooltip with control if available
      const c = row.drugId ? (
        <Link to={`/drug/${row.drugId}`}>{row.id}</Link>
      ) : (
        <span>{row.id}</span>
      );
      return row.control ? (
        <Tooltip
          title={<TooltipStyledLabel label="Control" value={row.control} />}
          showHelpIcon
        >
          {c}
        </Tooltip>
      ) : (
        c
      );
    },
    exportValue: row => row.id,
    filterValue: row => row.id,
    width: '25%',
  },
  {
    id: 'isHighQuality',
    label: 'Quality',
    renderCell: row => (
      <Tooltip title={row.isHighQuality ? 'High quality' : 'Low quality'}>
        <span>
          <ClinvarStars num={row.isHighQuality ? 1 : 0} length={1} />
        </span>
      </Tooltip>
    ),
    exportValue: row => (row.isHighQuality ? 'high' : 'low'),
    filterValue: row => (row.isHighQuality ? 1 : 0),
    tooltip:
      'Chemical probes selection based on the union of following criteria: compound belongs to one of the high-quality probe sets; use in Cells or Organisms rating ≥ 75%; P&D approved experimental probe; not labelled as obsolete.',
    width: '12%',
  },
  {
    id: 'mechanismOfAction',
    label: 'Mechanism of action',
    renderCell: row => row.mechanismOfAction?.join(', ') || naLabel,
    exportValue: row => row.mechanismOfAction?.join(', '),
    filterValue: row => row.mechanismOfAction?.join(', ') || naLabel,
    width: '25%',
  },
  {
    id: 'origin',
    label: 'Probe origin',
    renderCell: row => row.origin?.join(', ') || naLabel,
    exportValue: row => row.origin?.join(', '),
    filterValue: row => row.origin?.join(', ') || naLabel,
    width: '25%',
  },
  {
    id: 'probesDrugsScore',
    label: 'Score',
    renderCell: row => (
        row.probesDrugsScore || naLabel
    ),
    exportValue: row => row.probesDrugsScore || naLabel,
    filterValue: row => row.probesDrugsScore,
    width: '13%',
  },
];

function Body({ definition, id, label: symbol }) {
  const variables = { ensemblId: id };
  const request = useQuery(CHEMICAL_PROBES_QUERY, { variables });

  return (
    <SectionItem
      definition={definition}
      request={request}
      renderDescription={() => <Description symbol={symbol} />}
      renderBody={data => {
        return data.target.chemicalProbes?.length > 0 ? (
          <DataTable
            columns={columns}
            rows={data.target.chemicalProbes}
            showGlobalFilter
            dataDownloader
            dataDownloaderFileStem={`${symbol}-chemical-probes`}
            fixed
            sortBy = "probesDrugsScore"
            order = "desc"
            rowsPerPageOptions={defaultRowsPerPageOptions}
            noWrap={false}
            noWrapHeader={false}
            query={CHEMICAL_PROBES_QUERY.loc.source.body}
            variables={variables}
          />
        ) : null;
      }}
    />
  );
}

export default Body;
