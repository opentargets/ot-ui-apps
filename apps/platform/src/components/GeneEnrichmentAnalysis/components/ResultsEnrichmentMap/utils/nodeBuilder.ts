import type { ElementDefinition } from "cytoscape";
import type { GseaResult } from "../../../api/gseaApi";
import type { Gene } from "../../../types";
import { getGeneList } from "./index";

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
 * Regulation status of a gene based on leading edge pathway information
 */
export interface GeneRegulationStatus {
  gene: string;
  isLeadingEdge: boolean;
  upRegulatedCount: number;
  downRegulatedCount: number;
  pathwaysWithNES: Array<{ pathway: string; nes: number; fdr: number }>;
}

/**
 * Determines significance color based on FDR value
 */
export function getSignificanceColor(fdr: number): string {
  if (fdr < 0.01) return "#4caf50";
  if (fdr < 0.05) return "#8bc34a";
  if (fdr < 0.1) return "#ff9800";
  if (fdr < 0.25) return "#ffcc80";
  return "#e0e0e0";
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
 * Determines regulation color based on gene's leading edge status and NES values
 * - Red (#e91e63): Gene is leading edge in upregulated pathways (positive NES)
 * - Blue (#2196f3): Gene is leading edge in downregulated pathways (negative NES)
 * - Purple (#9c27b0): Gene is leading edge in pathways with conflicting NES signs
 * - Grey (#bdbdbd): Gene is not a leading edge gene in any pathway
 */
export function getRegulationColor(regulationStatus: GeneRegulationStatus): string {
  // If not a leading edge gene in any pathway, return grey
  if (!regulationStatus.isLeadingEdge || regulationStatus.pathwaysWithNES.length === 0) {
    return "#bdbdbd"; // Grey for non-leading-edge genes
  }

  const upCount = regulationStatus.upRegulatedCount;
  const downCount = regulationStatus.downRegulatedCount;

  // If only upregulated pathways
  if (upCount > 0 && downCount === 0) {
    return "#e91e63"; // Red for upregulated
  }

  // If only downregulated pathways
  if (downCount > 0 && upCount === 0) {
    return "#2196f3"; // Blue for downregulated
  }

  // If both upregulated and downregulated pathways
  if (upCount > 0 && downCount > 0) {
    return "#9c27b0"; // Purple for conflicting regulation
  }

  return "#bdbdbd"; // Default grey
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
 * Computes gene regulation status from leading edge pathway information
 * Groups genes by their regulation direction based on NES values in the pathways they lead
 */
export function computeGeneRegulationStatus(
  results: Array<Record<string, unknown>> | GseaResult[]
): Map<string, GeneRegulationStatus> {
  const geneRegulationMap = new Map<string, GeneRegulationStatus>();

  for (const result of results) {
    const geneList_ = getGeneList(result as GseaResult);
    const nes = result.NES as number;
    const pathway = result.Pathway as string;
    const fdr = result.FDR as number;

    for (const gene of geneList_) {
      const existingStatus = geneRegulationMap.get(gene);
      if (!existingStatus) {
        geneRegulationMap.set(gene, {
          gene,
          isLeadingEdge: true,
          upRegulatedCount: 0,
          downRegulatedCount: 0,
          pathwaysWithNES: [],
        });
      }

      const status = geneRegulationMap.get(gene);
      if (status) {
        status.pathwaysWithNES.push({ pathway, nes, fdr });

        // Count upregulated (positive NES) vs downregulated (negative NES) pathways
        if (nes > 0) {
          status.upRegulatedCount += 1;
        } else if (nes < 0) {
          status.downRegulatedCount += 1;
        }
      }
    }
  }

  return geneRegulationMap;
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
 * Creates a gene node element for Cytoscape
 */
export function createGeneNode(
  gene: string,
  pathways: Array<{ pathway: string; fdr: number; nes: number }>,
  sizeBy: "significance" | "pathwaySize" | "geneCount",
  regulationStatus?: GeneRegulationStatus
): ElementDefinition {
  const bestFDR = Math.min(...pathways.map((p) => p.fdr));

  // Use regulation-based coloring if available, otherwise fall back to significance-based
  const color = regulationStatus
    ? getRegulationColor(regulationStatus)
    : getSignificanceColor(bestFDR);
  const nodeSize = calculateNodeSize(sizeBy, bestFDR, pathways.length);

  return {
    data: {
      id: gene,
      label: gene,
      gene: gene,
      pathwayCount: pathways.length,
      bestFDR: bestFDR,
      pathways: pathways.map((p) => p.pathway),
      color: color,
      borderColor: getBorderColor(color),
      size: nodeSize,
      displayLabel: gene.length > 15 ? `${gene.substring(0, 12)}...` : gene,
      // Store regulation information for tooltips and styling
      isLeadingEdge: regulationStatus?.isLeadingEdge ?? false,
      upRegulatedCount: regulationStatus?.upRegulatedCount ?? 0,
      downRegulatedCount: regulationStatus?.downRegulatedCount ?? 0,
      regulationStatus: regulationStatus
        ? regulationStatus.upRegulatedCount > 0 && regulationStatus.downRegulatedCount === 0
          ? "upregulated"
          : regulationStatus.downRegulatedCount > 0 && regulationStatus.upRegulatedCount === 0
            ? "downregulated"
            : regulationStatus.upRegulatedCount > 0 && regulationStatus.downRegulatedCount > 0
              ? "conflicting"
              : "non-leading-edge"
        : "unknown",
    },
  };
}

/**
 * Builds gene view nodes
 */
export function buildGeneViewNodes(
  displayResults: Array<Record<string, unknown>> | GseaResult[],
  sizeBy: "significance" | "pathwaySize" | "geneCount"
): {
  nodes: ElementDefinition[];
  stats: { totalGenes: number; edges: number; totalPathways: number; significantCount: number };
} {
  const geneToPathways = buildGeneToPathwaysMap(displayResults);
  const geneRegulationMap = computeGeneRegulationStatus(displayResults);

  const sortedGenes = filterAndSortGenes(geneToPathways);

  const nodes: ElementDefinition[] = [];
  for (const gene of sortedGenes) {
    const pathways = geneToPathways.get(gene);
    const regulationStatus = geneRegulationMap.get(gene);
    if (pathways) {
      nodes.push(createGeneNode(gene, pathways, sizeBy, regulationStatus));
    }
  }

  console.log("[buildGeneViewNodes] Built gene nodes:", nodes);

  const result = {
    nodes,
    stats: {
      totalGenes: nodes.length,
      edges: 0,
      totalPathways: displayResults.length,
      significantCount: displayResults.filter((r) => (r.FDR as number) < 0.05).length,
    },
  };
  console.log("[buildGeneViewNodes] Computed stats:", result.stats);

  return result;
}

/**
 * Creates a pathway node element for Cytoscape
 */
export function createPathwayNode(
  result: Record<string, unknown>,
  geneList: string[],
  sizeBy: "significance" | "pathwaySize" | "geneCount",
  geneExpressionMap?: Map<string, Gene>
): ElementDefinition {
  const fdr = result.FDR as number;
  const color = getSignificanceColor(fdr);
  const nodeSize = calculateNodeSize(
    sizeBy,
    sizeBy === "pathwaySize" ? (result["Pathway size"] as number) : fdr,
    geneList.length
  );

  // Extract gene expression data from input genes
  const geneExpression: Array<{ gene: string; status: "up" | "down"; score: number }> = [];
  if (geneExpressionMap) {
    for (const gene of geneList) {
      const geneData = geneExpressionMap.get(gene);
      if (geneData) {
        geneExpression.push({
          gene: gene,
          status: geneData.globalScore >= 0 ? "up" : "down",
          score: Math.abs(geneData.globalScore),
        });
      }
    }
    // Sort by score and take top 10
    geneExpression.sort((a, b) => b.score - a.score).splice(10);
  }

  const nodeId = (result.ID as string) || (result.Pathway as string);
  const nodePathway = result.Pathway as string;

  return {
    data: {
      id: nodeId,
      label: nodePathway,
      pathway: nodePathway,
      nes: result.NES,
      es: result.ES,
      fdr: fdr,
      pValue: result["p-value"],
      pathwaySize: result["Pathway size"],
      inputGenes: result["Number of input genes"],
      geneCount: geneList.length,
      geneExpression: geneExpression,
      color: color,
      borderColor: getBorderColor(color),
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

  // Build gene expression map for fast lookup
  const geneExpressionMap = new Map<string, Gene>();
  if (genes) {
    for (const gene of genes) {
      geneExpressionMap.set(gene.symbol, gene);
    }
  }

  const nodes: ElementDefinition[] = [];
  for (const r of displayResults) {
    const geneList_ = getGeneList(r as GseaResult);
    nodes.push(
      createPathwayNode(r as Record<string, unknown>, geneList_, sizeBy, geneExpressionMap)
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
