import { Box, Typography } from "@mui/material";
import { useMemo } from "react";
// @ts-ignore - Plotly types are complex
import Plotly from "plotly.js-dist";
// @ts-ignore
import createPlotlyComponent from "react-plotly.js/factory";
import type { GseaResult } from "../api/gseaApi";
import { mapToPrioritizationColor, PRIORITISATION_COLORS, ROOT_NODE_COLOR } from "../utils/colorPalettes";
import { buildPathwayHierarchy, getEffectiveRootPathways } from "../utils/pathwayHierarchy";

const Plot = createPlotlyComponent(Plotly);

interface PlotlySunburstChartProps {
  results: GseaResult[];
  height?: number;
}

interface SunburstData {
  ids: string[];
  labels: string[];
  parents: string[];
  values: number[];
  customdata: any[];
  marker: {
    colors: string[];
    line: { color: string; width: number };
  };
}

function PlotlySunburstChart({ results, height = 600 }: PlotlySunburstChartProps) {
  // Build sunburst data
  const sunburstData = useMemo(() => {
    if (results.length === 0) return null;

    const { pathwayMap, childrenMap } = buildPathwayHierarchy(results);
    const rootPathways = getEffectiveRootPathways(results);

    // Collect all NES values for color scaling
    const nesValues = results.map((r) => r.NES || 0);
    const minNES = Math.min(...nesValues);
    const maxNES = Math.max(...nesValues);

    const data: SunburstData = {
      ids: [],
      labels: [],
      parents: [],
      values: [],
      customdata: [],
      marker: {
        colors: [],
        line: { color: "#fff", width: 1 },
      },
    };

    // Add root node
    data.ids.push("root");
    data.labels.push("All Pathways");
    data.parents.push("");
    data.values.push(0); // Will be calculated as sum of children with remainder mode
    data.customdata.push({ type: "root", count: results.length });
    data.marker.colors.push(ROOT_NODE_COLOR);

    const processedIds = new Set<string>();

    // Add pathway node - using a constant value of 1 for leaf nodes
    // With branchvalues="remainder", parent values are added to children sum
    const addPathwayNode = (pathway: GseaResult, parentId: string): number => {
      const id = pathway.ID || "";
      if (!id || processedIds.has(id)) return 0;
      processedIds.add(id);

      const nes = pathway.NES || 0;
      const pValue = pathway["p-value"] || 1;
      const genes = pathway["Leading edge genes"] || "";
      const geneList = genes.split(",").map((g) => g.trim()).filter(Boolean);

      // Get children first to determine if this is a leaf
      const children = childrenMap.get(id) || [];
      const childPathways = children
        .map((childId) => pathwayMap.get(childId))
        .filter(Boolean) as GseaResult[];

      // For leaf nodes, use 1 as value
      // For parent nodes, value will be added to children's sum (remainder mode)
      const isLeaf = childPathways.length === 0;
      const value = isLeaf ? 1 : 0;

      data.ids.push(id);
      data.labels.push(pathway.Pathway || id);
      data.parents.push(parentId);
      data.values.push(value);
      data.customdata.push({
        type: "pathway",
        id,
        pathway: pathway.Pathway,
        nes,
        pValue,
        fdr: pathway.FDR,
        pathwaySize: pathway["Pathway size"],
        matchedGenes: pathway["Number of input genes"],
        genes: geneList,
      });
      data.marker.colors.push(mapToPrioritizationColor(nes, minNES, maxNES));

      // Add children
      childPathways.forEach((childPathway) => {
        addPathwayNode(childPathway, id);
      });

      return value;
    };

    // Add root pathways
    rootPathways.forEach((pathway) => {
      addPathwayNode(pathway, "root");
    });

    return data;
  }, [results]);

  // NES range for legend
  const nesRange = useMemo(() => {
    const nesValues = results.map((r) => r.NES || 0);
    return {
      min: Math.min(...nesValues),
      max: Math.max(...nesValues),
    };
  }, [results]);

  if (!sunburstData || results.length === 0) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <Typography color="text.secondary">No pathways to display.</Typography>
      </Box>
    );
  }

  // Check if hierarchy data exists
  const hasHierarchy = results.some((r) => r["Parent pathway"]);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {!hasHierarchy && (
        <Box sx={{ p: 1, backgroundColor: "warning.light", borderRadius: 1, mb: 1 }}>
          <Typography variant="body2" color="warning.dark">
            No hierarchy data available. Displaying flat structure.
          </Typography>
        </Box>
      )}
      <Box sx={{ flex: 1, minHeight: height }}>
        <Plot
          data={[
            {
              type: "sunburst",
              ids: sunburstData.ids,
              labels: sunburstData.labels,
              parents: sunburstData.parents,
              values: sunburstData.values,
              customdata: sunburstData.customdata,
              marker: sunburstData.marker,
              branchvalues: "remainder",
              hovertemplate:
                "<b>%{label}</b><br>" +
                "NES: %{customdata.nes:.3f}<br>" +
                "p-value: %{customdata.pValue:.2e}<br>" +
                "FDR: %{customdata.fdr:.2e}<br>" +
                "Pathway size: %{customdata.pathwaySize}<br>" +
                "Matched genes: %{customdata.matchedGenes}<br>" +
                "<extra></extra>",
              textinfo: "label",
              insidetextorientation: "radial",
            },
          ]}
          layout={{
            margin: { l: 0, r: 0, t: 10, b: 10 },
            sunburstcolorway: PRIORITISATION_COLORS,
            extendsunburstcolors: true,
          }}
          config={{
            displayModeBar: true,
            modeBarButtonsToRemove: ["pan2d", "lasso2d", "select2d"],
            displaylogo: false,
            responsive: true,
          }}
          style={{ width: "100%", height: "100%" }}
          useResizeHandler
        />
      </Box>
      {/* Color legend */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
          py: 2,
          borderTop: "1px solid",
          borderColor: "divider",
        }}
      >
        <Typography variant="caption" color="text.secondary">
          NES: {nesRange.min.toFixed(2)}
        </Typography>
        <Box
          sx={{
            width: 150,
            height: 12,
            background: `linear-gradient(to right, ${PRIORITISATION_COLORS[0]}, ${PRIORITISATION_COLORS[Math.floor(PRIORITISATION_COLORS.length / 2)]}, ${PRIORITISATION_COLORS[PRIORITISATION_COLORS.length - 1]})`,
            borderRadius: 1,
          }}
        />
        <Typography variant="caption" color="text.secondary">
          {nesRange.max.toFixed(2)}
        </Typography>
      </Box>
    </Box>
  );
}

export default PlotlySunburstChart;
