import { Box, FormControl, InputLabel, MenuItem, Select, Slider, Typography, TextField, InputAdornment, IconButton, Button, Chip } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faXmark, faChevronUp, faChevronDown, faRoute } from "@fortawesome/free-solid-svg-icons";
import { useContext, useState } from "react";
import { EnrichmentMapControlsContext } from "../utils/EnrichmentMapControlsContext";

interface EnrichmentMapControlsProps {
  onOpenPathwaySelection?: () => void;
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
    <Box
      sx={{
        position: "absolute",
        top: 16,
        right: 16,
        zIndex: 1000,
        backgroundColor: "white",
        border: "1px solid #ddd",
        borderRadius: "8px",
        padding: 2,
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
        maxWidth: 500,
        transition: "all 0.3s ease",
      }}
    >
      {/* Header with collapse button */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: isCollapsed ? 0 : 2 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
          Controls
        </Typography>
        <IconButton
          size="small"
          onClick={() => setIsCollapsed(!isCollapsed)}
          sx={{ padding: 0 }}
        >
          <FontAwesomeIcon
            icon={isCollapsed ? faChevronDown : faChevronUp}
            style={{ fontSize: "14px", color: "#666" }}
          />
        </IconButton>
      </Box>

      {/* Collapsible content */}
      {!isCollapsed && (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "2fr 1.5fr",
            gap: 2,
          }}
        >
          {/* Left column: Sliders */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Box>
              <Typography variant="caption" color="text.secondary">
                FDR: {state.fdrThreshold.toFixed(2)}
              </Typography>
              <Slider
                value={state.fdrThreshold}
                onChange={(_, value) => dispatch({ type: "SET_FDR_THRESHOLD", payload: value as number })}
                min={0.01}
                max={1}
                step={0.01}
                size="small"
                marks={[
                  { value: 0.01, label: "0.01" },
                  { value: 0.25, label: "0.25" },
                  { value: 1, label: "1" },
                ]}
              />
            </Box>

            <Box>
              <Typography variant="caption" color="text.secondary">
                NES: {state.nesRange[0].toFixed(1)} - {state.nesRange[1].toFixed(1)}
              </Typography>
              <Slider
                value={state.nesRange}
                onChange={(_, value) => {
                  dispatch({ type: "SET_NES_RANGE", payload: value as [number, number] });
                }}
                min={state.nesDataRange.min}
                max={state.nesDataRange.max}
                step={0.1}
                size="small"
              />
            </Box>

            <Box>
              <Typography variant="caption" color="text.secondary">
                Jaccard: {(state.similarityThreshold / 10).toFixed(2)}
              </Typography>
              <Slider
                value={state.similarityThreshold}
                onChange={(_, value) => dispatch({ type: "SET_SIMILARITY_THRESHOLD", payload: value as number })}
                min={1}
                max={10}
                step={1}
                size="small"
              />
            </Box>
          </Box>

          {/* Right column: Gene Search, Node Size, Pathway Path */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 1 }}>
                Gene Search
              </Typography>
              <TextField
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
                sx={{ width: "100%" }}
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

            <Box>
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

            <Button
              variant="outlined"
              size="small"
              startIcon={<FontAwesomeIcon icon={faRoute} style={{ fontSize: "11px" }} />}
              onClick={onOpenPathwaySelection}
              fullWidth
              sx={{
                textTransform: "none",
                fontSize: "11px",
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
