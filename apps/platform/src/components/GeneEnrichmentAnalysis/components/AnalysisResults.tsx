import { useState } from "react";
import { Box, Button, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import { faTableColumns, faSitemap } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { GseaResult } from "../api/gseaApi";
import ResultsTable from "./ResultsTable";
import ResultsTreeView from "./ResultsTreeView";

type ViewMode = "table" | "tree";

interface AnalysisResultsProps {
  results: GseaResult[];
  onReset: () => void;
}

function AnalysisResults({ results, onReset }: AnalysisResultsProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("table");

  const handleViewChange = (_: React.MouseEvent<HTMLElement>, newMode: ViewMode | null) => {
    if (newMode) {
      setViewMode(newMode);
    }
  };

  const significantCount = results.filter((r) => r.FDR < 0.05).length;

  return (
    <Box sx={{ p: 2 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Box>
          <Typography variant="h6">Analysis Complete</Typography>
          <Typography variant="body2" color="text.secondary">
            {results.length} enriched pathways ({significantCount} significant at FDR {"<"} 0.05)
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
              Tree View
            </ToggleButton>
          </ToggleButtonGroup>

          <Button variant="outlined" size="small" onClick={onReset}>
            New Analysis
          </Button>
        </Box>
      </Box>

      {viewMode === "table" && <ResultsTable results={results} />}
      {viewMode === "tree" && <ResultsTreeView results={results} />}
    </Box>
  );
}

export default AnalysisResults;
