import { Box, FormControl, InputLabel, MenuItem, Select, Slider, Typography, TextField, InputAdornment, Autocomplete } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faXmark, faChevronUp, faChevronDown, faFilter } from "@fortawesome/free-solid-svg-icons";
import { useContext, useState, useMemo } from "react";
import { EnrichmentMapControlsContext } from "../utils/EnrichmentMapControlsContext";

interface EnrichmentMapControlsProps {
  isGoData?: boolean;
  pathwayNames?: string[];
  geneNames?: string[];
  onToggleCollapsed?: (isCollapsed: boolean) => void;
}

export function EnrichmentMapControls({
  pathwayNames = [],
  geneNames = [],
  onToggleCollapsed,
}: EnrichmentMapControlsProps) {
  const controlsContext = useContext(EnrichmentMapControlsContext);
  if (!controlsContext) {
    throw new Error("EnrichmentMapControls must be used within EnrichmentMapControlsProvider");
  }
  const { state, dispatch } = controlsContext;
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Combine and deduplicate pathway and gene names for autocomplete
  const searchOptions = useMemo(() => {
    const allNames = [...new Set([...geneNames, ...pathwayNames])].sort();
    return allNames;
  }, [geneNames, pathwayNames]);

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
        onClick={() => {
          const newCollapsedState = !isCollapsed;
          setIsCollapsed(newCollapsedState);
          onToggleCollapsed?.(newCollapsedState);
        }}
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

            {/* Similarity */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, width: 220 }}>
              <Typography variant="caption" color="text.secondary" sx={{ whiteSpace: "nowrap" }}>
                Similarity
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

          {/* Right column: Gene Search */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, minWidth: "auto" }}>
            {/* Gene/Pathway Search with Autocomplete */}
            <Box sx={{ width: 240 }}>
              <Autocomplete
                options={searchOptions}
                value={state.searchQuery}
                onChange={(_, newValue) => dispatch({ type: "SET_SEARCH_QUERY", payload: newValue?.toUpperCase() || "" })}
                inputValue={state.searchQuery}
                onInputChange={(_, newInputValue) => dispatch({ type: "SET_SEARCH_QUERY", payload: newInputValue.toUpperCase() })}
                freeSolo
                size="small"
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Search gene or pathway..."
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <>
                          <InputAdornment position="start">
                            <FontAwesomeIcon icon={faSearch} style={{ color: "#999", fontSize: "13px" }} />
                          </InputAdornment>
                          {params.InputProps.startAdornment}
                        </>
                      ),
                      endAdornment: state.searchQuery && (
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
                            onClick={() => dispatch({ type: "SET_SEARCH_QUERY", payload: "" })}
                          />
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
}
