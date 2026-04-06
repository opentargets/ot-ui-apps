import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Slider,
  Typography,
} from "@mui/material";
import cytoscape from "cytoscape";
import { useEffect, useMemo, useRef, useState } from "react";
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
 * Enrichment Map visualization for GSEA pathway results using Cytoscape.js
 *
 * Shows genes as nodes connected by edges when they share pathways.
 * This reveals genes that function together in similar biological processes.
 *
 * - Node size: proportional to pathway size or -log10(FDR)
 * - Node color: significance level (green = highly significant, orange = significant, gray = not)
 * - Edge thickness: gene overlap (Jaccard similarity)
 * - Only edges above similarity threshold are shown
 */
export function ResultsEnrichmentMap({ results }: ResultsEnrichmentMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cyRef = useRef<cytoscape.Core | null>(null);
  const [viewMode, setViewMode] = useState<"genes" | "pathways">("genes");
  const [layoutType, setLayoutType] = useState<LayoutType>("force");
  const [similarityThreshold, setSimilarityThreshold] = useState<number>(1);
  const [sizeBy, setSizeBy] = useState<"significance" | "pathwaySize" | "geneCount">(
    "significance"
  );

  /**
   * Transform GseaResult[] into Cytoscape elements format
   * Supports two view modes:
   * - "genes": Nodes = Genes, Edges = Shared Pathways
   * - "pathways": Nodes = Pathways, Edges = Shared Genes
   */ /**
   * Calculate Jaccard coefficient between two sets
   * JC = |A ∩ B| / |A ∪ B|
   * Based on Enrichment Map paper: https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0013984
   */
  const { elements, stats } = useMemo(() => {
    /**
     * Calculate Jaccard coefficient between two sets
     * JC = |A ∩ B| / |A ∪ B|
     * Based on Enrichment Map paper: https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0013984
     */
    const jaccardSimilarity = (setA: string[], setB: string[]): number => {
      if (setA.length === 0 || setB.length === 0) return 0;
      const b = new Set(setB);
      const intersection = setA.filter((item) => b.has(item)).length;
      const union = new Set([...setA, ...setB]).size;
      return union > 0 ? intersection / union : 0;
    };

    // Note: Overlap coefficient (OC = |A ∩ B| / min(|A|, |B|)) is better for hierarchical
    // gene-sets like Gene Ontology - can be used as alternative to Jaccard if needed.

    const nodes: cytoscape.ElementDefinition[] = [];
    const edges: cytoscape.ElementDefinition[] = [];

    const significantResults = results.filter((r) => r.FDR < 0.25);
    const displayResults =
      significantResults.length > 0 ? significantResults : results.slice(0, 50);

    if (viewMode === "genes") {
      // GENE VIEW: Genes as nodes, pathways connecting them as edges
      const geneToPathways = new Map<
        string,
        Array<{ pathway: string; fdr: number; nes: number }>
      >();

      // Build gene map: gene -> list of pathways it belongs to
      for (const r of displayResults) {
        const geneList = getGeneList(r);
        for (const gene of geneList) {
          if (!geneToPathways.has(gene)) {
            geneToPathways.set(gene, []);
          }
          const pathwaysForGene = geneToPathways.get(gene);
          if (pathwaysForGene) {
            pathwaysForGene.push({
              pathway: r.Pathway,
              fdr: r.FDR,
              nes: r.NES,
            });
          }
        }
      }

      // Filter genes: only include those in at least 2 pathways, then take top 200 by pathway count
      // This prevents explosion of nodes/edges and keeps rendering performant
      const sortedGenes = Array.from(geneToPathways.entries())
        .filter(([_, pathways]) => pathways.length >= 2)
        .sort((a, b) => b[1].length - a[1].length)
        .slice(0, 500)
        .map(([gene]) => gene);

      // Rebuild nodes with filtered genes only
      const filteredGeneToPathways = new Map<
        string,
        Array<{ pathway: string; fdr: number; nes: number }>
      >();
      for (const gene of sortedGenes) {
        const pathways = geneToPathways.get(gene);
        if (pathways) {
          filteredGeneToPathways.set(gene, pathways);
        }
      }

      // Build gene nodes
      for (const gene of sortedGenes) {
        const pathways = filteredGeneToPathways.get(gene);
        if (!pathways) continue;
        // Color based on best (most significant) FDR of pathways
        const bestFDR = Math.min(...pathways.map((p) => p.fdr));
        let color = "#e0e0e0";
        if (bestFDR < 0.01) {
          color = "#4caf50"; // Dark green
        } else if (bestFDR < 0.05) {
          color = "#8bc34a"; // Light green
        } else if (bestFDR < 0.1) {
          color = "#ff9800"; // Orange
        } else if (bestFDR < 0.25) {
          color = "#ffcc80"; // Light orange
        }

        // Size based on how many pathways the gene appears in
        let nodeSize: number;
        switch (sizeBy) {
          case "significance":
            nodeSize = Math.min(80, Math.max(30, -Math.log10(Math.max(bestFDR, 1e-10)) * 8));
            break;
          case "pathwaySize":
            nodeSize = Math.min(80, Math.max(30, Math.sqrt(pathways.length) * 20));
            break;
          case "geneCount":
            nodeSize = Math.min(80, Math.max(30, pathways.length * 5));
            break;
          default:
            nodeSize = 40;
        }

        nodes.push({
          data: {
            id: gene,
            label: gene,
            gene: gene,
            pathwayCount: pathways.length,
            bestFDR: bestFDR,
            pathways: pathways.map((p) => p.pathway),
            color: color,
            borderColor:
              color === "#4caf50"
                ? "#2e7d32"
                : color === "#8bc34a"
                  ? "#558b2f"
                  : color === "#ff9800"
                    ? "#ef6c00"
                    : color === "#ffcc80"
                      ? "#ff9800"
                      : "#9e9e9e",
            size: nodeSize,
            displayLabel: gene.length > 15 ? `${gene.substring(0, 12)}...` : gene,
          },
        });
      }

      // Build edges between filtered genes that share pathways using Jaccard similarity
      let edgeCount = 0;
      const edgeSet = new Set<string>();

      for (let i = 0; i < sortedGenes.length; i++) {
        for (let j = i + 1; j < sortedGenes.length; j++) {
          const geneA = sortedGenes[i];
          const geneB = sortedGenes[j];
          const pathwaysAData = filteredGeneToPathways.get(geneA);
          const pathwaysBData = filteredGeneToPathways.get(geneB);
          if (!pathwaysAData || !pathwaysBData) continue;

          const pathwaysA = pathwaysAData.map((p) => p.pathway);
          const pathwaysB = pathwaysBData.map((p) => p.pathway);

          // Calculate Jaccard coefficient as per Enrichment Map paper
          const jaccard = jaccardSimilarity(pathwaysA, pathwaysB);

          // Convert threshold (1-10) to Jaccard threshold (0.1-1.0)
          // Lower thresholds show weaker connections
          const jaccardThreshold = similarityThreshold / 10;

          // Filter by Jaccard coefficient threshold
          if (jaccard >= jaccardThreshold) {
            const edgeId = `${geneA}-${geneB}`;
            if (!edgeSet.has(edgeId)) {
              edgeSet.add(edgeId);

              const setA = new Set(pathwaysA);
              const sharedPathways = pathwaysB.filter((p) => setA.has(p));
              const sharedFDRs = sharedPathways
                .map((p) => pathwaysAData.find((pw) => pw.pathway === p)?.fdr || 1)
                .sort((a, b) => a - b);
              const bestSharedFDR = sharedFDRs[0];

              edges.push({
                data: {
                  id: edgeId,
                  source: geneA,
                  target: geneB,
                  sharedPathways,
                  sharedCount: sharedPathways.length,
                  jaccardCoefficient: jaccard,
                  // Scale edge width by Jaccard coefficient (0-3)
                  edgeWidth: Math.max(1, jaccard * 3),
                  // Scale opacity by Jaccard coefficient
                  edgeOpacity: Math.min(1, Math.max(0.3, jaccard)),
                  bestSharedFDR: bestSharedFDR,
                },
              });
              edgeCount++;
            }
          }
        }
      }

      return {
        elements: [...nodes, ...edges],
        stats: {
          totalGenes: nodes.length,
          edges: edgeCount,
          totalPathways: displayResults.length,
          significantCount: displayResults.filter((r) => r.FDR < 0.05).length,
        },
      };
    } else {
      // PATHWAY VIEW: Pathways as nodes, genes connecting them as edges
      const geneToPathways = new Map<string, string[]>(); // gene -> pathways

      // Build mapping
      for (const r of displayResults) {
        const geneList = getGeneList(r);
        for (const gene of geneList) {
          if (!geneToPathways.has(gene)) {
            geneToPathways.set(gene, []);
          }
          const pathways = geneToPathways.get(gene);
          if (pathways) {
            pathways.push(r.Pathway);
          }
        }
      }

      // Build pathway nodes
      for (const r of displayResults) {
        const geneList = getGeneList(r);
        let color = "#e0e0e0";
        if (r.FDR < 0.01) {
          color = "#4caf50"; // Dark green
        } else if (r.FDR < 0.05) {
          color = "#8bc34a"; // Light green
        } else if (r.FDR < 0.1) {
          color = "#ff9800"; // Orange
        } else if (r.FDR < 0.25) {
          color = "#ffcc80"; // Light orange
        }

        let nodeSize: number;
        switch (sizeBy) {
          case "significance":
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
          data: {
            id: r.ID || r.Pathway,
            label: r.Pathway,
            pathway: r.Pathway,
            nes: r.NES,
            es: r.ES,
            fdr: r.FDR,
            pValue: r["p-value"],
            pathwaySize: r["Pathway size"],
            inputGenes: r["Number of input genes"],
            geneCount: geneList.length,
            color: color,
            borderColor:
              color === "#4caf50"
                ? "#2e7d32"
                : color === "#8bc34a"
                  ? "#558b2f"
                  : color === "#ff9800"
                    ? "#ef6c00"
                    : color === "#ffcc80"
                      ? "#ff9800"
                      : "#9e9e9e",
            size: nodeSize,
            displayLabel: r.Pathway.length > 25 ? `${r.Pathway.substring(0, 22)}...` : r.Pathway,
          },
        });
      }

      // Build edges between pathways that share genes using Jaccard similarity
      let edgeCount = 0;
      const pathwayGenes = new Map<string, string[]>();
      for (const r of displayResults) {
        pathwayGenes.set(r.ID || r.Pathway, getGeneList(r));
      }

      const pathwayIds = Array.from(pathwayGenes.keys());
      const edgeSet = new Set<string>();

      for (let i = 0; i < pathwayIds.length; i++) {
        for (let j = i + 1; j < pathwayIds.length; j++) {
          const idA = pathwayIds[i];
          const idB = pathwayIds[j];
          const genesA = pathwayGenes.get(idA) || [];
          const genesB = pathwayGenes.get(idB) || [];

          if (genesA.length === 0 || genesB.length === 0) continue;

          // Calculate Jaccard coefficient as per Enrichment Map paper
          const jaccard = jaccardSimilarity(genesA, genesB);

          // Convert threshold (1-10) to Jaccard threshold (0.1-1.0)
          const jaccardThreshold = similarityThreshold / 10;

          // Filter by Jaccard coefficient threshold
          if (jaccard >= jaccardThreshold) {
            const edgeId = `${idA}-${idB}`;
            if (!edgeSet.has(edgeId)) {
              edgeSet.add(edgeId);

              const setA = new Set(genesA);
              const sharedGenes = genesB.filter((g) => setA.has(g));

              edges.push({
                data: {
                  id: edgeId,
                  source: idA,
                  target: idB,
                  sharedGenes,
                  sharedCount: sharedGenes.length,
                  jaccardCoefficient: jaccard,
                  // Scale edge width by Jaccard coefficient (0-3)
                  edgeWidth: Math.max(1, jaccard * 3),
                  // Scale opacity by Jaccard coefficient
                  edgeOpacity: Math.min(1, Math.max(0.3, jaccard)),
                },
              });
              edgeCount++;
            }
          }
        }
      }

      return {
        elements: [...nodes, ...edges],
        stats: {
          totalPathways: nodes.length,
          edges: edgeCount,
          totalGenes: geneToPathways.size,
          significantCount: displayResults.filter((r) => r.FDR < 0.05).length,
        },
      };
    }
  }, [results, sizeBy, similarityThreshold, viewMode]);

  /**
   * Cytoscape stylesheet
   */
  const stylesheet = [
    {
      selector: "node",
      css: {
        "background-color": "data(color)",
        "border-width": 3,
        "border-color": "data(borderColor)",
        label: "data(displayLabel)",
        "font-size": 10,
        "text-valign": "center",
        "text-halign": "center",
        width: "data(size)",
        height: "data(size)",
      },
    },
    {
      selector: "node:selected",
      css: {
        "border-width": 5,
        "border-color": "#ffd700",
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

  /**
   * Initialize Cytoscape instance
   */
  useEffect(() => {
    if (!containerRef.current || results.length === 0) return;

    // Destroy previous instance
    if (cyRef.current) {
      cyRef.current.destroy();
    }

    // Build layout config based on layout type
    let layoutConfig: Record<string, unknown> = {
      name: layoutType === "circular" ? "circle" : layoutType === "grid" ? "grid" : "cose",
      animate: false,
      animationDuration: 500,
    };

    if (layoutType === "circular") {
      const nodeCount = elements.filter((el) => !el.data?.source).length;
      const dynamicRadius = Math.max(300, nodeCount * 50);
      layoutConfig = {
        ...layoutConfig,
        radius: dynamicRadius,
        startAngle: 0,
        sweep: 2 * Math.PI, // Full circle (360 degrees)
        clockwise: true,
        equidistant: true, // Equal spacing around circle
      };
    } else if (layoutType === "grid") {
      layoutConfig = { ...layoutConfig, rows: -1 };
    } else if (layoutType === "force") {
      layoutConfig = {
        ...layoutConfig,
      };
    }

    const cy = cytoscape({
      container: containerRef.current,
      elements,
      style: stylesheet,
      layout: layoutConfig as unknown as cytoscape.LayoutOptions,
      wheelSensitivity: 0.1,
    });

    cyRef.current = cy;

    // Add tooltip on node hover
    cy.on("mouseover", "node", (evt) => {
      const node = evt.target;
      const data = node.data();
      const tooltip = document.createElement("div");
      tooltip.className = "cytoscape-tooltip";

      let tooltipHTML = "";
      if (viewMode === "genes") {
        const pathwayList = (data.pathways || []).slice(0, 5).join("<br/>");
        tooltipHTML = `
          <strong>${data.gene}</strong><br/>
          Pathways: ${data.pathwayCount}<br/>
          Best FDR: ${data.bestFDR?.toExponential(2)}<br/>
          <small>${pathwayList}${data.pathways?.length > 5 ? `<br/>... and ${data.pathways.length - 5} more` : ""}</small>
        `;
      } else {
        tooltipHTML = `
          <strong>${data.pathway}</strong><br/>
          NES: ${data.nes?.toFixed(3)}<br/>
          FDR: ${data.fdr?.toExponential(2)}<br/>
          p-value: ${data.pValue?.toExponential(2)}<br/>
          Pathway size: ${data.pathwaySize}<br/>
          Leading edge genes: ${data.geneCount}
        `;
      }

      tooltip.innerHTML = tooltipHTML;
      tooltip.style.position = "fixed";
      tooltip.style.background = "rgba(0, 0, 0, 0.85)";
      tooltip.style.color = "white";
      tooltip.style.padding = "8px 12px";
      tooltip.style.borderRadius = "4px";
      tooltip.style.fontSize = "12px";
      tooltip.style.pointerEvents = "none";
      tooltip.style.zIndex = "9999";
      tooltip.style.maxWidth = "300px";
      document.body.appendChild(tooltip);

      const updatePosition = () => {
        const pos = node.renderedPosition();
        tooltip.style.left = `${pos.x + 10}px`;
        tooltip.style.top = `${pos.y - 10}px`;
      };
      updatePosition();

      const moveListener = () => updatePosition();
      cy.on("pan zoom", moveListener);

      node.on("mouseout", () => {
        cy.off("pan zoom", moveListener);
        tooltip.remove();
      });
    });

    // Add tooltip on edge hover
    cy.on("mouseover", "edge", (evt) => {
      const edge = evt.target;
      const data = edge.data();
      const tooltip = document.createElement("div");
      tooltip.className = "cytoscape-tooltip";

      let tooltipHTML = "";
      if (viewMode === "genes") {
        const pathwayList = (data.sharedPathways || []).slice(0, 8).join("<br/>");
        tooltipHTML = `
          <strong>Shared Pathways: ${data.sharedCount}</strong><br/>
          <small>${pathwayList}${data.sharedPathways?.length > 8 ? `<br/>... and ${data.sharedPathways.length - 8} more` : ""}</small>
        `;
      } else {
        const geneList = (data.sharedGenes || []).slice(0, 8).join(", ");
        tooltipHTML = `
          <strong>Shared Genes: ${data.sharedCount}</strong><br/>
          <small>${geneList}${data.sharedGenes?.length > 8 ? `... and ${data.sharedGenes.length - 8} more` : ""}</small>
        `;
      }

      tooltip.innerHTML = tooltipHTML;
      tooltip.style.position = "fixed";
      tooltip.style.background = "rgba(0, 0, 0, 0.85)";
      tooltip.style.color = "white";
      tooltip.style.padding = "8px 12px";
      tooltip.style.borderRadius = "4px";
      tooltip.style.fontSize = "12px";
      tooltip.style.pointerEvents = "none";
      tooltip.style.zIndex = "9999";
      tooltip.style.maxWidth = "300px";
      document.body.appendChild(tooltip);

      const updatePosition = () => {
        const pos = edge.renderedMidpoint();
        tooltip.style.left = `${pos.x + 10}px`;
        tooltip.style.top = `${pos.y - 10}px`;
      };
      updatePosition();

      const moveListener = () => updatePosition();
      cy.on("pan zoom", moveListener);

      edge.on("mouseout", () => {
        cy.off("pan zoom", moveListener);
        tooltip.remove();
      });
    });

    return () => {
      if (cyRef.current) {
        cyRef.current.destroy();
      }
    };
  }, [elements, layoutType, results.length, stylesheet, viewMode]);

  /**
   * Update layout when layout type changes
   */
  useEffect(() => {
    if (!cyRef.current) return;

    const layoutConfig = {
      name: layoutType === "circular" ? "circle" : layoutType === "grid" ? "grid" : "cose",
      animate: true,
      animationDuration: 500,
      ...(layoutType === "circular" && { radius: 300, startAngle: 0 }),
      ...(layoutType === "grid" && { rows: -1 }),
      ...(layoutType === "force" && {
        nodeSpacing: 10,
        minNodeSpacing: 50,
        nestingFactor: 0.1,
        gravity: 0.1,
        numIter: 2500,
      }),
    } as unknown as cytoscape.LayoutOptions;

    const layout = cyRef.current.layout(layoutConfig);
    layout.run();
  }, [layoutType]);

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
        <Box>
          <Typography variant="h6" gutterBottom>
            {viewMode === "genes" ? "Gene Network" : "Pathway Network"}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {viewMode === "genes"
              ? `${stats.totalGenes} genes | ${stats.totalPathways} enriched pathways | ${stats.significantCount} significant (FDR < 0.05) | ${stats.edges} gene-pair connections (Jaccard ≥ ${(similarityThreshold / 10).toFixed(2)})`
              : `${stats.totalPathways} pathways | ${stats.totalGenes} genes | ${stats.significantCount} significant (FDR < 0.05) | ${stats.edges} pathway-pair connections (Jaccard ≥ ${(similarityThreshold / 10).toFixed(2)})`}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 0.5 }}>
            {viewMode === "genes"
              ? "Genes are nodes. Edges (Jaccard similarity) connect genes that share pathways. Color indicates pathway significance."
              : "Pathways are nodes. Edges (Jaccard similarity) connect pathways that share genes. Color indicates significance."}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", alignItems: "center" }}>
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel>View Mode</InputLabel>
            <Select
              value={viewMode}
              label="View Mode"
              onChange={(e) => setViewMode(e.target.value as "genes" | "pathways")}
            >
              <MenuItem value="genes">Genes (Nodes)</MenuItem>
              <MenuItem value="pathways">Pathways (Nodes)</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Layout</InputLabel>
            <Select
              value={layoutType}
              label="Layout"
              onChange={(e) => setLayoutType(e.target.value as LayoutType)}
            >
              <MenuItem value="force">Force-Directed</MenuItem>
              <MenuItem value="circular">Circular</MenuItem>
              <MenuItem value="grid">Grid</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 130 }}>
            <InputLabel>Node Size</InputLabel>
            <Select
              value={sizeBy}
              label="Node Size"
              onChange={(e) => setSizeBy(e.target.value as typeof sizeBy)}
            >
              <MenuItem value="significance">Significance</MenuItem>
              <MenuItem value="pathwaySize">Pathway Size</MenuItem>
              <MenuItem value="geneCount">Gene Count</MenuItem>
            </Select>
          </FormControl>

          <Box sx={{ width: 150 }}>
            <Typography variant="caption" color="text.secondary">
              Jaccard Similarity: {(similarityThreshold / 10).toFixed(2)}
            </Typography>
            <Slider
              value={similarityThreshold}
              onChange={(_, value) => setSimilarityThreshold(value as number)}
              min={1}
              max={10}
              step={1}
              size="small"
            />
          </Box>
        </Box>
      </Box>

      {/* Legend */}
      <Box sx={{ display: "flex", gap: 3, mb: 2, flexWrap: "wrap" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Box
            sx={{
              width: 14,
              height: 14,
              bgcolor: "#4caf50",
              borderRadius: "50%",
              border: "2px solid #2e7d32",
            }}
          />
          <Typography variant="caption">FDR &lt; 0.01</Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Box
            sx={{
              width: 14,
              height: 14,
              bgcolor: "#8bc34a",
              borderRadius: "50%",
              border: "2px solid #558b2f",
            }}
          />
          <Typography variant="caption">FDR &lt; 0.05</Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Box
            sx={{
              width: 14,
              height: 14,
              bgcolor: "#ff9800",
              borderRadius: "50%",
              border: "2px solid #ef6c00",
            }}
          />
          <Typography variant="caption">FDR &lt; 0.1</Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Box
            sx={{
              width: 14,
              height: 14,
              bgcolor: "#ffcc80",
              borderRadius: "50%",
              border: "2px solid #ff9800",
            }}
          />
          <Typography variant="caption">FDR &lt; 0.25</Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Box sx={{ width: 30, height: 3, bgcolor: "#90caf9", borderRadius: 1 }} />
          <Typography variant="caption">Edge = shared genes</Typography>
        </Box>
      </Box>

      <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 1 }}>
        Tip: Hover over nodes to see pathway details. Hover over edges to see shared genes. Drag to
        pan, scroll to zoom.
      </Typography>

      <Box
        ref={containerRef}
        sx={{
          width: "100%",
          height: 600,
          border: "1px solid #e0e0e0",
          borderRadius: 1,
          backgroundColor: "#fafafa",
          overflow: "hidden",
        }}
      />
    </Paper>
  );
}

export default ResultsEnrichmentMap;
