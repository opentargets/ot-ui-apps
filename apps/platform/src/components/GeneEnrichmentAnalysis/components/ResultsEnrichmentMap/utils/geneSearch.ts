import type { ElementDefinition } from "cytoscape";
import type { Core } from "cytoscape";
import {
  computeGeneSubgraph,
  filterEdgesByGene,
  findPathwaysWithGeneInLeadingEdge,
} from "./shortestPath";

/**
 * Find all nodes and edges that contain the searched gene
 */
export function findNodesAndEdgesWithGene(
  elements: ElementDefinition[],
  geneSymbol: string
): { nodeIds: Set<string>; edgeIds: Set<string> } {
  const nodeIds = new Set<string>();
  const edgeIds = new Set<string>();

  if (!geneSymbol || geneSymbol.trim().length === 0) {
    return { nodeIds, edgeIds };
  }

  const searchTerm = geneSymbol.toUpperCase();

  for (const element of elements) {
    if (element.data?.source) {
      // This is an edge
      const sharedGenes = (element.data?.sharedGenes as string[]) || [];
      if (sharedGenes.some((gene) => gene.toUpperCase().includes(searchTerm))) {
        edgeIds.add(element.data.id as string);
        // Highlight both connected nodes
        nodeIds.add(element.data.source as string);
        nodeIds.add(element.data.target as string);
      }
    }
  }

  console.log(`[GENE_SEARCH] Found ${nodeIds.size} nodes and ${edgeIds.size} edges for gene: ${searchTerm}`);
  return { nodeIds, edgeIds };
}

/**
 * Update element classes to show/hide based on search
 */
export function updateElementHighlight(
  cy: any,
  nodeIds: Set<string>,
  edgeIds: Set<string>,
  isSearchActive: boolean
): void {
  if (!cy) return;

  if (!isSearchActive || (nodeIds.size === 0 && edgeIds.size === 0)) {
    // Clear all highlights
    cy.elements().removeClass("highlighted dimmed shortestPath geneSource");
  } else {
    // Add dimmed class to all elements
    cy.elements().addClass("dimmed");

    // Remove dimmed class from highlighted elements
    for (const nodeId of nodeIds) {
      cy.getElementById(nodeId).removeClass("dimmed").addClass("highlighted");
    }
    for (const edgeId of edgeIds) {
      cy.getElementById(edgeId).removeClass("dimmed").addClass("highlighted");
    }
  }
}

/**
 * Enhanced gene search with shortest path computation
 * Finds all pathways containing a gene and highlights the shortest paths connecting them
 * 
 * @param cy - Cytoscape instance
 * @param geneSymbol - Gene to search for
 * @returns Object with node/edge IDs to highlight and connectivity information
 */
export function findGeneCentricShortestPaths(
  cy: Core,
  geneSymbol: string
): {
  sourcePathwayIds: Set<string>;
  nodeIds: Set<string>;
  edgeIds: Set<string>;
  geneEdgeIds: Set<string>;
  pathConnectivity: Map<string, number>;
} {
  const sourcePathwayIds = findPathwaysWithGeneInLeadingEdge(cy, geneSymbol);
  const { connectedNodeIds, connectedEdgeIds } = computeGeneSubgraph(cy, sourcePathwayIds, geneSymbol);

  // Find edges that directly carry this gene
  const geneEdgeIds = filterEdgesByGene(cy, geneSymbol);

  // Count how many source pathways each intermediate pathway connects to
  const pathConnectivity = new Map<string, number>();
  connectedNodeIds.forEach((nodeId) => {
    if (!sourcePathwayIds.has(nodeId)) {
      const node = cy.getElementById(nodeId);
      const connectedToSources = node
        .neighborhood()
        .nodes()
        .filter((neighbor: any) => sourcePathwayIds.has(neighbor.id())).length;
      pathConnectivity.set(nodeId, connectedToSources);
    }
  });

  console.log(
    `[GENE_SEARCH_PATHS] Found ${sourcePathwayIds.size} source pathways for gene: ${geneSymbol}`
  );
  console.log(
    `[GENE_SEARCH_PATHS] ${connectedNodeIds.size} total pathways in subgraph, ${connectedEdgeIds.size} connecting edges`
  );

  return {
    sourcePathwayIds,
    nodeIds: connectedNodeIds,
    edgeIds: connectedEdgeIds,
    geneEdgeIds,
    pathConnectivity,
  };
}

/**
 * Update element highlighting with gene-centric shortest path visualization
 * 
 * @param cy - Cytoscape instance
 * @param sourcePathwayIds - Pathways containing the search gene
 * @param connectedNodeIds - All pathways in the shortest path network
 * @param connectedEdgeIds - All edges in the shortest path network
 * @param geneEdgeIds - Edges that directly contain the gene
 * @param isSearchActive - Whether search is currently active
 */
export function updateGeneCentricHighlight(
  cy: Core,
  sourcePathwayIds: Set<string>,
  connectedNodeIds: Set<string>,
  connectedEdgeIds: Set<string>,
  geneEdgeIds: Set<string>,
  isSearchActive: boolean
): void {
  if (!cy) return;

  if (!isSearchActive) {
    // Clear all highlights
    cy.elements().removeClass("highlighted dimmed shortestPath geneSource");
  } else {
    // Dim everything initially
    cy.elements().addClass("dimmed");

    // Mark source pathways (containing the gene)
    for (const pathwayId of sourcePathwayIds) {
      cy.getElementById(pathwayId).removeClass("dimmed").addClass("geneSource");
    }

    // Mark connected pathways and edges in shortest path
    for (const nodeId of connectedNodeIds) {
      if (!sourcePathwayIds.has(nodeId)) {
        cy.getElementById(nodeId).removeClass("dimmed").addClass("shortestPath");
      }
    }

    for (const edgeId of connectedEdgeIds) {
      cy.getElementById(edgeId).removeClass("dimmed").addClass("shortestPath");
    }

    // Highlight edges that directly carry the gene
    for (const edgeId of geneEdgeIds) {
      const edge = cy.getElementById(edgeId);
      if (connectedEdgeIds.has(edgeId)) {
        edge.addClass("highlighted"); // Extra emphasis if in shortest path network
      }
    }
  }
}
