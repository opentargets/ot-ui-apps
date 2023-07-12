import { useQuery } from '@apollo/client';
import { Typography } from '@material-ui/core';
import { Link, SectionItem, Tooltip, ChipList } from 'ui';

import { definition } from '.';
import Summary from './Summary';
import Description from './Description';
import { epmcUrl } from '../../utils/urls';
import { dataTypesMap } from '../../dataTypes';
import { DataTable } from '../../components/Table';
import { defaultRowsPerPageOptions } from '../../constants';
import UNIPROT_LITERATURE_QUERY from './UniprotLiteratureQuery.gql';
import { identifiersOrgLink, sentenceCase } from '../../utils/global';
import { PublicationsDrawer } from '../../components/PublicationsDrawer';

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
    id: 'targetFromSourceId',
    label: 'Reported protein',
    renderCell: ({ targetFromSourceId }) => (
      <Link external to={identifiersOrgLink('uniprot', targetFromSourceId)}>
        {targetFromSourceId}
      </Link>
    ),
  },
  {
    id: 'confidence',
    label: 'Confidence',
    renderCell: ({ confidence }) => <>{sentenceCase(confidence)}</>,
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

function Body({ id, label }) {
  const { ensgId, efoId } = id;

  const variables = {
    ensemblId: ensgId,
    efoId,
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

export default Body;

