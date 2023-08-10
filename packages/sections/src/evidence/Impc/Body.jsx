import { Typography } from '@mui/material';
import { useQuery } from '@apollo/client';
import { Link, SectionItem, Tooltip } from 'ui';

import { definition } from '.';
import Description from './Description';
import INTOGEN_QUERY from './sectionQuery.gql';
import { dataTypesMap } from '../../dataTypes';
import { sentenceCase } from '../../utils/global';
import { DataTable, TableDrawer } from '../../components/Table';
import { defaultRowsPerPageOptions, naLabel } from '../../constants';
import MouseModelAllelicComposition from '../../components/MouseModelAllelicComposition';

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
    id: 'diseaseModelAssociatedHumanPhenotypes',
    label: 'Human phenotypes',
    renderCell: ({
      diseaseModelAssociatedHumanPhenotypes: humanPhenotypes,
    }) => {
      const entries = humanPhenotypes
        ? humanPhenotypes.map(entry => ({
            name: entry.label,
            group: 'Human phenotypes',
          }))
        : [];
      return (
        <TableDrawer
          entries={entries}
          showSingle={false}
          message={`${humanPhenotypes ? humanPhenotypes.length : 0} phenotype${
            humanPhenotypes === null || humanPhenotypes.length !== 1 ? 's' : ''
          }`}
        />
      );
    },
    filterValue: ({ diseaseModelAssociatedHumanPhenotypes = [] }) =>
      diseaseModelAssociatedHumanPhenotypes.map(dmahp => dmahp.label).join(),
  },
  {
    id: 'diseaseModelAssociatedModelPhenotypes',
    label: 'Mouse phenotypes',

    renderCell: ({
      diseaseModelAssociatedModelPhenotypes: mousePhenotypes,
    }) => (
      <TableDrawer
        entries={mousePhenotypes.map(entry => ({
          name: entry.label,
          group: 'Mouse phenotypes',
        }))}
        showSingle={false}
        message={`${mousePhenotypes.length} phenotype${
          mousePhenotypes.length !== 1 ? 's' : ''
        }`}
      />
    ),
    filterValue: ({ diseaseModelAssociatedModelPhenotypes = [] }) =>
      diseaseModelAssociatedModelPhenotypes.map(dmamp => dmamp.label).join(),
  },
  {
    id: 'literature',
    label: 'Mouse model allelic composition',
    renderCell: ({
      biologicalModelAllelicComposition,
      biologicalModelGeneticBackground,
      biologicalModelId,
    }) => {
      if (
        biologicalModelAllelicComposition &&
        biologicalModelGeneticBackground &&
        biologicalModelId
      ) {
        return (
          <Link external to={`https://identifiers.org/${biologicalModelId}`}>
            <MouseModelAllelicComposition
              allelicComposition={biologicalModelAllelicComposition}
              geneticBackground={biologicalModelGeneticBackground}
            />
          </Link>
        );
      }
      if (
        biologicalModelAllelicComposition &&
        biologicalModelGeneticBackground
      ) {
        return (
          <MouseModelAllelicComposition
            allelicComposition={biologicalModelAllelicComposition}
            geneticBackground={biologicalModelGeneticBackground}
          />
        );
      }

      return naLabel;
    },
  },
];

function Body({ id, label, entity }) {
  const { ensgId, efoId } = id;
  const variables = {
    ensemblId: ensgId,
    efoId,
  };
  const request = useQuery(INTOGEN_QUERY, {
    variables,
  });

  return (
    <SectionItem
      definition={definition}
      chipText={dataTypesMap.animal_model}
      request={request}
      entity={entity}
      renderDescription={() => (
        <Description symbol={label.symbol} name={label.name} />
      )}
      renderBody={data => (
        <DataTable
          columns={columns}
          dataDownloader
          dataDownloaderFileStem={`otgenetics-${ensgId}-${efoId}`}
          rows={data.disease.impc.rows}
          pageSize={5}
          rowsPerPageOptions={[5].concat(defaultRowsPerPageOptions)} // custom page size of 5 is not included in defaultRowsPerPageOptions
          showGlobalFilter
          query={INTOGEN_QUERY.loc.source.body}
          variables={variables}
        />
      )}
    />
  );
}

export default Body;