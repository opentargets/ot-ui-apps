import { useEffect, useMemo, useState } from "react";
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
  const debouncedNesRange = useDebounce(nesRange, 300);

  // Show loader when inputs change
  useEffect(() => {
    setIsLoading(true);
  }, [debouncedSimilarityThreshold, debouncedSizeBy, debouncedFdrThreshold, debouncedNesRange]);

  // FDR and NES filtered results
  const fdrFilteredResults = useMemo(() => {
    return results.filter((r) => {
      const fdr = r.FDR as number;
      const nes = r.NES as number;
      const fdrPass = fdr < debouncedFdrThreshold;
      const nesPass = nes >= debouncedNesRange[0] && nes <= debouncedNesRange[1];
      return fdrPass || nesPass;
    });
  }, [results, debouncedFdrThreshold, debouncedNesRange]);

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

  // Compute pathway nodes
  const { nodes } = useMemo(() => {
    const significantResults = fdrFilteredResults.filter((r) => (r.FDR as number) < 0.25);
    const displayResults = significantResults.length > 0 ? significantResults : fdrFilteredResults.slice(0, 50);

    const result = buildPathwayViewNodes(displayResults, debouncedSizeBy, genes as Array<Gene>);
    let builtNodes = result.nodes;
    const stats = {
      ...result.stats,
      totalPathways: results.length,
      displayedPathways: result.nodes.length,
      significantCount: results.filter((r) => (r.FDR as number) < 0.05).length,
    };

    // Apply NES-based coloring
    builtNodes = builtNodes.map((node) => {
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

    return { nodes: builtNodes, initialStats: stats };
  }, [fdrFilteredResults, debouncedSizeBy, genes, displayNesRange, results]);

  // Assemble elements
  useEffect(() => {

    const computeElements = async () => {
      const { elements, stats } = await computePathwayViewElements(fdrFilteredResults, nodes, debouncedSimilarityThreshold);
      setComputedElements(filterNodesWithoutEdges(elements));
      setComputedStats(stats);
    };

    computeElements();
  }, [fdrFilteredResults, debouncedSimilarityThreshold, nodes]);

  // Hide loader when done
  useEffect(() => {
    setIsLoading(false);
  }, [computedElements]);

  return {
    computedElements,
    computedStats,
    nesDataRange,
    nesRange: displayNesRange,
    isLoading,
  };
}
