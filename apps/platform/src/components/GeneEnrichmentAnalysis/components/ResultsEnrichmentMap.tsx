import { Box, FormControl, InputLabel, MenuItem, Paper, Select, Slider, Typography } from "@mui/material";
import { useCallback, useMemo, useState } from "react";
import * as go from "gojs";
import { ReactDiagram } from "gojs-react";
import type { GseaResult } from "../api/gseaApi";

interface ResultsEnrichmentMapProps {
  results: GseaResult[];
}

type LayoutType = "force" | "circular" | "grid";

/**
 * Helper to get gene list from comma-separated string
 */
function getGeneList(result: GseaResult): string[] {
  const genes = result["Leading edge genes"];
  if (!genes || genes === "") return [];
  return genes
    .split(",")
    .map((g) => g.trim())
    .filter(Boolean);
}

/**
 * Calculate Jaccard similarity coefficient between two gene sets
 */
function jaccardSimilarity(genesA: string[], genesB: string[]): number {
  if (genesA.length === 0 || genesB.length === 0) return 0;
  const setA = new Set(genesA);
  const setB = new Set(genesB);
  const intersection = [...setA].filter((g) => setB.has(g)).length;
  const union = new Set([...setA, ...setB]).size;
  return union > 0 ? intersection / union : 0;
}

/**
 * Enrichment Map visualization for GSEA pathway results.
 * 
 * Shows pathways as nodes connected by edges when they share leading edge genes.
 * This reveals functional clusters of related pathways.
 * 
 * - Node size: proportional to pathway size or -log10(FDR)
 * - Node color: significance level (green = highly significant, orange = significant, gray = not)
 * - Edge thickness: gene overlap (Jaccard similarity)
 * - Only edges above similarity threshold are shown
 */
export function ResultsEnrichmentMap({ results }: ResultsEnrichmentMapProps) {
  const [layoutType, setLayoutType] = useState<LayoutType>("force");
  const [similarityThreshold, setSimilarityThreshold] = useState<number>(0.1);
  const [sizeBy, setSizeBy] = useState<"significance" | "pathwaySize" | "geneCount">("significance");

  /**
   * Transform GseaResult[] into GoJS enrichment map model
   */
  const { nodeDataArray, linkDataArray, stats } = useMemo(() => {
    const nodes: go.ObjectData[] = [];
    const links: go.ObjectData[] = [];
    const geneMap = new Map<string, string[]>(); // pathway ID -> gene list

    // Filter to significant results for cleaner visualization (optional)
    const significantResults = results.filter((r) => r.FDR < 0.25);
    const displayResults = significantResults.length > 0 ? significantResults : results.slice(0, 50);

    // Build nodes
    for (const r of displayResults) {
      const id = r.ID || r.Pathway;
      const geneList = getGeneList(r);
      geneMap.set(id, geneList);

      // Determine color based on significance
      let color = "#e0e0e0"; // not significant - light gray
      let borderColor = "#9e9e9e";
      if (r.FDR < 0.01) {
        color = "#4caf50"; // highly significant - green
        borderColor = "#2e7d32";
      } else if (r.FDR < 0.05) {
        color = "#8bc34a"; // significant - light green
        borderColor = "#558b2f";
      } else if (r.FDR < 0.1) {
        color = "#ff9800"; // borderline - orange
        borderColor = "#ef6c00";
      } else if (r.FDR < 0.25) {
        color = "#ffcc80"; // weak - light orange
        borderColor = "#ff9800";
      }

      // Calculate node size based on selected metric
      let nodeSize: number;
      switch (sizeBy) {
        case "significance":
          // -log10(FDR), clamped
          nodeSize = Math.min(80, Math.max(30, -Math.log10(Math.max(r.FDR, 1e-10)) * 8));
          break;
        case "pathwaySize":
          nodeSize = Math.min(80, Math.max(30, Math.sqrt(r["Pathway size"]) * 5));
          break;
        case "geneCount":
          nodeSize = Math.min(80, Math.max(30, geneList.length * 3 + 20));
          break;
        default:
          nodeSize = 40;
      }

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
        geneCount: geneList.length,
        color,
        borderColor,
        size: nodeSize,
        isSignificant: r.FDR < 0.05,
      });
    }

    // Build edges based on gene overlap (Jaccard similarity)
    const pathwayIds = Array.from(geneMap.keys());
    let edgeCount = 0;
    let maxSimilarity = 0;

    for (let i = 0; i < pathwayIds.length; i++) {
      for (let j = i + 1; j < pathwayIds.length; j++) {
        const idA = pathwayIds[i];
        const idB = pathwayIds[j];
        const genesA = geneMap.get(idA) || [];
        const genesB = geneMap.get(idB) || [];

        const similarity = jaccardSimilarity(genesA, genesB);
        maxSimilarity = Math.max(maxSimilarity, similarity);

        if (similarity >= similarityThreshold) {
          // Calculate shared genes for tooltip
          const setA = new Set(genesA);
          const sharedGenes = genesB.filter((g) => setA.has(g));

          links.push({
            key: `${idA}-${idB}`,
            from: idA,
            to: idB,
            similarity,
            sharedGenes,
            sharedCount: sharedGenes.length,
            // Edge thickness based on similarity
            thickness: Math.max(1, similarity * 8),
            // Edge opacity based on similarity
            opacity: Math.min(1, 0.3 + similarity * 0.7),
          });
          edgeCount++;
        }
      }
    }

    return {
      nodeDataArray: nodes,
      linkDataArray: links,
      stats: {
        totalPathways: displayResults.length,
        edges: edgeCount,
        maxSimilarity,
        significantCount: displayResults.filter((r) => r.FDR < 0.05).length,
      },
    };
  }, [results, similarityThreshold, sizeBy]);

  /**
   * Initialize GoJS diagram
   */
  const initDiagram = useCallback((): go.Diagram => {
    const $ = go.GraphObject.make;

    const diagram = $(go.Diagram, {
      "undoManager.isEnabled": false,
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

    // Node template - circular nodes for enrichment map
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
            { margin: 10 },
            $(
              go.TextBlock,
              { font: "bold 12px sans-serif", margin: new go.Margin(0, 0, 6, 0), maxSize: new go.Size(250, NaN), wrap: go.Wrap.Fit },
              new go.Binding("text", "pathway")
            ),
            $(go.TextBlock, new go.Binding("text", "", (d: go.ObjectData) => `NES: ${d.nes?.toFixed(3)}`)),
            $(go.TextBlock, new go.Binding("text", "", (d: go.ObjectData) => `FDR: ${d.fdr?.toExponential(2)}`)),
            $(go.TextBlock, new go.Binding("text", "", (d: go.ObjectData) => `p-value: ${d.pValue?.toExponential(2)}`)),
            $(go.TextBlock, new go.Binding("text", "", (d: go.ObjectData) => `Pathway size: ${d.pathwaySize}`)),
            $(go.TextBlock, new go.Binding("text", "", (d: go.ObjectData) => `Leading edge genes: ${d.geneCount}`))
          )
        ),
      },
      $(
        go.Shape,
        "Circle",
        {
          fill: "white",
          strokeWidth: 3,
        },
        new go.Binding("fill", "color"),
        new go.Binding("stroke", "borderColor"),
        new go.Binding("width", "size"),
        new go.Binding("height", "size")
      ),
      $(
        go.TextBlock,
        {
          font: "9px sans-serif",
          textAlign: "center",
          maxSize: new go.Size(60, 36),
          overflow: go.TextOverflow.Ellipsis,
          wrap: go.Wrap.Fit,
        },
        new go.Binding("text", "name", (name: string) => {
          // Truncate long names
          if (name.length > 25) {
            return `${name.substring(0, 22)}...`;
          }
          return name;
        })
      )
    );

    // Link template - edges represent gene overlap
    diagram.linkTemplate = $(
      go.Link,
      {
        curve: go.Curve.Bezier,
        layerName: "Background", // Draw links behind nodes
        toolTip: $(
          "ToolTip",
          $(
            go.Panel,
            "Vertical",
            { margin: 8 },
            $(go.TextBlock, { font: "bold 11px sans-serif" }, new go.Binding("text", "", (d: go.ObjectData) => `Similarity: ${(d.similarity * 100).toFixed(1)}%`)),
            $(go.TextBlock, new go.Binding("text", "", (d: go.ObjectData) => `Shared genes: ${d.sharedCount}`)),
            $(
              go.TextBlock,
              { maxSize: new go.Size(200, NaN), wrap: go.Wrap.Fit },
              new go.Binding("text", "", (d: go.ObjectData) => (d.sharedGenes?.length > 0 ? d.sharedGenes.slice(0, 10).join(", ") + (d.sharedGenes.length > 10 ? "..." : "") : ""))
            )
          )
        ),
      },
      $(
        go.Shape,
        {
          stroke: "#90caf9",
        },
        new go.Binding("strokeWidth", "thickness"),
        new go.Binding("opacity", "opacity")
      )
    );

    // Set layout based on type
    switch (layoutType) {
      case "force":
        diagram.layout = $(go.ForceDirectedLayout, {
          maxIterations: 300,
          defaultSpringLength: 100,
          defaultElectricalCharge: 150,
          arrangesToOrigin: false,
        });
        break;
      case "circular":
        diagram.layout = $(go.CircularLayout, {
          radius: 200,
          spacing: 20,
          arrangement: go.CircularArrangement.Packed,
        });
        break;
      case "grid":
        diagram.layout = $(go.GridLayout, {
          cellSize: new go.Size(100, 100),
          spacing: new go.Size(20, 20),
          wrappingColumn: 6,
        });
        break;
    }

    return diagram;
  }, [layoutType]);

  /**
   * Handle model changes (for potential future interactivity)
   */
  const handleModelChange = useCallback((_changes: go.IncrementalData) => {
    // Could handle model changes here if needed
  }, []);

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
        <Box>
          <Typography variant="h6" gutterBottom>
            Pathway Enrichment Map
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {stats.totalPathways} pathways | {stats.significantCount} significant (FDR &lt; 0.05) | {stats.edges} connections (similarity &ge;{" "}
            {(similarityThreshold * 100).toFixed(0)}%)
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 0.5 }}>
            Pathways sharing genes are connected. Clusters indicate functionally related pathways.
          </Typography>
        </Box>

        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", alignItems: "center" }}>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Layout</InputLabel>
            <Select value={layoutType} label="Layout" onChange={(e) => setLayoutType(e.target.value as LayoutType)}>
              <MenuItem value="force">Force-Directed</MenuItem>
              <MenuItem value="circular">Circular</MenuItem>
              <MenuItem value="grid">Grid</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 130 }}>
            <InputLabel>Node Size</InputLabel>
            <Select value={sizeBy} label="Node Size" onChange={(e) => setSizeBy(e.target.value as typeof sizeBy)}>
              <MenuItem value="significance">Significance</MenuItem>
              <MenuItem value="pathwaySize">Pathway Size</MenuItem>
              <MenuItem value="geneCount">Gene Count</MenuItem>
            </Select>
          </FormControl>

          <Box sx={{ width: 150 }}>
            <Typography variant="caption" color="text.secondary">
              Min. Similarity: {(similarityThreshold * 100).toFixed(0)}%
            </Typography>
            <Slider
              value={similarityThreshold}
              onChange={(_, value) => setSimilarityThreshold(value as number)}
              min={0}
              max={0.5}
              step={0.05}
              size="small"
            />
          </Box>
        </Box>
      </Box>

      {/* Legend */}
      <Box sx={{ display: "flex", gap: 3, mb: 2, flexWrap: "wrap" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Box sx={{ width: 14, height: 14, bgcolor: "#4caf50", borderRadius: "50%", border: "2px solid #2e7d32" }} />
          <Typography variant="caption">FDR &lt; 0.01</Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Box sx={{ width: 14, height: 14, bgcolor: "#8bc34a", borderRadius: "50%", border: "2px solid #558b2f" }} />
          <Typography variant="caption">FDR &lt; 0.05</Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Box sx={{ width: 14, height: 14, bgcolor: "#ff9800", borderRadius: "50%", border: "2px solid #ef6c00" }} />
          <Typography variant="caption">FDR &lt; 0.1</Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Box sx={{ width: 14, height: 14, bgcolor: "#ffcc80", borderRadius: "50%", border: "2px solid #ff9800" }} />
          <Typography variant="caption">FDR &lt; 0.25</Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Box sx={{ width: 30, height: 3, bgcolor: "#90caf9", borderRadius: 1 }} />
          <Typography variant="caption">Edge = shared genes</Typography>
        </Box>
      </Box>

      <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 1 }}>
        Tip: Hover over nodes to see pathway details. Hover over edges to see shared genes.
      </Typography>

      <ReactDiagram
        initDiagram={initDiagram}
        divClassName="gojs-enrichment-map"
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

export default ResultsEnrichmentMap;
