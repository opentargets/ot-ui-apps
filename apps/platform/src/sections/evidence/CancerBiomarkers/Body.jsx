import { useQuery } from '@apollo/client';
import { Typography } from '@material-ui/core';
import Link from '../../../components/Link';
import usePlatformApi from '../../../hooks/usePlatformApi';
import SectionItem from '../../../components/Section/SectionItem';
import Tooltip from '../../../components/Tooltip';
import { DataTable, TableDrawer } from '../../../components/Table';
import { defaultRowsPerPageOptions } from '../../../constants';
// import { dataTypesMap } from '../../../dataTypes';
import { PublicationsDrawer } from '../../../components/PublicationsDrawer';
import { epmcUrl } from '../../../utils/urls';
import Description from './Description';
import Summary from './Summary';
import BiomarkersDrawer from './BiomarkersDrawer';

import CANCER_BIOMARKERS_EVIDENCE_QUERY from './CancerBiomarkersEvidence.gql';

const getColumns = label => [
  {
    id: 'disease.name',
    label: 'Disease',
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
    id: 'biomarkerName',
    label: 'Biomarker',
    renderCell: ({ biomarkerName, biomarkers }) => (
      <BiomarkersDrawer biomarkerName={biomarkerName} biomarkers={biomarkers} />
    ),
  },
  {
    id: 'drug',
    label: 'Reported drug',
    renderCell: ({ drug, drugFromSource }) =>
      drug ? <Link to={`/drug/${drug.id}`}>{drug.name}</Link> : drugFromSource,
    filterValue: ({ drug, drugFromSource }) =>
      drug ? drug.name : drugFromSource,
  },
  {
    id: 'drugResponse.name',
    label: 'Drug response',
    renderCell: ({ drugResponse }) => (
      <Link to={`/disease/${drugResponse.id}`}>{drugResponse.name}</Link>
    ),
  },
  {
    id: 'confidence',
    label: 'Source',
    renderCell: ({ confidence, urls }) => {
      const entries = urls
        ? urls.map(url => ({
            url: url.url,
            name: url.niceName,
            group: 'Sources',
          }))
        : [];
      return <TableDrawer entries={entries} message={confidence} />;
    },
  },
  {
    id: 'literature',
    label: 'Literature',
    renderCell: ({ literature }) => {
      const entries = literature
        ? literature.map(id => ({
            name: id,
            url: epmcUrl(id),
            group: 'literature',
          }))
        : [];

      return (
        <PublicationsDrawer
          entries={entries}
          symbol={label.symbol}
          name={label.name}
        />
      );
    },
  },
];

export function BodyCore({ definition, id, label, count }) {
  const { ensgId, efoId } = id;

  const variables = {
    ensemblId: ensgId,
    efoId,
    size: count,
  };

  const request = useQuery(CANCER_BIOMARKERS_EVIDENCE_QUERY, {
    variables,
  });

  const columns = getColumns(label);

  return (
    <SectionItem
      definition={definition}
      chipText={definition.dataType}
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
            query={CANCER_BIOMARKERS_EVIDENCE_QUERY.loc.source.body}
            variables={variables}
          />
        );
      }}
    />
  );
}

export function Body({ definition, id, label }) {
  const { data: summaryData } = usePlatformApi(
    Summary.fragments.CancerBiomarkersEvidenceFragment
  );
  const { count } = summaryData.cancerBiomarkersSummary;

  if (!count || count < 1) {
    return null;
  }

  return (
    <BodyCore definition={definition} id={id} label={label} count={count} />
  );
}
