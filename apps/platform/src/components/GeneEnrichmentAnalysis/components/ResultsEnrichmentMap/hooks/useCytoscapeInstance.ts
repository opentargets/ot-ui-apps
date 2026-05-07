import { useEffect, useRef } from "react";
import type { Core as CytoscapeCore, ElementDefinition } from "cytoscape";
import {
  cleanupCytoscapeInstance,
  getLayoutConfig,
  initializeCytoscapeInstance,
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
  const prevElementsRef = useRef<string>("");
  const shortestPathRef = useRef<{ nodes: Set<string>; edges: Set<string> }>({ nodes: new Set(), edges: new Set() });

  useEffect(() => {
    if (!containerRef.current || results.length === 0 || computedElements.length === 0 || isLoading) {
      return;
    }

    // Create a stable string representation of element IDs and key properties for comparison
    const elementSignature = computedElements
      .map((el) => `${el.data?.id}:${el.data?.source || ""}:${JSON.stringify(el.data)}`)
      .sort()
      .join("|");

    const elementsChanged = prevElementsRef.current !== elementSignature;

    if (elementsChanged || !cyRef.current) {
      // Store shortest path styling before recreation
      if (cyRef.current) {
        shortestPathRef.current = {
          nodes: new Set(cyRef.current.elements(".shortestPath:node").map((el) => el.id())),
          edges: new Set(cyRef.current.elements(".shortestPath:edge").map((el) => el.id())),
        };
      }

      prevElementsRef.current = elementSignature;

      // Destroy previous instance
      if (cyRef.current) {
        cleanupCytoscapeInstance(cyRef.current, tooltipsRef);
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

      // Restore shortest path styling
      if (cyRef.current && (shortestPathRef.current.nodes.size > 0 || shortestPathRef.current.edges.size > 0)) {
        shortestPathRef.current.nodes.forEach((nodeId) => {
          const node = cyRef.current?.getElementById(nodeId);
          if (node && node.isNode()) {
            node.addClass("shortestPath");
          }
        });
        shortestPathRef.current.edges.forEach((edgeId) => {
          const edge = cyRef.current?.getElementById(edgeId);
          if (edge && edge.isEdge()) {
            edge.addClass("shortestPath");
          }
        });
      }

    }

    return () => {
      cleanupCytoscapeInstance(cyRef.current, tooltipsRef);
      cyRef.current = null;
    };
  }, [computedElements, results.length, genes, isLoading]);

  return { cyRef, tooltipsRef };
}
