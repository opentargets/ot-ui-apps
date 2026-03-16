// General metric type
export type Metric = {
  [key: string]: string;
};

// Data metrics page props types
export interface DataMetricsPageProps {
  currentRelease: string;
  previousRelease: string;
  currentMetricsFile: string;
  previousMetricsFile: string;
}

// Pie chart data types
export interface DataMetricsPieChartProps {
  data: PieDatum[];
  width?: number;
  height?: number;
}

export interface PieDatum {
  label: string;
  value: number;
}

export interface Tooltip {
  x: number;
  y: number;
  label: string;
  value: number;
}

// Table props types
export interface DataMetricsTableProps {
  metrics: Metric[];
  prevMetrics: Metric[];
  variables: string[];
  sources: string[];
}

export type Row = {
  [variable: string]: {
    display: React.ReactNode;
    value: string;
  };
};

// Total cards props types
export interface DataMetricsTotalCardsProps {
  metrics: Metric[];
  prevMetrics: Metric[];
}

// Download link props types
export interface DownloadLinkProps {
  title: string;
  file: string;
}

// Evidence data metrics section props types
export interface EvidenceDataMetricsSectionProps {
  metrics: Metric[];
  prevMetrics: Metric[];
}
