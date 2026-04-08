import type { GseaResult } from "../../../api/gseaApi";

/**
 * Extract gene list from comma-separated string in Leading edge genes field
 */
export function getGeneList(result: GseaResult): string[] {
  const genes = result["Leading edge genes"];
  if (!genes || genes === "") return [];
  return genes
    .split(",")
    .map((g) => g.trim())
    .filter(Boolean);
}

/**
 * Calculate Jaccard similarity coefficient between two sets
 * Formula: |A ∩ B| / |A ∪ B| as per Enrichment Map paper
 */
export function jaccardSimilarity(setA: string[], setB: string[]): number {
  if (setA.length === 0 || setB.length === 0) return 0;
  const b = new Set(setB);
  const intersection = setA.filter((item) => b.has(item)).length;
  const union = new Set([...setA, ...setB]).size;
  return union > 0 ? intersection / union : 0;
}
