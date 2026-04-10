import { Box, Paper, Typography } from "@mui/material";
import type { Core as CytoscapeCore, ElementDefinition } from "cytoscape";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  EnrichmentMapContainer,
  EnrichmentMapControls,
  EnrichmentMapHeader,
  EnrichmentMapLegend,
} from "./components";
import type { ComputedStats, ResultsEnrichmentMapProps } from "./utils";
import {
  buildGeneViewNodes,
  buildPathwayViewNodes,
  cleanupCytoscapeInstance,
  cleanupGeneExpressions,
  computeGeneViewEdges,
  computePathwayViewElements,
  getLayoutConfig,
  initializeCytoscapeInstance,
  renderGeneExpressions,
  useDebounce,
} from "./utils";

/**
 * Enrichment Map visualization for GSEA pathway results using Cytoscape.js
 *
 * Shows pathways as nodes connected by edges when they share genes.
 * Related pathways cluster together to reveal enriched functional themes.
 * Gene nodes (small circles) on pathway nodes show regulation status.
 *
 * - Node size: proportional to pathway size or -log10(FDR)
 * - Node color: significance level (green = highly significant, orange = significant, gray = not)
 * - Gene circles: blue = up-regulated, red = down-regulated
 * - Edge thickness: gene overlap (Jaccard similarity)
 * - Only edges above similarity threshold are shown
 */
export function ResultsEnrichmentMap({ results, genes }: ResultsEnrichmentMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cyRef = useRef<CytoscapeCore | null>(null);
  const tooltipsRef = useRef<Set<HTMLDivElement>>(new Set());
  const isMountedRef = useRef(true);
  const [viewMode, setViewMode] = useState<"genes" | "pathways">("pathways");

  // Only set isMountedRef to false on actual component unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // UI state - responds immediately to user input for smooth interaction
  const [uiSimilarityThreshold, setUiSimilarityThreshold] = useState<number>(1);
  const [uiSizeBy, setUiSizeBy] = useState<"significance" | "pathwaySize" | "geneCount">(
    "significance"
  );

  // Debounced state - triggers expensive computations after delay
  const debouncedSimilarityThreshold = useDebounce(uiSimilarityThreshold, 300);
  const debouncedSizeBy = useDebounce(uiSizeBy, 300);

  const [computedElements, setComputedElements] = useState<ElementDefinition[]>([]);
  const [computedStats, setComputedStats] = useState<ComputedStats>({
    edges: 0,
    significantCount: 0,
  });
  const [isComputingGeneEdges, setIsComputingGeneEdges] = useState(false);

  /**
   * Memoized computation for nodes based on view mode
   * Uses debounced sizeBy to avoid recomputation on every slider/select change
   */
  const { nodes, initialStats } = useMemo(() => {
    const significantResults = results.filter((r) => (r.FDR as number) < 0.25);
    const displayResults =
      significantResults.length > 0 ? significantResults : results.slice(0, 50);

    const resultsAsRecords = displayResults as unknown as Array<Record<string, unknown>>;
    const allResultsAsRecords = results as unknown as Array<Record<string, unknown>>;

    if (viewMode === "genes") {
      const result = buildGeneViewNodes(resultsAsRecords, debouncedSizeBy);
      return {
        nodes: result.nodes,
        initialStats: {
          ...result.stats,
          totalPathways: allResultsAsRecords.length,
        },
      };
    } else {
      const result = buildPathwayViewNodes(resultsAsRecords, debouncedSizeBy, genes);
      return {
        nodes: result.nodes,
        initialStats: {
          ...result.stats,
          totalPathways: allResultsAsRecords.length,
          displayedPathways: result.nodes.length,
          significantCount: allResultsAsRecords.filter((r) => (r.FDR as number) < 0.05).length,
        },
      };
    }
  }, [results, debouncedSizeBy, genes, viewMode]);

  // Initialize stats from node builder
  useEffect(() => {
    setComputedStats(initialStats);
  }, [initialStats]);

  /**
   * Element assembly based on view mode
   * Uses debounced similarity threshold to avoid expensive computations while dragging slider
   */
  // biome-ignore lint: nodes is derived from dependencies below (results, debouncedSizeBy, genes, viewMode)
  useEffect(() => {
    if (viewMode === "genes") {
      // For gene view, wait for edges to compute before setting elements
      setIsComputingGeneEdges(true);

      computeGeneViewEdges(
        results as unknown as Array<Record<string, unknown>>,
        nodes,
        debouncedSimilarityThreshold,
        isMountedRef,
        (elements, stats) => {
            console.log(elements, 'gene view elements computed with stats:', stats);
          if (isMountedRef.current) {
            setComputedElements(elements);
            setComputedStats(stats);
            setIsComputingGeneEdges(false);
          }
        },
        (err) => {
          console.error("[GENE_VIEW] Error computing edges:", err);
          setIsComputingGeneEdges(false);
        }
      );
    } else {
      const { elements, stats } = computePathwayViewElements(
        results as unknown as Array<Record<string, unknown>>,
        nodes,
        debouncedSimilarityThreshold
      );
      setComputedElements(elements);
      setComputedStats(stats);
      setIsComputingGeneEdges(false);
    }
  }, [results, debouncedSimilarityThreshold, viewMode]);

  /**
   * Initialize Cytoscape instance
   */
  useEffect(() => {
    if (!containerRef.current || results.length === 0 || computedElements.length === 0) return;

    // For gene view, wait until edges are done computing
    if (viewMode === "genes" && isComputingGeneEdges) return;

    // Destroy previous instance
    if (cyRef.current) {
      cleanupCytoscapeInstance(cyRef.current, tooltipsRef);
      if (containerRef.current) {
        cleanupGeneExpressions(containerRef.current, cyRef.current);
      }
    }

    const nodeCount = computedElements.filter((el) => !el.data?.source).length;
    const layoutConfig = getLayoutConfig(viewMode, nodeCount);

    cyRef.current = initializeCytoscapeInstance(
      containerRef.current,
      computedElements,
      layoutConfig,
      viewMode,
      tooltipsRef
    );

    // Render gene expression circles if genes data available
    if (genes && genes.length > 0) {
      renderGeneExpressions(containerRef.current, cyRef.current);
    }

    return () => {
      // Clean up Cytoscape instance when effect re-runs or dependencies change
      // Note: Do NOT set isMountedRef to false here - that only happens on true component unmount
      if (containerRef.current && cyRef.current) {
        cleanupGeneExpressions(containerRef.current, cyRef.current);
      }
      cleanupCytoscapeInstance(cyRef.current, tooltipsRef);
    };
  }, [computedElements, results.length, genes, viewMode, isComputingGeneEdges]);

  if (results.length === 0) {
    return (
      <Paper sx={{ p: 3, textAlign: "center" }}>
        <Typography color="text.secondary">No results to visualize</Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 2 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          mb: 2,
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <EnrichmentMapHeader stats={computedStats} viewMode={viewMode} />

        <EnrichmentMapControls
          viewMode={viewMode}
          sizeBy={uiSizeBy}
          similarityThreshold={uiSimilarityThreshold}
          onViewModeChange={setViewMode}
          onSizeByChange={setUiSizeBy}
          onSimilarityThresholdChange={setUiSimilarityThreshold}
        />
      </Box>

      <EnrichmentMapLegend />

      <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 1 }}>
        Tip: Hover over nodes to see pathway details. Related gene-sets cluster together to reveal
        enriched functional themes. Hover over edges to see shared genes. Drag to pan, scroll to
        zoom.
      </Typography>

      <EnrichmentMapContainer ref={containerRef} />
    </Paper>
  );
}
