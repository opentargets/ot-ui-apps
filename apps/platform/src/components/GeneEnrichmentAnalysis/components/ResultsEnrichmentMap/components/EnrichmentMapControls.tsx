import { Box, FormControl, InputLabel, MenuItem, Select, Slider, Typography } from "@mui/material";

interface EnrichmentMapControlsProps {
  viewMode: "genes" | "pathways";
  sizeBy: "significance" | "pathwaySize" | "geneCount";
  similarityThreshold: number;
  onViewModeChange: (viewMode: "genes" | "pathways") => void;
  onSizeByChange: (sizeBy: "significance" | "pathwaySize" | "geneCount") => void;
  onSimilarityThresholdChange: (value: number) => void;
}

export function EnrichmentMapControls({
  viewMode,
  sizeBy,
  similarityThreshold,
  onViewModeChange,
  onSizeByChange,
  onSimilarityThresholdChange,
}: EnrichmentMapControlsProps) {
  return (
    <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", alignItems: "center" }}>
      <FormControl size="small" sx={{ minWidth: 130 }}>
        <InputLabel>View</InputLabel>
        <Select value={viewMode} label="View" onChange={(e) => onViewModeChange(e.target.value as typeof viewMode)}>
          <MenuItem value="pathways">Pathway Network</MenuItem>
          <MenuItem value="genes">Gene Network</MenuItem>
        </Select>
      </FormControl>

      <FormControl size="small" sx={{ minWidth: 130 }}>
        <InputLabel>Node Size</InputLabel>
        <Select value={sizeBy} label="Node Size" onChange={(e) => onSizeByChange(e.target.value as typeof sizeBy)}>
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
          onChange={(_, value) => onSimilarityThresholdChange(value as number)}
          min={1}
          max={10}
          step={1}
          size="small"
        />
      </Box>
    </Box>
  );
}
