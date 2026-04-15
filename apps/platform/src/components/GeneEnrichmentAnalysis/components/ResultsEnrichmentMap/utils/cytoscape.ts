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
  tooltipsRef: React.MutableRefObject<Set<HTMLDivElement>>
): Core {
  const stylesheet = createStylesheet();
  const cy = cytoscape({
    container,
    elements,
    style: stylesheet,
    layout: layoutConfig as unknown as LayoutOptions,
    wheelSensitivity: 0.1,
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
        console.log("[NODE_MOUSEOUT] Detached pan zoom listener");
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
        console.log("[EDGE_MOUSEOUT] Detached pan zoom listener");
      } catch (err) {
        console.warn("[EDGE_MOUSEOUT] Failed to detach pan zoom listener:", err);
      }

      removeTooltip(tooltip, tooltipsRef, "EDGE_MOUSEOUT");
    });
  });

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
