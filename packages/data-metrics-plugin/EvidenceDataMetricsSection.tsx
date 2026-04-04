import { Box, CircularProgress } from "@mui/material";
import { VIEW } from "@ot/constants";
import { SectionItem } from "ui";
import DataMetricsPieChart from "./DataMetricsPieChart";
import DataMetricsTable from "./DataMetricsTable";
import { evidenceDefinition } from "./index";
import { EvidenceDataMetricsSectionProps } from "./types";

const excludeVariables = [
  "evidenceFieldNotNullCountByDatasource",
  "evidenceDistinctFieldsCountByDatasource",
  "evidenceInvalidCountByDatasource",
  "evidenceInvalidDistinctFieldsCountByDatasource",
  "evidenceDuplicateDistinctFieldsCountByDatasource",
  "evidenceNullifiedScoreDistinctFieldsCountByDatasource",
  "evidenceUnresolvedTargetDistinctFieldsCountByDatasource",
  "evidenceUnresolvedDiseaseDistinctFieldsCountByDatasource",
  "evidenceDuplicateCountByDatasource",
  "evidenceNullifiedScoreCountByDatasource",
  "evidenceUnresolvedTargetCountByDatasource",
  "evidenceUnresolvedDiseaseCountByDatasource",
  "associationsDirectByDatasourceAUC",
  "associationsDirectByDatasourceOR",
  "associationsIndirectByDatasourceAUC",
  "associationsIndirectByDatasourceOR",
];

function EvidenceDataMetricsSection({ metrics, prevMetrics }: EvidenceDataMetricsSectionProps) {
  const isLoading = !metrics.length || !prevMetrics.length;
  // Table and chart logic
  const sourcesExcludeList = ["all", "drug", "target"];
  const sourcesList = Array.from(
    new Set([
      ...metrics.map((m) => m.datasourceId).filter((ds) => ds && !sourcesExcludeList.includes(ds)),
      ...prevMetrics
        .map((m) => m.datasourceId)
        .filter((ds) => ds && !sourcesExcludeList.includes(ds)),
    ])
  );
  const variables = Array.from(
    new Set([
      ...metrics.map((m) => m.variable).filter(Boolean),
      ...prevMetrics.map((m) => m.variable).filter(Boolean),
    ])
  ).filter((variable) => {
    if (excludeVariables.includes(variable)) return false;
    return (
      metrics.some(
        (m) =>
          m.variable === variable &&
          !sourcesExcludeList.includes(m.datasourceId) &&
          m.value &&
          m.value !== "" &&
          m.value !== "0"
      ) ||
      prevMetrics.some(
        (m) =>
          m.variable === variable &&
          !sourcesExcludeList.includes(m.datasourceId) &&
          m.value &&
          m.value !== "" &&
          m.value !== "0"
      )
    );
  });

  // Pie chart data
  const pieSources = Array.from(
    new Set(
      metrics.map((m) => m.datasourceId).filter((ds) => ds && !sourcesExcludeList.includes(ds))
    )
  );
  const pieVariables = Array.from(new Set(metrics.map((m) => m.variable).filter(Boolean))).filter(
    (variable) => {
      if (excludeVariables.includes(variable)) return false;
      return metrics.some(
        (m) =>
          m.variable === variable &&
          !sourcesExcludeList.includes(m.datasourceId) &&
          m.value &&
          m.value !== "" &&
          m.value !== "0"
      );
    }
  );
  const pieData = pieSources
    .map((ds) => {
      const total = pieVariables.reduce((sum, variable) => {
        const metric = metrics.find((m) => m.datasourceId === ds && m.variable === variable);
        return sum + (metric ? Number(metric.value) : 0);
      }, 0);
      return { label: ds, value: total };
    })
    .filter((d) => d.value > 0);

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
        <CircularProgress />
      </Box>
    );
  }
  return (
    <SectionItem
      entity={"metrics"}
      definition={evidenceDefinition}
      request={{ loading: false, data: { metrics, prevMetrics } }}
      renderDescription={() => null}
      renderBody={() => (
        <DataMetricsTable
          metrics={metrics}
          prevMetrics={prevMetrics}
          variables={variables}
          sources={sourcesList}
        />
      )}
      renderChart={() => <DataMetricsPieChart data={pieData} />}
      tags={[]}
      chipText=""
      showEmptySection={false}
      showContentLoading={false}
      loadingMessage="Loading data. This may take some time..."
      defaultView={VIEW.table}
    />
  );
}

export default EvidenceDataMetricsSection;
