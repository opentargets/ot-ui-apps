import { List, ListItem, Typography } from '@material-ui/core';
import { useQuery } from '@apollo/client';
import { v1 } from 'uuid';

import usePlatformApi from '../../../hooks/usePlatformApi';
import { DataTable } from '../../../components/Table';
import { defaultRowsPerPageOptions, naLabel } from '../../../constants';
import Description from './Description';
import { epmcUrl } from '../../../utils/urls';
import { dataTypesMap } from '../../../dataTypes';
import Link from '../../../components/Link';
import SectionItem from '../../../components/Section/SectionItem';
import { sentenceCase } from '../../../utils/global';
import Tooltip from '../../../components/Tooltip';
import { PublicationsDrawer } from '../../../components/PublicationsDrawer';
import OPEN_TARGETS_GENETICS_QUERY from './sectionQuery.gql';
import Summary from './Summary';

const g2pUrl = (studyId, symbol) =>
  `https://www.ebi.ac.uk/gene2phenotype/search?panel=${studyId}&search_term=${symbol}`;

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
              {sentenceCase(diseaseFromSource)}
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
    id: 'variantFunctionalConsequence',
    label: 'Functional consequence',
    renderCell: ({ variantFunctionalConsequence }) =>
      variantFunctionalConsequence ? (
        <Link
          external
          to={`http://www.sequenceontology.org/browser/current_svn/term/${variantFunctionalConsequence.id}`}
        >
          {sentenceCase(variantFunctionalConsequence.label)}
        </Link>
      ) : (
        naLabel
      ),
    filterValue: ({ variantFunctionalConsequence }) =>
      sentenceCase(variantFunctionalConsequence.label),
  },
  {
    id: 'allelicRequirements',
    label: 'Allelic requirement',
    renderCell: ({ allelicRequirements }) => {
      if (allelicRequirements && allelicRequirements.length > 1) {
        return (
          <List>
            {allelicRequirements.map(item => (
              <ListItem key={v1()}>{item}</ListItem>
            ))}
          </List>
        );
      }
      if (allelicRequirements && allelicRequirements.length === 1) {
        return sentenceCase(allelicRequirements[0]);
      }

      return naLabel;
    },
    filterValue: ({ allelicRequirements }) => allelicRequirements.join(),
  },
  {
    id: 'studyId',
    label: 'Panel',
    renderCell: ({ studyId, target: { approvedSymbol } }) => (
      <Link external to={g2pUrl(studyId, approvedSymbol)}>
        {studyId}
      </Link>
    ),
  },
  {
    id: 'confidence',
    label: 'Confidence category',
    renderCell: ({ confidence }) =>
      confidence ? (
        <Tooltip
          title={
            <Typography variant="caption" display="block" align="center">
              As defined by the{' '}
              <Link
                external
                to="https://thegencc.org/faq.html#validity-termsdelphi-survey"
              >
                GenCC Guidelines
              </Link>
            </Typography>
          }
          showHelpIcon
        >
          {sentenceCase(confidence)}
        </Tooltip>
      ) : (
        naLabel
      ),
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
      return <PublicationsDrawer entries={entries} />;
    },
  },
];

export function BodyCore({
  definition,
  id: { ensgId, efoId },
  label: { symbol, name },
  count,
}) {
  const variables = { ensemblId: ensgId, efoId, size: count };

  const request = useQuery(OPEN_TARGETS_GENETICS_QUERY, {
    variables,
  });

  return (
    <SectionItem
      definition={definition}
      chipText={dataTypesMap.genetic_association}
      request={request}
      renderDescription={() => <Description symbol={symbol} name={name} />}
      renderBody={data => (
        <DataTable
          columns={columns}
          dataDownloader
          dataDownloaderFileStem={`${ensgId}-${efoId}-gene2phenotype`}
          rows={data.disease.evidences.rows}
          pageSize={10}
          rowsPerPageOptions={defaultRowsPerPageOptions}
          showGlobalFilter
          query={OPEN_TARGETS_GENETICS_QUERY.loc.source.body}
          variables={variables}
        />
      )}
    />
  );
}

export function Body({ definition, id, label }) {
  const {
    data: {
      gene2Phenotype: { count },
    },
  } = usePlatformApi(Summary.fragments.Gene2PhenotypeSummaryFragment);

  if (!count || count < 1) {
    return null;
  }

  return (
    <BodyCore definition={definition} id={id} label={label} count={count} />
  );
}
