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
  OtTable,
  DirectionOfEffectTooltip,
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
      <DirectionOfEffectTooltip docsUrl="https://platform-docs.opentargets.org/evidence#gene-burden"></DirectionOfEffectTooltip>
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

const getTanstackColumns = label => [
  {
    header: "Disease/phenotype",
    accessorFn: row => row.disease.name,
    cell: d => (
      <Tooltip
        title={
          <>
            <Typography variant="subtitle2" display="block" align="center">
              Reported disease or phenotype:
            </Typography>
            <Typography variant="caption" display="block" align="center">
              {d.row.original.diseaseFromSource}
            </Typography>
          </>
        }
        showHelpIcon
      >
        <Link to={`/disease/${d.row.original.disease.id}`}>{d.row.original.disease.name}</Link>
      </Tooltip>
    ),
    enableSorting: false,
    enableColumnFilter: false,
  },
  {
    header: "Study ID",
    accessorFn: row => row.studyId,
    cell: d =>
      d.row.original.studyId ? (
        <Link to={`https://www.ebi.ac.uk/gwas/studies/${d.row.original.studyId}`} external>
          {d.row.original.studyId}
        </Link>
      ) : (
        naLabel
      ),
    enableSorting: false,
    enableColumnFilter: false,
  },
  {
    header: "Cohort/Project",
    accessorFn: row => `${row.cohortId} (${row.projectId})`,
    cell: ({ row }) => {
      if (!row.original.cohortId && !row.original.projectId) return naLabel;
      // the getSource() function takes care of case where cohortId==null
      if (sources.indexOf(row.original.projectId) < 0)
        return getSource(row.original.cohortId, row.original.projectId);
      return (
        <Link to={getSourceLink(row.original.projectId, row.original.target.id)} external>
          {getSource(row.original.cohortId, row.original.projectId)}
        </Link>
      );
    },
    enableSorting: false,
    enableColumnFilter: false,
  },
  {
    header: "Ancestry",
    accessorFn: row => row.ancestry,
    cell: ({ row }) => {
      if (!row.original.ancestry) return naLabel;
      return (
        <Link to={`http://purl.obolibrary.org/obo/${row.original.ancestryId}`} external>
          {row.original.ancestry}
        </Link>
      );
    },
    enableSorting: false,
    enableColumnFilter: false,
  },
  {
    header: "Model",
    accessorKey: "statisticalMethod",
    cell: ({ row }) => (
      <Tooltip title={row.original.statisticalMethodOverview} showHelpIcon>
        {row.original.statisticalMethod}
      </Tooltip>
    ),
    enableSorting: false,
    enableColumnFilter: false,
  },
  {
    header: "Allelic Requirement",
    accessorFn: row => row.allelicRequirements,
    cell: ({ row }) =>
      row.original.allelicRequirements ? row.original.allelicRequirements[0] : naLabel,
    enableSorting: false,
    enableColumnFilter: false,
  },
  {
    header: "Cases with QV",
    accessorKey: "studyCasesWithQualifyingVariants",
    cell: ({ row }) =>
      row.original.studyCasesWithQualifyingVariants
        ? parseInt(row.original.studyCasesWithQualifyingVariants, 10).toLocaleString()
        : naLabel,
    enableSorting: false,
    enableColumnFilter: false,
  },
  {
    header: "Cases",
    accessorKey: "studyCases",
    enableSorting: false,
    enableColumnFilter: false,
  },
  {
    header: "Sample Size",
    accessorKey: "studySampleSize",
    enableSorting: false,
    enableColumnFilter: false,
  },
  {
    header: "Odds Ratio (CI 95%)",
    accessorKey: "oddsRatio",
    cell: ({ row }) => {
      const ci =
        row.original.oddsRatioConfidenceIntervalLower &&
        row.original.oddsRatioConfidenceIntervalUpper
          ? `(${row.original.oddsRatioConfidenceIntervalLower}, ${row.original.oddsRatioConfidenceIntervalUpper})`
          : "";
      return row.original.oddsRatio ? `${row.original.oddsRatio} ${ci}` : naLabel;
    },
    enableSorting: true,
    enableColumnFilter: false,
  },
  {
    header: "Beta (CI 95%)",
    accessorKey: "beta",
    cell: ({ row }) => {
      const ci =
        row.original.betaConfidenceIntervalLower && row.original.betaConfidenceIntervalUpper
          ? `(${parseFloat(row.original.betaConfidenceIntervalLower.toFixed(3))}, ${parseFloat(
              row.original.betaConfidenceIntervalUpper.toFixed(3)
            )})`
          : "";
      return row.original.beta ? `${parseFloat(row.original.beta.toFixed(3))} ${ci}` : naLabel;
    },
    enableSorting: true,
    enableColumnFilter: false,
  },
  {
    header: (
      <Tooltip
        showHelpIcon
        title={
          <>
            See{" "}
            <Link external to="https://platform-docs.opentargets.org/evidence#gene-burden">
              here
            </Link>{" "}
            for more info on our assessment method
          </>
        }
      >
        Direction Of Effect
      </Tooltip>
    ),
    accessorKey: "directionOfVariantEffect",
    cell: ({ row }) => (
      <DirectionOfEffectIcon
        variantEffect={row.original.variantEffect}
        directionOnTrait={row.original.directionOnTrait}
      />
    ),
    enableSorting: false,
    enableColumnFilter: false,
  },
  {
    header: (
      <>
        <i>p</i>-value
      </>
    ),
    accessorKey: "pValueMantissa",
    cell: ({ row }) => (
      <ScientificNotation number={[row.original.pValueMantissa, row.original.pValueExponent]} />
    ),
    enableSorting: false,
    enableColumnFilter: false,
  },
  {
    header: "literature",
    accessorKey: "Literature",
    cell: ({ row }) => {
      const entries = row.original.literature
        ? row.original.literature.map(id => ({
            name: id,
            url: epmcUrl(id),
            group: "literature",
          }))
        : [];

      return <PublicationsDrawer entries={entries} symbol={label.symbol} name={label.name} />;
    },
    enableSorting: false,
    enableColumnFilter: false,
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
  const columnsT = getTanstackColumns(label);

  return (
    <>
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

      <SectionItem
        definition={definition}
        chipText={dataTypesMap.genetic_association}
        entity={entity}
        request={request}
        renderDescription={() => <Description symbol={label.symbol} diseaseName={label.name} />}
        renderBody={({ disease }) => {
          const { rows } = disease.geneBurdenSummary;
          return (
            <OtTable
              showGlobalFilter={true}
              tableDataLoading={false}
              columns={columnsT}
              dataRows={rows}
            />
          );
        }}
      />
    </>
  );
}

export default Body;
