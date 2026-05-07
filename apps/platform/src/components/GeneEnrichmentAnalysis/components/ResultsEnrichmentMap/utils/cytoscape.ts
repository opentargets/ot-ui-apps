import type { Core, ElementDefinition, LayoutOptions } from "cytoscape";
import cytoscape from "cytoscape";
import { createStylesheet } from "./stylesheet";
import {
  createEdgeTooltipHTML,
  createNodeTooltipHTML,
  removeTooltip,
  styleAndAppendTooltip,
} from "./tooltips";

/**
 * Initializes Cytoscape instance with event handlers
 */
export function initializeCytoscapeInstance(
  container: HTMLDivElement,
  elements: ElementDefinition[],
  layoutConfig: Record<string, unknown>,
  viewMode: "genes" | "pathways",
  tooltipsRef: React.MutableRefObject<Set<HTMLDivElement>>,
  onNodeClick?: (data: Record<string, unknown>) => void,
  onEdgeClick?: (data: Record<string, unknown>) => void
): Core {
  const stylesheet = createStylesheet();
  const cy = cytoscape({
    container,
    elements,
    style: stylesheet,
    layout: layoutConfig as unknown as LayoutOptions,
    wheelSensitivity: 0.1,
    // Enable selection functionality
    selectionType: "single",
    // userSelectableElements: true,
    autoungrabify: false,
  });

  // Node hover handler
  cy.on("mouseover", "node", (evt) => {
    const node = evt.target;
    const data = node.data();
    const tooltip = document.createElement("div");
    tooltip.className = "cytoscape-tooltip";
    tooltipsRef.current.add(tooltip);

    const tooltipHTML = createNodeTooltipHTML(viewMode, data);
    tooltip.innerHTML = tooltipHTML;
    styleAndAppendTooltip(tooltip);

    const updatePosition = () => {
      try {
        const pos = node.renderedPosition();
        tooltip.style.left = `${pos.x + 2}px`;
        tooltip.style.top = `${pos.y - 2}px`;
      } catch (err) {
        console.warn("[NODE_HOVER] Failed to update position:", err);
      }
    };
    updatePosition();

    const moveListener = () => updatePosition();
    try {
      cy.on("pan zoom", moveListener);
    } catch (err) {
      console.error("[NODE_HOVER] Failed to attach pan zoom listener:", err);
    }

    node.on("mouseout", () => {
      try {
        cy.off("pan zoom", moveListener);
      } catch (err) {
        console.warn("[NODE_MOUSEOUT] Failed to detach pan zoom listener:", err);
      }

      removeTooltip(tooltip, tooltipsRef, "NODE_MOUSEOUT");
    });
  });

  // Edge hover handler
  cy.on("mouseover", "edge", (evt) => {
    const edge = evt.target;
    const data = edge.data();
    const tooltip = document.createElement("div");
    tooltip.className = "cytoscape-tooltip";
    tooltipsRef.current.add(tooltip);

    const tooltipHTML = createEdgeTooltipHTML(viewMode, data);
    tooltip.innerHTML = tooltipHTML;
    styleAndAppendTooltip(tooltip);

    const updatePosition = () => {
      try {
        const pos = edge.renderedMidpoint();
        tooltip.style.left = `${pos.x + 300}px`;
        tooltip.style.top = `${pos.y - 2}px`;
      } catch (err) {
        console.warn("[EDGE_HOVER] Failed to update position:", err);
      }
    };
    updatePosition();

    const moveListener = () => updatePosition();
    try {
      cy.on("pan zoom", moveListener);
    } catch (err) {
      console.error("[EDGE_HOVER] Failed to attach pan zoom listener:", err);
    }

    edge.on("mouseout", () => {
      try {
        cy.off("pan zoom", moveListener);
      } catch (err) {
        console.warn("[EDGE_MOUSEOUT] Failed to detach pan zoom listener:", err);
      }

      removeTooltip(tooltip, tooltipsRef, "EDGE_MOUSEOUT");
    });
  });

  // Node click handler - handle selection with Ctrl/Cmd+click support
  cy.on("click", "node", (evt) => {
    const node = evt.target;
    const isMac = /Mac|iPhone|iPad|iPod/.test(navigator.platform);
    const isMultiSelectKey = isMac ? evt.originalEvent.metaKey : evt.originalEvent.ctrlKey;

    if (isMultiSelectKey) {
      // Ctrl/Cmd+click: toggle selection for this node
      if (node.selected()) {
        node.unselect();
      } else {
        node.select();
      }
    } else {
      // Regular click: select only this node, deselect others
      cy.nodes().unselect();
      node.select();
      // Open modal for single click without modifier
      if (onNodeClick) {
        onNodeClick(node.data());
      }
    }

    const selectedCount = cy.nodes(":selected").length;
    console.log(
      `[NODE_CLICK] Selected nodes: ${selectedCount}, Node ID: ${node.id()}`
    );
  });

  // Canvas click handler - deselect all when clicking background
  cy.on("click", (evt) => {
    if (evt.target === cy) {
      // Clicking on canvas, not on any element
      cy.nodes().unselect();
      cy.edges().unselect();
      console.log("[CANVAS_CLICK] Deselected all elements");
    }
  });

  // Edge click handler - show modal with shared genes
  cy.on("click", "edge", (evt) => {
    const edge = evt.target;
    if (onEdgeClick) {
      onEdgeClick(edge.data());
    }
    console.log(`[EDGE_CLICK] Clicked edge: ${edge.id()}`);
  });

  // Add keyboard support for selection (attach to container for scoped behavior)
  const keydownHandler = (evt: KeyboardEvent) => {
    if ((evt.ctrlKey || evt.metaKey) && evt.key === "a") {
      // Ctrl/Cmd+A: select all nodes
      evt.preventDefault();
      cy.nodes().select();
      console.log(`[KEYBOARD] Selected all ${cy.nodes().length} nodes`);
    }
  };

  container.addEventListener("keydown", keydownHandler);

  // Store handler reference on cy for cleanup
  (cy as any)._selectionKeydownHandler = { container, handler: keydownHandler };

  return cy;

}

/**
 * Cleans up Cytoscape instance and tooltips
 */
export function cleanupCytoscapeInstance(
  cy: Core | null,
  tooltipsRef: React.MutableRefObject<Set<HTMLDivElement>>
): void {
  if (!cy) return;

  // Remove keyboard event listener
  const selectionHandler = (cy as any)._selectionKeydownHandler;
  if (selectionHandler) {
    selectionHandler.container.removeEventListener("keydown", selectionHandler.handler);
    delete (cy as any)._selectionKeydownHandler;
  }

  console.log("[CLEANUP] Starting tooltip cleanup, count:", tooltipsRef.current.size);
  let cleanupIndex = 0;
  for (const tooltip of tooltipsRef.current) {
    cleanupIndex++;
    try {
      if (tooltip.parentNode) {
        console.log(
          `[CLEANUP_${cleanupIndex}] Removing tooltip, parent: ${(tooltip.parentNode as Element).tagName}`
        );
        tooltip.parentNode.removeChild(tooltip);
        console.log(`[CLEANUP_${cleanupIndex}] Successfully removed`);
      } else {
        console.warn(`[CLEANUP_${cleanupIndex}] Tooltip has no parent node`);
      }
    } catch (err) {
      console.error(
        `[CLEANUP_${cleanupIndex}] Failed to removeChild:`,
        err,
        "parent:",
        (tooltip.parentNode as Element)?.tagName
      );
    }
  }
  tooltipsRef.current.clear();
  console.log("[CLEANUP] Tooltip cleanup complete");

  try {
    cy.destroy();
    console.log("[CLEANUP] Cytoscape instance destroyed successfully");
  } catch (err) {
    console.error("[CLEANUP] Failed to destroy cytoscape:", err);
  }
}
