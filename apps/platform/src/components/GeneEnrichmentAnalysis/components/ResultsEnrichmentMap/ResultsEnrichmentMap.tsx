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
  buildPathwayViewNodes,
  cleanupCytoscapeInstance,
  computePathwayViewElements,
  getLayoutConfig,
  initializeCytoscapeInstance,
} from "./utils";

/**
 * Enrichment Map visualization for GSEA pathway results using Cytoscape.js
 *
 * Shows pathways as nodes connected by edges when they share genes.
 * Related pathways cluster together to reveal enriched functional themes.
 *
 * - Node size: proportional to pathway size or -log10(FDR)
 * - Node color: significance level (green = highly significant, orange = significant, gray = not)
 * - Edge thickness: gene overlap (Jaccard similarity)
 * - Only edges above similarity threshold are shown
 */
export function ResultsEnrichmentMap({ results }: ResultsEnrichmentMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cyRef = useRef<CytoscapeCore | null>(null);
  const tooltipsRef = useRef<Set<HTMLDivElement>>(new Set());
  const isMountedRef = useRef(true);
  const [viewMode] = useState<"genes" | "pathways">("pathways");
  const [similarityThreshold, setSimilarityThreshold] = useState<number>(1);
  const [sizeBy, setSizeBy] = useState<"significance" | "pathwaySize" | "geneCount">(
    "significance"
  );
  const [computedElements, setComputedElements] = useState<ElementDefinition[]>([]);
  const [computedStats, setComputedStats] = useState<ComputedStats>({
    edges: 0,
    significantCount: 0,
  });

  /**
   * Memoized computation for pathway view nodes and stats
   */
  const { nodes } = useMemo(() => {
    const significantResults = results.filter((r) => (r.FDR as number) < 0.25);
    const displayResults =
      significantResults.length > 0 ? significantResults : results.slice(0, 50);

    const resultsAsRecords = displayResults as unknown as Array<Record<string, unknown>>;
    return buildPathwayViewNodes(resultsAsRecords, sizeBy);
  }, [results, sizeBy]);

  /**
   * Synchronous element assembly for pathway view
   */
  useEffect(() => {
    if (viewMode !== "pathways") return;

    const { elements, stats } = computePathwayViewElements(
      results as unknown as Array<Record<string, unknown>>,
      nodes,
      similarityThreshold
    );
    setComputedElements(elements);
    setComputedStats(stats);
  }, [results, similarityThreshold, viewMode, nodes]);

  /**
   * Initialize Cytoscape instance
   */
  useEffect(() => {
    if (!containerRef.current || results.length === 0) return;

    // Destroy previous instance
    if (cyRef.current) {
      cleanupCytoscapeInstance(cyRef.current, tooltipsRef);
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

    return () => {
      isMountedRef.current = false;
      console.log("[CLEANUP] Component unmounting - marked isMountedRef.current = false");
      cleanupCytoscapeInstance(cyRef.current, tooltipsRef);
    };
  }, [computedElements, results.length]);

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
        <EnrichmentMapHeader
          stats={computedStats}
        />

        <EnrichmentMapControls
          sizeBy={sizeBy}
          similarityThreshold={similarityThreshold}
          onSizeByChange={setSizeBy}
          onSimilarityThresholdChange={setSimilarityThreshold}
        />
      </Box>

      <EnrichmentMapLegend />

      <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 1 }}>
        Tip: Hover over nodes to see pathway details. Related gene-sets cluster together to reveal enriched functional themes. Hover over edges to see shared genes. Drag to pan, scroll to zoom.
      </Typography>

      <EnrichmentMapContainer ref={containerRef} />
    </Paper>
  );
}
