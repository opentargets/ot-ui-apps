import { useEffect, useMemo, useState, startTransition } from "react";
import type { ElementDefinition } from "cytoscape";
import {
  buildPathwayViewNodes,
  computePathwayViewElements,
  filterNodesWithoutEdges,
  useDebounce,
} from "../utils";
import type { ComputedStats } from "../utils";
import { mapToPrioritizationColor } from "../../../utils/colorPalettes";
import { GseaResult } from "../../../api/gseaApi";
import { Gene } from "../../../types";

/**
 * Manages element computation including NES range, FDR filtering, node building, and element assembly
 */
export function useElementComputation(
  results: Array<GseaResult>,
  genes: { symbol: string }[] | undefined,
  similarityThreshold: number,
  sizeBy: "significance" | "pathwaySize" | "geneCount",
  fdrThreshold: number,
  pValueThreshold: number,
  nesRange: [number, number]
) {
  const [computedElements, setComputedElements] = useState<ElementDefinition[]>([]);
  const [computedStats, setComputedStats] = useState<ComputedStats>({
    edges: 0,
    significantCount: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  // Get initial NES range from full results data
  const nesDataRange = useMemo(() => {
    const nesValues = results.map((r) => r.NES as number).filter((nes) => typeof nes === "number");
    if (nesValues.length === 0) return { min: -3, max: 3 };
    return {
      min: Math.min(...nesValues),
      max: Math.max(...nesValues),
    };
  }, [results]);

  // Debounced state
  const debouncedSimilarityThreshold = useDebounce(similarityThreshold, 300);
  const debouncedSizeBy = useDebounce(sizeBy, 300);
  const debouncedFdrThreshold = useDebounce(fdrThreshold, 300);
  const debouncedPValueThreshold = useDebounce(pValueThreshold, 300);
  const debouncedNesRange = useDebounce(nesRange, 300);

  // Show loader when inputs change
  useEffect(() => {
    setIsLoading(true);
  }, [debouncedSimilarityThreshold, debouncedSizeBy, debouncedFdrThreshold, debouncedPValueThreshold, debouncedNesRange]);

  // FDR, p-value, and NES filtered results
  const fdrFilteredResults = useMemo(() => {
    return results.filter((r) => {
      const fdr = r.FDR as number;
      const pValue = r["p-value"] as number;
      const nes = r.NES as number;
      const fdrPass = fdr < debouncedFdrThreshold;
      const pValuePass = pValue < debouncedPValueThreshold;
      const nesPass = nes >= debouncedNesRange[0] && nes <= debouncedNesRange[1];
      return fdrPass || pValuePass || nesPass;
    });
  }, [results, debouncedFdrThreshold, debouncedPValueThreshold, debouncedNesRange]);

  // Memoized NES range for color scaling
  const displayNesRange = useMemo(() => {
    const nesValues = fdrFilteredResults
      .map((r) => r.NES as number)
      .filter((nes) => typeof nes === "number");
    if (nesValues.length === 0) return { min: 0, max: 0 };
    return {
      min: Math.min(...nesValues),
      max: Math.max(...nesValues),
    };
  }, [fdrFilteredResults]);

  // Compute pathway nodes (uncolored)
  const { nodes: uncoloredNodes } = useMemo(() => {
    const significantResults = fdrFilteredResults.filter((r) => (r.FDR as number) < 0.25);
    const displayResults = significantResults.length > 0 ? significantResults : fdrFilteredResults.slice(0, 50);

    const result = buildPathwayViewNodes(displayResults, debouncedSizeBy, genes as Array<Gene>);
    const stats = {
      ...result.stats,
      totalPathways: results.length,
      displayedPathways: result.nodes.length,
      significantCount: results.filter((r) => (r.FDR as number) < 0.05).length,
    };

    return { nodes: result.nodes, initialStats: stats };
  }, [fdrFilteredResults, debouncedSizeBy, genes, results]);

  // Apply NES-based coloring separately (doesn't affect edge computation)
  const nodes = useMemo(() => {
    return uncoloredNodes.map((node) => {
      if (node.data?.source) return node; // Skip edges

      const correspondingResult = fdrFilteredResults.find((r) => (r.ID as string) === node.data?.id);

      if (correspondingResult && typeof correspondingResult.NES === "number") {
        const nesColor = mapToPrioritizationColor(
          correspondingResult.NES as number,
          displayNesRange.min,
          displayNesRange.max
        );
        return {
          ...node,
          data: { ...node.data, color: nesColor },
        };
      }

      return node;
    });
  }, [uncoloredNodes, fdrFilteredResults, displayNesRange]);

  // Assemble elements
  useEffect(() => {

    const computeElements = async () => {
      // Yield to browser to allow loader to render before computation starts
      await new Promise(resolve => setTimeout(resolve, 0));
      
      const { elements, stats } = await computePathwayViewElements(fdrFilteredResults, uncoloredNodes, debouncedSimilarityThreshold);
      
      // Filter nodes without edges and get dropped count
      const { elements: filteredElements, droppedNodesCount } = filterNodesWithoutEdges(elements);
      
      // Apply NES coloring to filtered nodes
      const coloredElements = filteredElements.map((el) => {
        if (el.data?.source) return el; // Skip edges
        
        const correspondingResult = fdrFilteredResults.find((r) => (r.ID as string) === el.data?.id);
        if (correspondingResult && typeof correspondingResult.NES === "number") {
          const nesColor = mapToPrioritizationColor(
            correspondingResult.NES as number,
            displayNesRange.min,
            displayNesRange.max
          );
          return {
            ...el,
            data: { ...el.data, color: nesColor },
          };
        }
        return el;
      });
      
      // Wrap state updates in startTransition to avoid blocking render
      startTransition(() => {
        setComputedElements(coloredElements);
        
        // Recompute stats based on filtered results to match what's rendered
        const filteredEdges = coloredElements.filter((el) => el.data?.source);
        const filteredNodes = coloredElements.filter((el) => !el.data?.source);
        
        // Count significant nodes only among those displayed
        const displayedNodeIds = new Set(
          filteredNodes
            .map((node) => node.data?.id)
            .filter((id): id is string => Boolean(id))
        );
        
        const significantDisplayed = fdrFilteredResults.filter((r) => {
          const fdr = r.FDR as number | undefined;
          const nodeId = (r.ID as string) || (r.Pathway as string);
          return fdr !== undefined && fdr < 0.2 && displayedNodeIds.has(nodeId);
        }).length;
        
        setComputedStats({
          ...stats,
          totalPathways: fdrFilteredResults.length,
          displayedPathways: filteredNodes.length,
          edges: filteredEdges.length,
          significantCount: significantDisplayed,
          droppedNodes: droppedNodesCount,
        });
        
        setIsLoading(false);
      });
    };

    // Wrap in requestAnimationFrame to show loader immediately before computation
    const frameId = requestAnimationFrame(() => {
      computeElements();
    });

    return () => cancelAnimationFrame(frameId);
  }, [fdrFilteredResults, debouncedSimilarityThreshold, uncoloredNodes, displayNesRange]);

  return {
    computedElements,
    computedStats,
    nesDataRange,
    nesRange: displayNesRange,
    isLoading,
  };
}
