import { useEffect, useRef } from "react";
import type { Core as CytoscapeCore, ElementDefinition } from "cytoscape";
import {
  cleanupCytoscapeInstance,
  cleanupGeneExpressions,
  getLayoutConfig,
  initializeCytoscapeInstance,
  renderGeneExpressions,
} from "../utils";

/**
 * Manages Cytoscape instance lifecycle and cleanup
 */
export function useCytoscapeInstance(
  containerRef: React.MutableRefObject<HTMLDivElement | null>,
  computedElements: ElementDefinition[],
  results: Array<Record<string, unknown>>,
  genes: { symbol: string }[] | undefined,
  isLoading: boolean,
  onNodeClick: (data: Record<string, unknown>) => void,
  onEdgeClick: (data: Record<string, unknown>) => void
) {
  const cyRef = useRef<CytoscapeCore | null>(null);
  const tooltipsRef = useRef<Set<HTMLDivElement>>(new Set());

  useEffect(() => {
    if (!containerRef.current || results.length === 0 || computedElements.length === 0 || isLoading) {
      return;
    }

    // Destroy previous instance
    if (cyRef.current) {
      cleanupCytoscapeInstance(cyRef.current, tooltipsRef);
      if (containerRef.current) {
        cleanupGeneExpressions(containerRef.current, cyRef.current);
      }
    }

    const nodeCount = computedElements.filter((el) => !el.data?.source).length;
    const layoutConfig = getLayoutConfig("pathways", nodeCount);

    cyRef.current = initializeCytoscapeInstance(
      containerRef.current,
      computedElements,
      layoutConfig,
      "pathways",
      tooltipsRef,
      onNodeClick,
      onEdgeClick
    );

    // Render gene expression circles if genes available
    if (genes && genes.length > 0) {
      renderGeneExpressions(containerRef.current, cyRef.current);
    }

    return () => {
      if (containerRef.current && cyRef.current) {
        cleanupGeneExpressions(containerRef.current, cyRef.current);
      }
      cleanupCytoscapeInstance(cyRef.current, tooltipsRef);
    };
  }, [computedElements, results.length, genes, isLoading, onNodeClick, onEdgeClick]);

  return { cyRef, tooltipsRef };
}
