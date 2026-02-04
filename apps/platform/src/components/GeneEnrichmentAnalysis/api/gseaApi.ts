import type { AnalysisDirection, Gene } from "../types";

const GSEA_API_BASE_URL = "http://127.0.0.1:8000/api/gsea";

export interface GseaResult {
  term: string;
  es: number;
  nes: number;
  pval: number;
  fdr: number;
  geneset_size: number;
  matched_size: number;
  genes: string[];
  // Add other fields as needed based on actual API response
}

export interface GseaAnalyzeResponse {
  results: GseaResult[];
}

export interface GseaAnalyzeParams {
  genes: Gene[];
  library: string;
  analysisDirection?: AnalysisDirection;
}

/**
 * Run GSEA analysis with the provided genes and library.
 */
export async function analyzeGsea({
  genes,
  library,
  analysisDirection = "one_sided_positive",
}: GseaAnalyzeParams): Promise<GseaResult[]> {
  const url = new URL(`${GSEA_API_BASE_URL}/analyze/json`);
  url.searchParams.set("gmt_name", library);
  url.searchParams.set("analysis_direction", analysisDirection);

  const response = await fetch(url.toString(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ genes }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`GSEA analysis failed: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  // API returns { results: GseaResult[] }
  return data.results ?? data;
}

/**
 * Fetch available GSEA libraries.
 */
export async function fetchLibraries(): Promise<string[]> {
  const response = await fetch(`${GSEA_API_BASE_URL}/libraries`);

  if (!response.ok) {
    throw new Error(`Failed to fetch libraries: ${response.status}`);
  }

  return response.json();
}
