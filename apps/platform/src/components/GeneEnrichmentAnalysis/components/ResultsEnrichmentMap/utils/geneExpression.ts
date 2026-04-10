/**
 * Gene expression overlay rendering utilities for pathway nodes
 */

interface GeneExpressionData {
  gene: string;
  status: "up" | "down";
  score: number;
}

/**
 * Renders gene expression circles as SVG overlays on pathway nodes
 */
export function renderGeneExpressions(
  container: HTMLDivElement,
  // biome-ignore lint/suspicious/noExplicitAny: cytoscape instance type is complex
  cy: any
): void {
  // Create SVG overlay
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("style", "position: absolute; top: 0; left: 0; pointer-events: none;");
  container.appendChild(svg);

  // Update SVG on render
  const updateGeneCircles = () => {
    // Clear previous circles
    while (svg.firstChild) {
      svg.removeChild(svg.firstChild);
    }

    svg.setAttribute("width", `${container.clientWidth}`);
    svg.setAttribute("height", `${container.clientHeight}`);

    // Render gene circles for each node
    const nodes = cy.nodes();
    for (const node of nodes) {
      const geneExpression: GeneExpressionData[] = (node.data("geneExpression") as GeneExpressionData[]) || [];
      if (geneExpression.length === 0) continue;

      const pos = node.renderedPosition() as {x: number; y: number};
      const size = node.data("size") as number;

      // Render circles around the node
      for (let index = 0; index < geneExpression.length; index++) {
        const gene = geneExpression[index];
        const angle = (index / geneExpression.length) * Math.PI * 2;
        const distance = size / 2 + 15; // Position circles around the node

        const x = pos.x + Math.cos(angle) * distance;
        const y = pos.y + Math.sin(angle) * distance;

        // Circle color based on regulation status
        const circleColor = gene.status === "up" ? "#2196f3" : "#f44336"; // Blue for up, Red for down
        const circleRadius = 4 + gene.score * 2; // Size based on score

        const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circle.setAttribute("cx", `${x}`);
        circle.setAttribute("cy", `${y}`);
        circle.setAttribute("r", `${circleRadius}`);
        circle.setAttribute("fill", circleColor);
        circle.setAttribute("opacity", "0.8");
        circle.setAttribute("stroke", "#fff");
        circle.setAttribute("stroke-width", "1");
        circle.setAttribute("title", `${gene.gene} (${gene.status}-regulated)`);

        svg.appendChild(circle);
      }
    }
  };

  // Initial render
  updateGeneCircles();

  // Update on pan/zoom/render
  cy.on("pan zoom", updateGeneCircles);
  cy.on("render", updateGeneCircles);
}

/**
 * Clean up gene expression overlays
 */
export function cleanupGeneExpressions(
  container: HTMLDivElement,
  // biome-ignore lint/suspicious/noExplicitAny: cytoscape instance type is complex
  cy: any
): void {
  // Remove SVG overlay
  const svg = container.querySelector("svg[style*='pointer-events: none']");
  if (svg) {
    container.removeChild(svg);
  }

  // Unbind events
  cy.off("pan zoom");
  cy.off("render");
}
