import { Box, FormControl, InputLabel, MenuItem, Paper, Select, Typography } from "@mui/material";
import { useCallback, useMemo, useState } from "react";
import * as go from "gojs";
import { ReactDiagram } from "gojs-react";
import type { GseaResult } from "../api/gseaApi";

interface ResultsGoJSTreeProps {
  results: GseaResult[];
}

type LayoutType = "tree" | "radial" | "force";

/**
 * GoJS-based visualization for GSEA pathway hierarchy results.
 * Uses gojs-react for proper React integration.
 * Provides interactive tree, radial tree, and force-directed layouts.
 */
export function ResultsGoJSTree({ results }: ResultsGoJSTreeProps) {
  const [layoutType, setLayoutType] = useState<LayoutType>("tree");

  /**
   * Transform GseaResult[] into GoJS model data with node and link arrays.
   */
  const { nodeDataArray, linkDataArray } = useMemo(() => {
    const nodes: go.ObjectData[] = [];
    const links: go.ObjectData[] = [];
    const resultMap = new Map<string, GseaResult>();

    // Build map and nodes
    for (const r of results) {
      const id = r.ID || r.Pathway;
      resultMap.set(id, r);

      // Determine color based on significance
      let color = "#bdbdbd"; // default gray
      let textColor = "#333";
      if (r.FDR < 0.01) {
        color = "#4caf50"; // highly significant - green
        textColor = "#fff";
      } else if (r.FDR < 0.05) {
        color = "#ff9800"; // significant - orange
        textColor = "#fff";
      }

      // Get leading edge gene count
      const geneList = r["Leading edge genes"]
        ? r["Leading edge genes"]
            .split(",")
            .map((g) => g.trim())
            .filter(Boolean)
        : [];

      nodes.push({
        key: id,
        name: r.Pathway,
        pathway: r.Pathway,
        nes: r.NES,
        es: r.ES,
        fdr: r.FDR,
        pValue: r["p-value"],
        pathwaySize: r["Pathway size"],
        inputGenes: r["Number of input genes"],
        leadingEdgeGenes: geneList,
        geneCount: geneList.length,
        color,
        textColor,
        isSignificant: r.FDR < 0.05,
        // Size based on pathway importance (NES magnitude)
        size: Math.max(40, Math.min(100, Math.abs(r.NES) * 30)),
      });
    }

    // Build links from Parent pathway relationships
    for (const r of results) {
      const id = r.ID || r.Pathway;
      const parentId = r["Parent pathway"];

      if (parentId && parentId !== "" && resultMap.has(parentId)) {
        links.push({
          from: parentId,
          to: id,
        });
      }
    }

    return { nodeDataArray: nodes, linkDataArray: links };
  }, [results]);

  /**
   * Initialize GoJS diagram - called by ReactDiagram component
   */
  const initDiagram = useCallback((): go.Diagram => {
    const $ = go.GraphObject.make;

    const diagram = $(go.Diagram, {
      "undoManager.isEnabled": true,
      initialAutoScale: go.AutoScale.Uniform,
      contentAlignment: go.Spot.Center,
      "animationManager.isEnabled": true,
      allowZoom: true,
      allowHorizontalScroll: true,
      allowVerticalScroll: true,
      model: new go.GraphLinksModel({
        linkKeyProperty: "key",
      }),
    });

    // Node template
    diagram.nodeTemplate = $(
      go.Node,
      "Auto",
      {
        cursor: "pointer",
        toolTip: $(
          "ToolTip",
          $(
            go.Panel,
            "Vertical",
            { margin: 8 },
            $(go.TextBlock, { font: "bold 12px sans-serif", margin: new go.Margin(0, 0, 4, 0) }, new go.Binding("text", "pathway")),
            $(go.TextBlock, new go.Binding("text", "", (d: go.ObjectData) => `NES: ${d.nes?.toFixed(3)}`)),
            $(go.TextBlock, new go.Binding("text", "", (d: go.ObjectData) => `ES: ${d.es?.toFixed(3)}`)),
            $(go.TextBlock, new go.Binding("text", "", (d: go.ObjectData) => `FDR: ${d.fdr?.toExponential(2)}`)),
            $(go.TextBlock, new go.Binding("text", "", (d: go.ObjectData) => `p-value: ${d.pValue?.toExponential(2)}`)),
            $(go.TextBlock, new go.Binding("text", "", (d: go.ObjectData) => `Pathway size: ${d.pathwaySize}`)),
            $(go.TextBlock, new go.Binding("text", "", (d: go.ObjectData) => `Input genes: ${d.inputGenes}`)),
            $(
              go.TextBlock,
              { maxSize: new go.Size(300, NaN), wrap: go.Wrap.Fit },
              new go.Binding("text", "", (d: go.ObjectData) =>
                d.leadingEdgeGenes?.length > 0 ? `Leading edge: ${d.leadingEdgeGenes.slice(0, 5).join(", ")}${d.leadingEdgeGenes.length > 5 ? "..." : ""}` : ""
              )
            )
          )
        ),
      },
      $(
        go.Shape,
        "RoundedRectangle",
        {
          fill: "white",
          stroke: "#1976d2",
          strokeWidth: 2,
          minSize: new go.Size(120, 40),
        },
        new go.Binding("fill", "color"),
        new go.Binding("stroke", "isSignificant", (sig: boolean) => (sig ? "#2e7d32" : "#9e9e9e"))
      ),
      $(
        go.Panel,
        "Vertical",
        { margin: 8 },
        $(
          go.TextBlock,
          {
            font: "bold 11px sans-serif",
            textAlign: "center",
            maxSize: new go.Size(150, NaN),
            wrap: go.Wrap.Fit,
          },
          new go.Binding("text", "name", (name: string) => (name.length > 30 ? `${name.substring(0, 30)}...` : name)),
          new go.Binding("stroke", "textColor")
        ),
        $(
          go.Panel,
          "Horizontal",
          { margin: new go.Margin(4, 0, 0, 0) },
          $(
            go.TextBlock,
            {
              font: "10px sans-serif",
              margin: new go.Margin(0, 4, 0, 0),
            },
            new go.Binding("text", "", (d: go.ObjectData) => `NES: ${d.nes?.toFixed(2)}`),
            new go.Binding("stroke", "textColor")
          ),
          $(
            go.TextBlock,
            {
              font: "10px sans-serif",
            },
            new go.Binding("text", "", (d: go.ObjectData) => `FDR: ${d.fdr?.toExponential(1)}`),
            new go.Binding("stroke", "textColor")
          )
        )
      )
    );

    // Link template
    diagram.linkTemplate = $(
      go.Link,
      {
        routing: go.Routing.Orthogonal,
        corner: 10,
        curve: go.Curve.Bezier,
      },
      $(go.Shape, { strokeWidth: 2, stroke: "#90caf9" }),
      $(go.Shape, { toArrow: "Standard", stroke: null, fill: "#1976d2" })
    );

    // Set layout based on type
    switch (layoutType) {
      case "tree":
        diagram.layout = $(go.TreeLayout, {
          angle: 90,
          layerSpacing: 60,
          nodeSpacing: 20,
          arrangement: go.TreeArrangement.Horizontal,
        });
        break;
      case "radial":
        diagram.layout = $(go.TreeLayout, {
          angle: 0,
          layerSpacing: 100,
          nodeSpacing: 20,
          arrangement: go.TreeArrangement.Horizontal,
          setsPortSpot: false,
          setsChildPortSpot: false,
        });
        break;
      case "force":
        diagram.layout = $(go.ForceDirectedLayout, {
          maxIterations: 200,
          defaultSpringLength: 80,
          defaultElectricalCharge: 100,
        });
        break;
    }

    return diagram;
  }, [layoutType]);

  /**
   * Handle model changes from the diagram (if needed for two-way binding)
   */
  const handleModelChange = useCallback((changes: go.IncrementalData) => {
    // Can handle model changes here if needed (e.g., for editing)
    console.log("GoJS model changed:", changes);
  }, []);

  // Stats
  const stats = useMemo(() => {
    const significant = results.filter((r) => r.FDR < 0.05).length;
    const highlySignificant = results.filter((r) => r.FDR < 0.01).length;
    const withParent = results.filter((r) => r["Parent pathway"] && r["Parent pathway"] !== "").length;
    return { total: results.length, significant, highlySignificant, withParent };
  }, [results]);

  if (results.length === 0) {
    return (
      <Paper sx={{ p: 3, textAlign: "center" }}>
        <Typography color="text.secondary">No results to visualize</Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 2 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Box>
          <Typography variant="h6" gutterBottom>
            Pathway Hierarchy Visualization (GoJS)
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {stats.total} pathways | {stats.significant} significant (FDR &lt; 0.05) | {stats.highlySignificant} highly significant (FDR &lt;
            0.01) | {stats.withParent} with parent relationships
          </Typography>
        </Box>
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Layout</InputLabel>
          <Select value={layoutType} label="Layout" onChange={(e) => setLayoutType(e.target.value as LayoutType)}>
            <MenuItem value="tree">Tree Layout</MenuItem>
            <MenuItem value="radial">Radial Layout</MenuItem>
            <MenuItem value="force">Force-Directed</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Box sx={{ width: 16, height: 16, bgcolor: "#4caf50", borderRadius: 1 }} />
          <Typography variant="caption">Highly Significant (FDR &lt; 0.01)</Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Box sx={{ width: 16, height: 16, bgcolor: "#ff9800", borderRadius: 1 }} />
          <Typography variant="caption">Significant (FDR &lt; 0.05)</Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Box sx={{ width: 16, height: 16, bgcolor: "#bdbdbd", borderRadius: 1 }} />
          <Typography variant="caption">Not Significant</Typography>
        </Box>
      </Box>

      <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 1 }}>
        Tip: Hover over nodes for detailed information. Scroll to zoom, drag to pan.
      </Typography>

      <ReactDiagram
        initDiagram={initDiagram}
        divClassName="gojs-diagram"
        nodeDataArray={nodeDataArray}
        linkDataArray={linkDataArray}
        onModelChange={handleModelChange}
        style={{
          width: "100%",
          height: 600,
          border: "1px solid #e0e0e0",
          borderRadius: 4,
          backgroundColor: "#fafafa",
        }}
      />
    </Paper>
  );
}

export default ResultsGoJSTree;
