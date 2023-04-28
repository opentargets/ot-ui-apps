import { useQuery } from '@apollo/client';
import { Box, Typography, makeStyles } from '@material-ui/core';
import usePlatformApi from '../../../hooks/usePlatformApi';
import { sentenceCase } from '../../../utils/global';
import SectionItem from '../../../components/Section/SectionItem';
import ChipList from '../../../components/ChipList';
import { DataTable } from '../../../components/Table';
import { PublicationsDrawer } from '../../../components/PublicationsDrawer';
import { epmcUrl } from '../../../utils/urls';
import {
  clinvarStarMap,
  naLabel,
  defaultRowsPerPageOptions,
} from '../../../constants';
import Tooltip from '../../../components/Tooltip';
import ClinvarStars from '../../../components/ClinvarStars';
import Summary from './Summary';
import Description from './Description';
import Link from '../../../components/Link';
import { dataTypesMap } from '../../../dataTypes';

import EVA_SOMATIC_QUERY from './EvaSomaticQuery.gql';

const columns = [
  {
    id: 'disease.name',
    label: 'Disease/phenotype',
    renderCell: ({ disease, diseaseFromSource, cohortPhenotypes }) => (
      <Tooltip
        title={
          <>
            <Typography variant="subtitle2" display="block" align="center">
              Reported disease or phenotype:
            </Typography>
            <Typography
              variant="caption"
              display="block"
              align="center"
              gutterBottom
            >
              {diseaseFromSource}
            </Typography>

            {cohortPhenotypes?.length > 1 ? (
              <>
                <Typography variant="subtitle2" display="block" align="center">
                  All reported phenotypes:
                </Typography>
                <Typography variant="caption" display="block">
                  {cohortPhenotypes.map(cp => (
                    <div key={cp}>{cp}</div>
                  ))}
                </Typography>
              </>
            ) : (
              ''
            )}
          </>
        }
        showHelpIcon
      >
        <Link to={`/disease/${disease.id}`}>{disease.name}</Link>
      </Tooltip>
    ),
  },
  {
    id: 'variantId',
    label: 'Variant ID',
    renderCell: ({ variantId }) =>
      variantId ? (
        <>
          {variantId.substring(0, 20)}
          {variantId.length > 20 ? '\u2026' : ''}
        </>
      ) : (
        naLabel
      ),
    filterValue: ({ variantId }) => `${variantId}`,
  },
  {
    id: 'variantRsId',
    label: 'rsID',
    renderCell: ({ variantRsId }) =>
      variantRsId ? (
        <Link
          external
          to={`http://www.ensembl.org/Homo_sapiens/Variation/Explore?v=${variantRsId}`}
        >
          {variantRsId}
        </Link>
      ) : (
        naLabel
      ),
    filterValue: ({ variantRsId }) => `${variantRsId}`,
  },
  {
    id: 'variantHgvsId',
    label: 'HGVS ID',
    renderCell: ({ variantHgvsId }) => variantHgvsId || naLabel,
    filterValue: ({ variantHgvsId }) => `${variantHgvsId}`,
  },
  {
    id: 'studyId',
    label: 'ClinVar ID',
    renderCell: ({ studyId }) => (
      <Link external to={`https://identifiers.org/clinvar.record/${studyId}`}>
        {studyId}
      </Link>
    ),
  },
  {
    id: 'clinicalSignificances',
    label: 'Clinical significance',
    renderCell: ({ clinicalSignificances }) => {
      if (!clinicalSignificances) return naLabel;

      if (clinicalSignificances.length === 1)
        return sentenceCase(clinicalSignificances[0]);

      if (clinicalSignificances.length > 1)
        return (
          <ul
            style={{
              margin: 0,
              padding: 0,
              listStyle: 'none',
            }}
          >
            {clinicalSignificances.map(clinicalSignificance => (
              <li key={clinicalSignificance}>
                {sentenceCase(clinicalSignificance)}
              </li>
            ))}
          </ul>
        );

      return naLabel;
    },
    filterValue: ({ clinicalSignificances }) => clinicalSignificances.join(),
  },
  {
    id: 'allelicRequirements',
    label: 'Allele origin',
    renderCell: ({ alleleOrigins, allelicRequirements }) => {
      if (!alleleOrigins || alleleOrigins.length === 0) return naLabel;

      if (allelicRequirements)
        return (
          <Tooltip
            title={
              <>
                <Typography variant="subtitle2" display="block" align="center">
                  Allelic requirements:
                </Typography>
                {allelicRequirements.map(r => (
                  <Typography variant="caption" key={r}>
                    {r}
                  </Typography>
                ))}
              </>
            }
            showHelpIcon
          >
            {alleleOrigins.map(a => sentenceCase(a)).join('; ')}
          </Tooltip>
        );

      return alleleOrigins.map(a => sentenceCase(a)).join('; ');
    },
    filterValue: ({ alleleOrigins }) =>
      alleleOrigins ? alleleOrigins.join() : '',
  },
  {
    label: 'Review status',
    renderCell: ({ confidence }) => (
      <Tooltip title={confidence}>
        <span>
          <ClinvarStars num={clinvarStarMap[confidence]} />
        </span>
      </Tooltip>
    ),
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

const useStyles = makeStyles({
  roleInCancerBox: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '2rem',
  },
  roleInCancerTitle: { marginRight: '.5rem' },
});

export function BodyCore({ definition, id, label, count }) {
  const classes = useStyles();
  const { ensgId, efoId } = id;
  const variables = {
    ensemblId: ensgId,
    efoId,
    size: count,
  };

  const request = useQuery(EVA_SOMATIC_QUERY, {
    variables,
  });

  return (
    <SectionItem
      definition={definition}
      chipText={dataTypesMap.somatic_mutation}
      request={request}
      renderDescription={() => (
        <Description symbol={label.symbol} name={label.name} />
      )}
      renderBody={({ disease, target: { hallmarks } }) => {
        const { rows } = disease.evidences;

        const roleInCancerItems =
          hallmarks && hallmarks.attributes.length > 0
            ? hallmarks.attributes
                .filter(attribute => attribute.name === 'role in cancer')
                .map(attribute => ({
                  label: attribute.description,
                  url: epmcUrl(attribute.pmid),
                }))
            : [{ label: 'Unknown' }];
        return (
          <>
            <Box className={classes.roleInCancerBox}>
              <Typography className={classes.roleInCancerTitle}>
                <b>{label.symbol}</b> role in cancer:
              </Typography>
              <ChipList items={roleInCancerItems} />
            </Box>
            <DataTable
              columns={columns}
              rows={rows}
              dataDownloader
              showGlobalFilter
              sortBy="score"
              order="desc"
              rowsPerPageOptions={defaultRowsPerPageOptions}
              query={EVA_SOMATIC_QUERY.loc.source.body}
              variables={variables}
            />
          </>
        );
      }}
    />
  );
}

export function Body({ definition, id, label }) {
  const { data: summaryData } = usePlatformApi(
    Summary.fragments.evaSomaticSummary
  );
  const { count } = summaryData.evaSomaticSummary;

  if (!count || count < 1) {
    return null;
  }

  return (
    <BodyCore definition={definition} id={id} label={label} count={count} />
  );
}
