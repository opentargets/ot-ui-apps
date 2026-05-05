import { useEffect } from "react";
import type { Core as CytoscapeCore, ElementDefinition } from "cytoscape";
import {
  findNodesAndEdgesWithGene,
  findGeneCentricShortestPaths,
  updateElementHighlight,
  updateGeneCentricHighlight,
} from "../utils";

/**
 * Manages gene search highlighting and shortest path visualization
 */
export function useGeneSearch(
  cyRef: React.MutableRefObject<CytoscapeCore | null>,
  computedElements: ElementDefinition[],
  searchGene: string,
  useGeneCentricPaths: boolean
) {
  useEffect(() => {
    if (!cyRef.current || !computedElements) return;

    if (searchGene.trim().length > 0 && useGeneCentricPaths) {
      // Gene-centric shortest path mode
      const {
        sourcePathwayIds,
        nodeIds,
        edgeIds,
        geneEdgeIds,
      } = findGeneCentricShortestPaths(cyRef.current, searchGene);

      console.log(
        `[GENE_SEARCH] Gene-centric paths: ${sourcePathwayIds.size} source pathways, ` +
        `${nodeIds.size} connected nodes, ${edgeIds.size} connecting edges`
      );

      updateGeneCentricHighlight(
        cyRef.current,
        sourcePathwayIds,
        nodeIds,
        edgeIds,
        geneEdgeIds,
        true
      );
    } else {
      // Regular gene search mode
      const { nodeIds, edgeIds } = findNodesAndEdgesWithGene(computedElements, searchGene);
      const isSearchActive = searchGene.trim().length > 0;
      updateElementHighlight(cyRef.current, nodeIds, edgeIds, isSearchActive);
    }
  }, [searchGene, useGeneCentricPaths, computedElements, cyRef]);
}
