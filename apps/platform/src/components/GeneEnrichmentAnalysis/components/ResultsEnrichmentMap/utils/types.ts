import type { GseaResult } from "../../../api/gseaApi";

export interface ResultsEnrichmentMapProps {
  results: GseaResult[];
}

export interface ComputedStats {
  totalGenes?: number;
  totalPathways?: number;
  edges: number;
  significantCount?: number;
}
