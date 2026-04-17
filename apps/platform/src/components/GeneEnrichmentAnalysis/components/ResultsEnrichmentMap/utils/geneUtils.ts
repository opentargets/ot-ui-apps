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
 * Used for pathway view similarity
 */
export function jaccardSimilarity(setA: string[], setB: string[]): number {
  if (setA.length === 0 || setB.length === 0) return 0;
  const b = new Set(setB);
  const intersection = setA.filter((item) => b.has(item)).length;
  const union = new Set([...setA, ...setB]).size;
  return union > 0 ? intersection / union : 0;
}

/**
 * Calculate overlap similarity between two sets
 * Formula: |A ∩ B| / min(|A|, |B|)
 * Less biased than Jaccard for hub genes (genes with many pathways)
 * since denominator uses the smaller set size rather than union
 * Used for gene view similarity
 */
export function overlapSimilarity(setA: string[], setB: string[]): number {
  if (setA.length === 0 || setB.length === 0) return 0;
  const b = new Set(setB);
  let intersection = 0;
  for (const item of setA) {
    if (b.has(item)) intersection++;
  }
  const minSize = Math.min(setA.length, setB.length);
  return minSize > 0 ? intersection / minSize : 0;
}
