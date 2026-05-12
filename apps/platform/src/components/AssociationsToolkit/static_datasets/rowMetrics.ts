export interface RowMetricDef {
  id: string;
  dataField?: string;   // row data key to read from; defaults to id
  gqlField: string;
  sortField: string;
  label: string;
  description: string;
  sortable: boolean;
  format: (v: number | null | undefined) => string;
}

export const ROW_METRICS: RowMetricDef[] = [
  {
    id: "noveltyIcon",
    dataField: "novelty",
    gqlField: "noveltyDirect",
    sortField: "noveltyDirect",
    label: "Novelty",
    description: "Click to view novelty details for this association.",
    sortable: true,
    format: (v) => (v != null ? v.toFixed(2) : "—"),
  },
  {
    id: "novelty",
    gqlField: "noveltyDirect",
    sortField: "noveltyDirect",
    label: "Novelty",
    description: "Novelty of the target-disease association based on literature evidence.",
    sortable: true,
    format: (v) => (v != null ? v.toFixed(2) : "—"),
  },
];

// Maps column id → API sortBy value (differs until API schema rewrite)
export const METRICS_SORT_FIELD: Record<string, string> = Object.fromEntries(
  ROW_METRICS.map(m => [m.id, m.sortField])
);
