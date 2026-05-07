import { Box, CircularProgress, Paper, Typography } from "@mui/material";
import { useContext, useRef, useMemo } from "react";
import {
  EnrichmentMapContainer,
  EnrichmentMapControls,
  EnrichmentMapDetailsModal,
  EnrichmentMapHeader,
  EnrichmentMapLegend,
  PathwaySelectionModal,
} from "./components";
import type { ResultsEnrichmentMapProps } from "./utils";
import {
  EnrichmentMapControlsContext,
} from "./utils/EnrichmentMapControlsContext";
import {
  useEnrichmentMapState,
  useElementComputation,
  useGeneSearch,
  useShortestPathComputation,
  useCytoscapeInstance,
} from "./hooks";
import { ElementDefinition } from "cytoscape";

/**
 * Enrichment Map visualization for GSEA pathway results using Cytoscape.js
 *
 * Shows pathways as nodes connected by edges when they share genes.
 * Related pathways cluster together to reveal enriched functional themes.
 */
export function ResultsEnrichmentMap({ results, genes, diseaseId }: ResultsEnrichmentMapProps) {
  return <ResultsEnrichmentMapContent results={results} genes={genes} diseaseId={diseaseId} />;
}

/**
 * Inner component using the enrichment map controls context
 */
function ResultsEnrichmentMapContent({ results, genes, diseaseId }: ResultsEnrichmentMapProps) {
  const controlsContext = useContext(EnrichmentMapControlsContext);
  if (!controlsContext) {
    throw new Error("ResultsEnrichmentMapContent must be used within EnrichmentMapControlsProvider");
  }
  const { state: controls } = controlsContext;

  // Detect if this is GO data
  const isGoData = useMemo(() => {
    return (results).some((r) => /^GO:\d+$/.test((r.ID as string) || ""));
  }, [results]);

  const containerRef = useRef<HTMLDivElement>(null);

  // State management
  const {
    modalOpen,
    setModalOpen,
    modalType,
    setModalType,
    modalData,
    setModalData,
    pathwaySelectionOpen,
    setPathwaySelectionOpen,
    selectedPathways,
    setSelectedPathways,
    foundShortestPath,
    setFoundShortestPath,
    isComputingPath,
    setIsComputingPath,
  } = useEnrichmentMapState();

  // Element computation
  const { computedElements, computedStats, nesRange, isLoading } = useElementComputation(
    results as Array<ElementDefinition>,
    genes,
    controls.similarityThreshold,
    controls.sizeBy,
    controls.fdrThreshold,
    controls.nesRange
  );

  // Cytoscape instance
  const { cyRef } = useCytoscapeInstance(
    containerRef,
    computedElements,
    results as Array<ElementDefinition>,
    genes,
    isLoading,
    (data) => {
      setModalType("node");
      setModalData(data);
      setModalOpen(true);
    },
    (data) => {
      setModalType("edge");
      setModalData(data);
      setModalOpen(true);
    }
  );

  // Gene search highlighting
  useGeneSearch(cyRef, computedElements, controls.searchGene, controls.useGeneCentricPaths);

  // Shortest path computation
  useShortestPathComputation(
    cyRef,
    selectedPathways,
    setFoundShortestPath,
    setIsComputingPath
  );

  // Available pathways for autocomplete
  const availablePathways = useMemo(() => {
    return computedElements
      .filter((el) => !el.data?.source)
      .map((el) => (el.data?.displayLabel as string) || (el.data?.id as string))
      .filter((name) => name && name.length > 0)
      .sort();
  }, [computedElements]);

  // Helper to convert pathway label to node ID
  const getNodeIdFromLabel = (label: string): string | null => {
    const node = computedElements.find(
      (el) =>
        !el.data?.source &&
        ((el.data?.displayLabel as string) === label || (el.data?.id as string) === label)
    );
    return node?.data?.id as string | null;
  };

  if (results.length === 0) {
    return (
      <Paper sx={{ p: 3, textAlign: "center" }}>
        <Typography color="text.secondary">No results to visualize</Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 2 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2, flexWrap: "wrap", gap: 2 }}>
        <EnrichmentMapHeader stats={computedStats} />
      </Box>

      <EnrichmentMapLegend nesRange={nesRange} />

      <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 1 }}>
        Tip: Click to select nodes, Ctrl+Click (Cmd+Click on Mac) for multi-select, click background to
        deselect. Hover over nodes to see pathway details. Related gene-sets cluster together to reveal
        enriched functional themes. Hover over edges to see shared genes. Drag to pan, scroll to zoom.
      </Typography>

      <Box sx={{ position: "relative" }}>
        <EnrichmentMapControls onOpenPathwaySelection={() => setPathwaySelectionOpen(true)} isGoData={isGoData} />
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

      <EnrichmentMapDetailsModal
        open={modalOpen}
        type={modalType}
        data={modalData}
        onClose={() => setModalOpen(false)}
        diseaseId={diseaseId}
      />

      <PathwaySelectionModal
        open={pathwaySelectionOpen}
        onClose={() => {
          setPathwaySelectionOpen(false);
          setSelectedPathways({ source: null, target: null });
          setFoundShortestPath(null);
        }}
        onPathwaysSelected={(source, target) => {
          const sourceId = getNodeIdFromLabel(source);
          const targetId = getNodeIdFromLabel(target);
          if (sourceId && targetId) {
            setSelectedPathways({ source: sourceId, target: targetId });
          }
        }}
        selectedPathways={selectedPathways}
        foundPath={foundShortestPath}
        isLoading={isComputingPath}
        availablePathways={availablePathways}
      />
    </Paper>
  );
}
