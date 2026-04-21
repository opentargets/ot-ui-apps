import { faChartPie, faHexagonNodes, faSitemap, faTableColumns } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import { useState } from "react";
import type { GseaResult, InputOverlap } from "../api/gseaApi";
import ResultsPlotlySunburst from "./ResultsPlotlySunburst";
import ResultsTable from "./ResultsTable";
import ResultsTreeView from "./ResultsTreeView";
import {ResultsEnrichmentMap} from "./ResultsEnrichmentMap/";

type ViewMode = "table" | "tree" | "plotly" | "network";

interface AnalysisResultsProps {
  results: GseaResult[];
  inputOverlap: InputOverlap | null;
  onReset: () => void;
  activeRunId?: string | null;
}

function AnalysisResults({ results, inputOverlap, onReset, activeRunId }: AnalysisResultsProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("table");

  const handleViewChange = (_: React.MouseEvent<HTMLElement>, newMode: ViewMode | null) => {
    if (newMode) {
      setViewMode(newMode);
    }
  };

  const significantCount = results.filter((r) => r.FDR < 0.05).length;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%", flex: 1 }}>
      {/* Fixed header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: 2,
          borderBottom: "1px solid",
          borderColor: "divider",
          flexShrink: 0,
        }}
      >
        <Box sx={{ width: "fit-content" }}>
          <Typography variant="h6">Analysis Complete</Typography>
          <Typography variant="body2" color="text.secondary">
            {results.length} enriched pathways ({significantCount} significant at FDR {"<"} 0.05)
            {inputOverlap && ` · ${inputOverlap.used_count} (${inputOverlap.used_percent}%) of ${inputOverlap.total_input} input genes used`}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <ToggleButtonGroup value={viewMode} exclusive onChange={handleViewChange} size="small">
            <ToggleButton value="table">
              <FontAwesomeIcon icon={faTableColumns} style={{ marginRight: 6 }} />
              Table
            </ToggleButton>
            <ToggleButton value="tree">
              <FontAwesomeIcon icon={faSitemap} style={{ marginRight: 6 }} />
              Tree view
            </ToggleButton>
            <ToggleButton value="plotly">
              <FontAwesomeIcon icon={faChartPie} style={{ marginRight: 6 }} />
              Sunburst
            </ToggleButton>
            <ToggleButton value="network">
              <FontAwesomeIcon icon={faHexagonNodes} style={{ marginRight: 6 }} />
              Network view
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
      </Box>

      {/* Scrollable content */}
      <Box sx={{ flex: 1, overflow: "auto", p: viewMode === "plotly" ? 0 : 2 }}>
        {viewMode === "table" && <ResultsTable results={results} />}
        {viewMode === "tree" && <ResultsTreeView results={results} />}
        {/* {viewMode === "plotly" && <ResultsSunburst results={results} />} */}
        {viewMode === "plotly" && <ResultsPlotlySunburst key={activeRunId} results={results} />}
        {viewMode === "network" && <ResultsEnrichmentMap results={results} />}
      </Box>
    </Box>
  );
}

export default AnalysisResults;
