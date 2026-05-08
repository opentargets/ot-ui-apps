import { ElementDefinition } from "cytoscape";
import type { GseaResult } from "../../../api/gseaApi";

type GeneListField = "Leading edge genes" | "Pathway genes";

/**
 * Extract gene list from comma-separated string in Leading edge genes field
 */
export function getPathwayGenesList(result: GseaResult): string[] {
  const field = "Pathway genes";
  return getGeneList(result, field);
}

export function getLeadingEdgeGenesList(result: GseaResult): string[] {
  const field = "Leading edge genes";
  return getGeneList(result, field);
}

export function getGeneList(
  result: GseaResult,
  field: GeneListField
): string[] {
  const genes = result[field];
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

/**
 * Filter elements to remove isolated nodes (nodes without any edges)
 * This dynamically removes nodes as similarity/FDR thresholds are adjusted
 *
 * @param elements - Combined array of nodes and edges from Cytoscape
 * @returns Filtered elements with isolated nodes removed
 */
export function filterNodesWithoutEdges(
  elements: Array<ElementDefinition>
): Array<ElementDefinition> {
  // Identify all nodes that are referenced by edges
  const nodesWithEdges = new Set<string>();

  for (const el of elements) {
    const data = el.data as Record<string, unknown> | undefined;
    if (data?.source && data?.target) {
      // This is an edge
      nodesWithEdges.add(data.source as string);
      nodesWithEdges.add(data.target as string);
    }
  }

  // Filter: keep all edges and only nodes that have connections
  const filtered = elements.filter((el) => {
    const data = el.data as Record<string, unknown> | undefined;
    // Keep edges, and nodes that have edges
    if (data?.source && data?.target) {
      // This is an edge, keep it
      return true;
    }
    // This is a node, keep only if it has edges
    return nodesWithEdges.has(data?.id as string);
  });

  console.log(
    `[FILTER_NODES] Removed ${elements.length - filtered.length} isolated node(s), kept ${filtered.length} elements`
  );

  return filtered;
}
