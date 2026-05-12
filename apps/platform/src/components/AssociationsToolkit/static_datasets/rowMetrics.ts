export interface RowMetricDef {
  id: string;
  gqlField: string;
  sortField: string;
  label: string;
  description: string;
  sortable: boolean;
  format: (v: number | null | undefined) => string;
}

export const ROW_METRICS: RowMetricDef[] = [
  {
    id: "novelty",
    gqlField: "noveltyDirect",
    sortField: "noveltyDirect",
    label: "Novelty Score",
    description: "Novelty of the target-disease association based on literature evidence.",
    sortable: true,
    format: (v) => (v != null ? v.toLocaleString() : "—"),
  },
];

// Maps column id → API sortBy value (differs until API schema rewrite)
export const METRICS_SORT_FIELD: Record<string, string> = Object.fromEntries(
  ROW_METRICS.map(m => [m.id, m.sortField])
);
