import { Box, FormControl, InputLabel, MenuItem, Select, Slider, Typography, TextField, InputAdornment, Button, Chip } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faXmark, faChevronUp, faChevronDown, faRoute, faFilter } from "@fortawesome/free-solid-svg-icons";
import { useContext, useState } from "react";
import { EnrichmentMapControlsContext } from "../utils/EnrichmentMapControlsContext";

interface EnrichmentMapControlsProps {
  onOpenPathwaySelection?: () => void;
  isGoData?: boolean;
}

export function EnrichmentMapControls({
  onOpenPathwaySelection,
}: EnrichmentMapControlsProps) {
  const controlsContext = useContext(EnrichmentMapControlsContext);
  if (!controlsContext) {
    throw new Error("EnrichmentMapControls must be used within EnrichmentMapControlsProvider");
  }
  const { state, dispatch } = controlsContext;
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <Box sx={{ borderBottom: "1px solid", borderColor: "divider", backgroundColor: "white" }}>
      {/* Filter header - always visible */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 2,
          py: 1,
          cursor: "pointer",
          "&:hover": { backgroundColor: "action.hover" },
        }}
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <FontAwesomeIcon icon={faFilter} />
          <Typography variant="body2" fontWeight={500}>
            Filters
          </Typography>
        </Box>
        <FontAwesomeIcon icon={isCollapsed ? faChevronDown : faChevronUp} />
      </Box>

      {/* Collapsible filter content */}
      {!isCollapsed && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            gap: 3,
            px: 2,
            py: 2,
            backgroundColor: "grey.50",
          }}
        >
          {/* Left column: P-value, FDR, NES, Jaccard, Node Size */}
          <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", gap: 2, flex: 1 }}>
            {/* P-value threshold */}
            <Box sx={{ width: 120 }}>
              <FormControl fullWidth size="small">
                <InputLabel>P-value</InputLabel>
                <Select
                  value={state.pValueThreshold || 1.0}
                  onChange={(e) => dispatch({ type: "SET_P_VALUE_THRESHOLD", payload: e.target.value as number })}
                  label="P-value"
                >
                  <MenuItem value={0.001}>≤ 0.001</MenuItem>
                  <MenuItem value={0.01}>≤ 0.01</MenuItem>
                  <MenuItem value={0.05}>≤ 0.05</MenuItem>
                  <MenuItem value={0.1}>≤ 0.1</MenuItem>
                  <MenuItem value={1.0}>All</MenuItem>
                </Select>
              </FormControl>
            </Box>

            {/* FDR threshold */}
            <Box sx={{ width: 120 }}>
              <FormControl fullWidth size="small">
                <InputLabel>FDR</InputLabel>
                <Select
                  value={state.fdrThreshold}
                  onChange={(e) => dispatch({ type: "SET_FDR_THRESHOLD", payload: e.target.value as number })}
                  label="FDR"
                >
                  <MenuItem value={0.001}>≤ 0.001</MenuItem>
                  <MenuItem value={0.01}>≤ 0.01</MenuItem>
                  <MenuItem value={0.05}>≤ 0.05</MenuItem>
                  <MenuItem value={0.1}>≤ 0.1</MenuItem>
                  <MenuItem value={1.0}>All</MenuItem>
                </Select>
              </FormControl>
            </Box>

            {/* NES Range */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, width: 240 }}>
              <Typography variant="caption" color="text.secondary" sx={{ whiteSpace: "nowrap" }}>
                NES
              </Typography>
              <Typography variant="caption" fontSize="0.65rem" color="text.secondary">
                {state.nesRange[0].toFixed(1)}
              </Typography>
              <Slider
                size="small"
                value={state.nesRange}
                onChange={(_, value) => dispatch({ type: "SET_NES_RANGE", payload: value as [number, number] })}
                valueLabelDisplay="auto"
                min={state.nesDataRange.min}
                max={state.nesDataRange.max}
                step={0.1}
              />
              <Typography variant="caption" fontSize="0.65rem" color="text.secondary">
                {state.nesRange[1].toFixed(1)}
              </Typography>
            </Box>

            {/* Jaccard/Similarity */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, width: 220 }}>
              <Typography variant="caption" color="text.secondary" sx={{ whiteSpace: "nowrap" }}>
                Jaccard
              </Typography>
              <Typography variant="caption" fontSize="0.65rem" color="text.secondary">
                {(state.similarityThreshold / 10).toFixed(2)}
              </Typography>
              <Slider
                size="small"
                value={state.similarityThreshold}
                onChange={(_, value) => dispatch({ type: "SET_SIMILARITY_THRESHOLD", payload: value as number })}
                valueLabelDisplay="auto"
                min={1}
                max={10}
                step={1}
              />
            </Box>

            {/* Node Size */}
            <Box sx={{ width: 140 }}>
              <FormControl size="small" fullWidth>
                <InputLabel>Node Size</InputLabel>
                <Select 
                  value={state.sizeBy} 
                  label="Node Size" 
                  onChange={(e) => dispatch({ type: "SET_SIZE_BY", payload: e.target.value as typeof state.sizeBy })}
                >
                  <MenuItem value="pathwaySize">Pathway Size</MenuItem>
                  <MenuItem value="geneCount">Gene Count</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>

          {/* Right column: Gene Search and Pathway Path Button */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, minWidth: "auto" }}>
            {/* Gene Search */}
            <Box sx={{ width: 180 }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Search gene..."
                value={state.searchGene}
                onChange={(e) => dispatch({ type: "SET_SEARCH_GENE", payload: e.target.value.toUpperCase() })}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FontAwesomeIcon icon={faSearch} style={{ color: "#999", fontSize: "13px" }} />
                    </InputAdornment>
                  ),
                  endAdornment: state.searchGene && (
                    <InputAdornment position="end">
                      <FontAwesomeIcon
                        icon={faXmark}
                        style={{
                          cursor: "pointer",
                          color: "#999",
                          fontSize: "13px",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = "#000")}
                        onMouseLeave={(e) => (e.currentTarget.style.color = "#999")}
                        onClick={() => dispatch({ type: "SET_SEARCH_GENE", payload: "" })}
                      />
                    </InputAdornment>
                  ),
                }}
              />

              {state.searchGene && (
                <Box sx={{ mt: 0.75 }}>
                  <Chip
                    label={state.useGeneCentricPaths ? "🎯 Gene-Centric" : "🔍 Direct"}
                    onClick={() => dispatch({ type: "TOGGLE_GENE_CENTRIC_PATHS" })}
                    color={state.useGeneCentricPaths ? "primary" : "default"}
                    variant={state.useGeneCentricPaths ? "filled" : "outlined"}
                    size="small"
                    sx={{ width: "100%", fontSize: "9px" }}
                  />
                </Box>
              )}
            </Box>

            {/* Pathway Path Button */}
            <Button
              variant="outlined"
              size="small"
              startIcon={<FontAwesomeIcon icon={faRoute} style={{ fontSize: "11px" }} />}
              onClick={onOpenPathwaySelection}
              sx={{
                textTransform: "none",
                fontSize: "11px",
                whiteSpace: "nowrap",
                height: "40px",
              }}
            >
              Pathway Path
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
}
