import type { ElementDefinition } from "cytoscape";
import type { GseaResult } from "../../../api/gseaApi";
import { getGeneList } from "./index";
import { Gene } from "../../../types";

export interface GeneNodeMetadata {
  gene: string;
  pathwayCount: number;
  bestFDR: number;
  pathways: string[];
}

export interface PathwayNodeMetadata {
  pathway: string;
  nes: number;
  es: number;
  fdr: number;
  pValue: number;
  pathwaySize: number;
  inputGenes: number;
  geneCount: number;
}


/**
 * Gets border color that matches the node color
 */
export function getBorderColor(nodeColor: string): string {
  switch (nodeColor) {
    case "#4caf50":
      return "#2e7d32";
    case "#8bc34a":
      return "#558b2f";
    case "#ff9800":
      return "#ef6c00";
    case "#ffcc80":
      return "#ff9800";
    case "#e91e63": // Upregulated (red)
      return "#ad1457";
    case "#2196f3": // Downregulated (blue)
      return "#1565c0";
    case "#9c27b0": // Conflicting (purple)
      return "#6a1b9a";
    case "#bdbdbd": // Non-leading-edge (grey)
      return "#616161";
    default:
      return "#9e9e9e";
  }
}

/**
 * Calculates node size based on sizeBy parameter and value
 */
export function calculateNodeSize(
  sizeBy: "significance" | "pathwaySize" | "geneCount",
  value: number,
  pathwayCount?: number
): number {
  switch (sizeBy) {
    case "significance":
      return Math.min(80, Math.max(30, -Math.log10(Math.max(value, 1e-10)) * 8));
    case "pathwaySize":
      return Math.min(80, Math.max(30, Math.sqrt(value) * (pathwayCount ? 20 : 5)));
    case "geneCount":
      return Math.min(
        80,
        Math.max(30, (pathwayCount || value) * (pathwayCount ? 5 : 3) + (pathwayCount ? 0 : 20))
      );
    default:
      return 40;
  }
}


/**
 * Builds gene-to-pathways mapping from results
 */
export function buildGeneToPathwaysMap(
  results: Array<Record<string, unknown>> | GseaResult[]
): Map<string, Array<{ pathway: string; fdr: number; nes: number }>> {
  const geneToPathways = new Map<string, Array<{ pathway: string; fdr: number; nes: number }>>();
  for (const r of results) {
    const geneList_ = getGeneList(r as GseaResult);
    for (const gene of geneList_) {
      if (!geneToPathways.has(gene)) {
        geneToPathways.set(gene, []);
      }
      const pathwaysForGene = geneToPathways.get(gene);
      if (pathwaysForGene) {
        pathwaysForGene.push({
          pathway: r.Pathway as string,
          fdr: r.FDR as number,
          nes: r.NES as number,
        });
      }
    }
  }
  console.log("[buildGeneToPathwaysMap] Built gene-to-pathways map with", geneToPathways, "genes");
  return geneToPathways;
}

/**
 * Filters and sorts genes by pathway count
 */
export function filterAndSortGenes(
  geneToPathways: Map<string, Array<{ pathway: string; fdr: number; nes: number }>>
): string[] {
  return Array.from(geneToPathways.entries())
    .filter(([_, pathways]) => pathways.length >= 2)
    .sort((a, b) => b[1].length - a[1].length)
    .slice(0, 500)
    .map(([gene]) => gene);
}




/**
 * Creates a pathway node element for Cytoscape
 * Color is set to neutral default and overridden by NES-based coloring in useElementComputation
 */
export function createPathwayNode(
  result: Record<string, unknown>,
  geneList: string[],
  sizeBy: "significance" | "pathwaySize" | "geneCount"
): ElementDefinition {
  const fdr = result.FDR as number;
  const nodeSize = calculateNodeSize(
    sizeBy,
    sizeBy === "pathwaySize" ? (result["Pathway size"] as number) : fdr,
    geneList.length
  );

  const nodeId = (result.ID as string) || (result.Pathway as string);
  const nodePathway = result.Pathway as string;
  const defaultColor = "#e0e0e0"; // Neutral grey - will be overridden by NES coloring

  return {
    data: {
      id: nodeId,
      label: nodePathway,
      pathway: nodePathway,
      link: result.Link as string | undefined,
      nes: result.NES,
      es: result.ES,
      fdr: fdr,
      pValue: result["p-value"],
      pathwaySize: result["Pathway size"],
      inputGenes: result["Number of input genes"],
      geneCount: geneList.length,
      leadingGenes: result["Leading edge genes"],
      color: defaultColor,
      borderColor: getBorderColor(defaultColor),
      size: nodeSize,
      displayLabel: nodePathway.length > 25 ? `${nodePathway.substring(0, 22)}...` : nodePathway,
    },
  };
}

/**
 * Builds pathway view nodes
 */
export function buildPathwayViewNodes(
  displayResults: Array<Record<string, unknown>> | GseaResult[],
  sizeBy: "significance" | "pathwaySize" | "geneCount",
  genes?: Gene[]
): {
  nodes: ElementDefinition[];
  stats: { totalPathways: number; edges: number; totalGenes: number; significantCount: number };
} {
  const geneToPathways = new Map<string, string[]>();

  for (const r of displayResults) {
    const geneList_ = getGeneList(r as GseaResult);
    for (const gene of geneList_) {
      if (!geneToPathways.has(gene)) {
        geneToPathways.set(gene, []);
      }
      const pathways = geneToPathways.get(gene);
      if (pathways) {
        pathways.push(r.Pathway as string);
      }
    }
  }

  const nodes: ElementDefinition[] = [];
  for (const r of displayResults) {
    const geneList_ = getGeneList(r as GseaResult);
    nodes.push(
      createPathwayNode(r as Record<string, unknown>, geneList_, sizeBy)
    );
  }

  return {
    nodes,
    stats: {
      totalPathways: nodes.length,
      edges: 0,
      totalGenes: geneToPathways.size,
      significantCount: displayResults.filter((r) => (r.FDR as number) < 0.05).length,
    },
  };
}
