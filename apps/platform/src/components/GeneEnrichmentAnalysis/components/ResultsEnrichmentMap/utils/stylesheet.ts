import type cytoscape from "cytoscape";

/**
 * Cytoscape stylesheet for enrichment map visualization
 */
export function createStylesheet(): cytoscape.StylesheetCSS[] {
  return [
    {
      selector: "node",
      css: {
        "background-color": "data(color)",
        "border-color": "data(borderColor)",
        "border-width": 2,
        width: "data(size)",
        height: "data(size)",
        label: "data(displayLabel)",
        "text-valign": "center",
        "text-halign": "center",
        "font-size": 10,
        color: "#000",
        "text-outline-width": 0,
      },
    },
    {
      selector: "node:selected",
      css: {
        "background-color": "#2196f3",
        "border-width": 3,
        "border-color": "#1565c0",
      },
    },
    {
      selector: "edge",
      css: {
        "line-color": "#90caf9",
        width: "data(edgeWidth)",
        opacity: "data(edgeOpacity)",
        "curve-style": "straight",
      },
    },
    {
      selector: "edge:selected",
      css: {
        "line-color": "#1976d2",
        width: 4,
      },
    },
  ] as unknown as cytoscape.StylesheetCSS[];
}
