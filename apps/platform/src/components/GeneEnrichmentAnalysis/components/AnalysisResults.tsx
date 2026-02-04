import { Box, Button, Typography } from "@mui/material";
import type { GseaResult } from "../api/gseaApi";

interface AnalysisResultsProps {
  results: GseaResult[];
  onReset: () => void;
}

function AnalysisResults({ results, onReset }: AnalysisResultsProps) {
  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Analysis Complete
      </Typography>
      <Typography sx={{ mb: 2 }}>Found {results.length} enriched pathways</Typography>
      {/* TODO: Replace with proper results table/visualization */}
      <Box sx={{ maxHeight: 300, overflow: "auto", mb: 2 }}>
        {results.slice(0, 10).map((result, idx) => (
          <Box key={idx} sx={{ p: 1, borderBottom: "1px solid #eee" }}>
            <Typography variant="body2" fontWeight="bold">
              {result.term}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              NES: {result.nes?.toFixed(3)} | p-value: {result.pval?.toExponential(2)} | FDR:{" "}
              {result.fdr?.toExponential(2)}
            </Typography>
          </Box>
        ))}
      </Box>
      <Button variant="outlined" onClick={onReset}>
        Run new analysis
      </Button>
    </Box>
  );
}

export default AnalysisResults;
