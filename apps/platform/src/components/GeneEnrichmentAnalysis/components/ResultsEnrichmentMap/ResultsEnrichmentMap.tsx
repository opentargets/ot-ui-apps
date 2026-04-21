import { Box, CircularProgress, Paper, Typography } from "@mui/material";
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

  // Only set isMountedRef to false on actual component unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // UI state - responds immediately to user input for smooth interaction
  const [uiViewMode, setUiViewMode] = useState<"genes" | "pathways">("pathways");
  const [uiSimilarityThreshold, setUiSimilarityThreshold] = useState<number>(1);
  const [uiSizeBy, setUiSizeBy] = useState<"significance" | "pathwaySize" | "geneCount">(
    "significance"
  );

  // Debounced state - triggers expensive computations after delay
  const debouncedViewMode = useDebounce(uiViewMode, 300);
  const debouncedSimilarityThreshold = useDebounce(uiSimilarityThreshold, 300);
  const debouncedSizeBy = useDebounce(uiSizeBy, 300);

  const [computedElements, setComputedElements] = useState<ElementDefinition[]>([]);
  const [computedStats, setComputedStats] = useState<ComputedStats>({
    edges: 0,
    significantCount: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Show loader immediately when any debounced input changes
   */
  useEffect(() => {
    setIsLoading(true);
  }, [debouncedViewMode, debouncedSimilarityThreshold, debouncedSizeBy]);

  /**
   * Memoized computation for nodes based on view mode
   * Uses debounced sizeBy and viewMode to avoid recomputation on every slider/select change
   */
  const { nodes, initialStats } = useMemo(() => {
    const significantResults = results.filter((r) => (r.FDR as number) < 0.25);
    const displayResults =
      significantResults.length > 0 ? significantResults : results.slice(0, 50);

    const resultsAsRecords = displayResults as unknown as Array<Record<string, unknown>>;
    const allResultsAsRecords = results as unknown as Array<Record<string, unknown>>;

    if (debouncedViewMode === "genes") {
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
  }, [results, debouncedSizeBy, genes, debouncedViewMode]);

  // Initialize stats from node builder
  useEffect(() => {
    setComputedStats(initialStats);
  }, [initialStats]);

  /**
   * Element assembly based on view mode and node configuration
   * Triggers when debounced inputs change or nodes are recalculated (e.g., due to size changes)
   */
  useEffect(() => {
    if (debouncedViewMode === "genes") {
      // For gene view, wait for edges to compute before setting elements
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
          }
        },
        (err) => {
          console.error("[GENE_VIEW] Error computing edges:", err);
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
    }
  }, [results, debouncedSimilarityThreshold, debouncedViewMode, nodes]);

  /**
   * Hide loader when elements finish computing
   * Separated into its own effect to ensure loader has a chance to render
   */
  useEffect(() => {
    setIsLoading(false);
  }, [computedElements]);

  /**
   * Initialize Cytoscape instance
   */
  useEffect(() => {
    if (!containerRef.current || results.length === 0 || computedElements.length === 0) return;

    // Wait until loading is complete before initializing
    if (isLoading) return;

    // Destroy previous instance
    if (cyRef.current) {
      cleanupCytoscapeInstance(cyRef.current, tooltipsRef);
      if (containerRef.current) {
        cleanupGeneExpressions(containerRef.current, cyRef.current);
      }
    }

    const nodeCount = computedElements.filter((el) => !el.data?.source).length;
    const layoutConfig = getLayoutConfig(debouncedViewMode, nodeCount);

    cyRef.current = initializeCytoscapeInstance(
      containerRef.current,
      computedElements,
      layoutConfig,
      debouncedViewMode,
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
  }, [computedElements, results.length, genes, debouncedViewMode, isLoading]);

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
        <EnrichmentMapHeader stats={computedStats} viewMode={uiViewMode} />

        <EnrichmentMapControls
          viewMode={uiViewMode}
          sizeBy={uiSizeBy}
          similarityThreshold={uiSimilarityThreshold}
          onViewModeChange={setUiViewMode}
          onSizeByChange={setUiSizeBy}
          onSimilarityThresholdChange={setUiSimilarityThreshold}
        />
      </Box>

      <EnrichmentMapLegend viewMode={uiViewMode} />

      <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 1 }}>
        Tip: Hover over nodes to see pathway details. Related gene-sets cluster together to reveal
        enriched functional themes. Hover over edges to see shared genes. Drag to pan, scroll to
        zoom.
      </Typography>

      <Box sx={{ position: "relative" }}>
        <EnrichmentMapContainer ref={containerRef} />
        {isLoading && (
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: "rgba(255, 255, 255, 0.7)",
              borderRadius: 1,
              zIndex: 10,
            }}
          >
            <Box sx={{ textAlign: "center" }}>
              <CircularProgress size={40} sx={{ mb: 1 }} />
              <Typography variant="body2" color="text.secondary">
                Computing network...
              </Typography>
            </Box>
          </Box>
        )}
      </Box>
    </Paper>
  );
}
