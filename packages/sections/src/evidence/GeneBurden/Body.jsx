import { useQuery } from "@apollo/client";
import { Typography } from "@mui/material";
import {
  Link,
  Tooltip,
  SectionItem,
  PublicationsDrawer,
  DataTable,
  ScientificNotation,
  DirectionOfEffectIcon,
} from "ui";

import { definition } from ".";
import Description from "./Description";
import { epmcUrl } from "../../utils/urls";
import { dataTypesMap } from "../../dataTypes";
import { defaultRowsPerPageOptions, naLabel, sectionsBaseSizeQuery } from "../../constants";

import GENE_BURDEN_QUERY from "./GeneBurdenQuery.gql";

const sources = [
  "Epi25 collaborative",
  "Autism Sequencing Consortiuml",
  "SCHEMA consortium",
  "Genebass",
  "AstraZeneca PheWAS Portal",
];

const getSource = (cohort, project) => {
  if (!cohort) return project;
  return `${cohort} (${project})`;
};

const getSourceLink = (project, targetId) => {
  if (project === "Epi25 collaborative") return `https://epi25.broadinstitute.org/gene/${targetId}`;
  if (project === "Autism Sequencing Consortiuml")
    return `https://asc.broadinstitute.org/gene/${targetId}`;
  if (project === "SCHEMA consortium") return `https://schema.broadinstitute.org/gene/${targetId}`;
  if (project === "Genebass")
    return `https://app.genebass.org/gene/${targetId}?burdenSet=pLoF&phewasOpts=1&resultLayout=full`;
  if (project === "AstraZeneca PheWAS Portal") return `https://azphewas.com`;
  return "";
};

const getColumns = label => [
  {
    id: "disease.name",
    label: "Disease/phenotype",
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
    id: "studyId",
    label: "Study ID",
    renderCell: ({ studyId }) =>
      studyId ? (
        <Link to={`https://www.ebi.ac.uk/gwas/studies/${studyId}`} external>
          {studyId}
        </Link>
      ) : (
        naLabel
      ),
  },
  {
    id: "cohortId",
    label: "Cohort/Project",
    renderCell: ({ cohortId, projectId, target }) => {
      if (!cohortId && !projectId) return naLabel;
      // the getSource() function takes care of case where cohortId==null
      if (sources.indexOf(projectId) < 0) return getSource(cohortId, projectId);
      return (
        <Link to={getSourceLink(projectId, target.id)} external>
          {getSource(cohortId, projectId)}
        </Link>
      );
    },
    filterValue: ({ cohortId, projectId }) => `${cohortId} ${projectId}`,
  },
  {
    id: "ancestry",
    label: "Ancestry",
    renderCell: ({ ancestry, ancestryId }) => {
      if (!ancestry) return naLabel;
      return (
        <Link to={`http://purl.obolibrary.org/obo/${ancestryId}`} external>
          {ancestry}
        </Link>
      );
    },
  },
  {
    id: "statisticalMethod",
    label: "Model",
    renderCell: ({ statisticalMethod, statisticalMethodOverview }) => (
      <Tooltip title={statisticalMethodOverview} showHelpIcon>
        {statisticalMethod}
      </Tooltip>
    ),
  },
  {
    id: "allelicRequirements",
    label: "Allelic Requirement",
    renderCell: ({ allelicRequirements }) =>
      allelicRequirements ? allelicRequirements[0] : naLabel,
  },
  {
    id: "studyCasesWithQualifyingVariants",
    label: "Cases with QV",
    numeric: true,
    sortable: true,
    renderCell: ({ studyCasesWithQualifyingVariants }) =>
      studyCasesWithQualifyingVariants
        ? parseInt(studyCasesWithQualifyingVariants, 10).toLocaleString()
        : naLabel,
    filterValue: ({ studyCasesWithQualifyingVariants }) =>
      `${studyCasesWithQualifyingVariants} ${naLabel}`,
  },
  {
    id: "studyCases",
    label: "Cases",
    numeric: true,
    sortable: true,
    renderCell: ({ studyCases }) =>
      studyCases ? parseInt(studyCases, 10).toLocaleString() : naLabel,
  },
  {
    id: "studySampleSize",
    label: "Sample size",
    numeric: true,
    sortable: true,
    renderCell: ({ studySampleSize }) =>
      studySampleSize ? parseInt(studySampleSize, 10).toLocaleString() : naLabel,
  },
  {
    id: "oddsRatio",
    label: "Odds Ratio (CI 95%)",
    numeric: true,
    sortable: true,
    renderCell: ({
      oddsRatio,
      oddsRatioConfidenceIntervalLower,
      oddsRatioConfidenceIntervalUpper,
    }) => {
      const ci =
        oddsRatioConfidenceIntervalLower && oddsRatioConfidenceIntervalUpper
          ? `(${parseFloat(oddsRatioConfidenceIntervalLower.toFixed(3))}, ${parseFloat(
              oddsRatioConfidenceIntervalUpper.toFixed(3)
            )})`
          : "";
      return oddsRatio ? `${parseFloat(oddsRatio.toFixed(3))} ${ci}` : naLabel;
    },
    filterValue: ({
      oddsRatio,
      oddsRatioConfidenceIntervalLower,
      oddsRatioConfidenceIntervalUpper,
    }) =>
      `${oddsRatio} ${oddsRatioConfidenceIntervalLower} ${oddsRatioConfidenceIntervalUpper} ${naLabel}`,
  },
  {
    id: "beta",
    label: "Beta (CI 95%)",
    numeric: true,
    sortable: true,
    renderCell: ({ beta, betaConfidenceIntervalLower, betaConfidenceIntervalUpper }) => {
      const ci =
        betaConfidenceIntervalLower && betaConfidenceIntervalUpper
          ? `(${parseFloat(betaConfidenceIntervalLower.toFixed(3))}, ${parseFloat(
              betaConfidenceIntervalUpper.toFixed(3)
            )})`
          : "";
      return beta ? `${parseFloat(beta.toFixed(3))} ${ci}` : naLabel;
    },
    filterValue: ({ beta, betaConfidenceIntervalLower, betaConfidenceIntervalUpper }) =>
      `${beta} ${betaConfidenceIntervalLower} ${betaConfidenceIntervalUpper} ${naLabel}`,
  },
  {
    id: "directionOfVariantEffect",
    label: (
      <Tooltip
        showHelpIcon
        title={
          <>
            See{" "}
            <Link external to="https://home.opentargets.org/aotf-documentation#direction-of-effect">
              here
            </Link>{" "}
            for more info on our assessment method
          </>
        }
      >
        Direction Of Effect
      </Tooltip>
    ),
    renderCell: ({ variantEffect, directionOnTrait }) => {
      return (
        <DirectionOfEffectIcon variantEffect={variantEffect} directionOnTrait={directionOnTrait} />
      );
    },
  },
  {
    id: "pValue",
    label: (
      <>
        <i>p</i>-value
      </>
    ),
    numeric: true,
    sortable: true,
    renderCell: ({ pValueMantissa, pValueExponent }) => (
      <ScientificNotation number={[pValueMantissa, pValueExponent]} />
    ),
    filterValue: ({ pValueMantissa, pValueExponent }) => `${pValueMantissa} ${pValueExponent}`,
    exportValue: ({ pValueMantissa, pValueExponent }) => `${pValueMantissa}x10${pValueExponent}`,
    comparator: (a, b) =>
      a.pValueMantissa * 10 ** a.pValueExponent - b.pValueMantissa * 10 ** b.pValueExponent,
  },
  {
    id: "literature",
    label: "Literature",
    renderCell: ({ literature }) => {
      const entries = literature
        ? literature.map(id => ({
            name: id,
            url: epmcUrl(id),
            group: "literature",
          }))
        : [];

      return <PublicationsDrawer entries={entries} symbol={label.symbol} name={label.name} />;
    },
  },
];

export function Body({ id, label, entity }) {
  const { ensgId, efoId } = id;
  const variables = {
    ensemblId: ensgId,
    efoId,
    size: sectionsBaseSizeQuery,
  };
  const request = useQuery(GENE_BURDEN_QUERY, {
    variables,
  });
  const columns = getColumns(label);

  return (
    <SectionItem
      definition={definition}
      chipText={dataTypesMap.genetic_association}
      entity={entity}
      request={request}
      renderDescription={() => <Description symbol={label.symbol} diseaseName={label.name} />}
      renderBody={({ disease }) => {
        const { rows } = disease.geneBurdenSummary;
        return (
          <DataTable
            columns={columns}
            rows={rows}
            order="asc"
            sortBy="pValue"
            dataDownloader
            dataDownloaderFileStem={`geneburden-${ensgId}-${efoId}`}
            showGlobalFilter
            rowsPerPageOptions={defaultRowsPerPageOptions}
            query={GENE_BURDEN_QUERY.loc.source.body}
            variables={variables}
          />
        );
      }}
    />
  );
}

export default Body;
