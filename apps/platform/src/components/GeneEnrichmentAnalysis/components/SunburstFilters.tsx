import { faChevronDown, faChevronUp, faFilter } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Autocomplete,
  Box,
  Button,
  Chip,
  Collapse,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  Slider,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { useMemo, useState } from "react";
import type { GseaResult } from "../api/gseaApi";

export interface PathwayFilters {
  searchText: string;
  selectedCategories: string[];
  nesRange: [number, number];
  pValueThreshold: number;
  fdrThreshold: number;
  showSignificantOnly: boolean;
}

interface SunburstFiltersProps {
  results: GseaResult[];
  filters: PathwayFilters;
  onFiltersChange: (filters: PathwayFilters) => void;
  filteredCount: number;
}

function SunburstFilters({
  results,
  filters,
  onFiltersChange,
  filteredCount,
}: SunburstFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Extract unique pathway categories from pathway names
  const pathwayCategories = useMemo(() => {
    const categories = new Set<string>();

    results.forEach((pathway) => {
      const pathwayName = pathway.Pathway || "";
      if (pathwayName) {
        const parts = pathwayName.split(" ");
        if (parts.length > 2) {
          const category = parts.slice(0, 2).join(" ");
          categories.add(category);
        } else if (parts.length === 2) {
          categories.add(parts[0]);
        } else {
          categories.add(pathwayName);
        }
      }
    });

    return Array.from(categories).sort();
  }, [results]);

  // Get NES range for slider
  const nesDataRange = useMemo(() => {
    const nesValues = results.map((p) => p.NES || 0);
    return {
      min: Math.min(...nesValues),
      max: Math.max(...nesValues),
    };
  }, [results]);

  const handleSearchTextChange = (value: string) => {
    onFiltersChange({ ...filters, searchText: value });
  };

  const handleCategoriesChange = (value: string[]) => {
    onFiltersChange({ ...filters, selectedCategories: value });
  };

  const handleNESRangeChange = (value: [number, number]) => {
    onFiltersChange({ ...filters, nesRange: value });
  };

  const handlePValueThresholdChange = (value: number) => {
    onFiltersChange({ ...filters, pValueThreshold: value });
  };

  const handleFDRThresholdChange = (value: number) => {
    onFiltersChange({ ...filters, fdrThreshold: value });
  };

  const handleSignificantOnlyChange = (checked: boolean) => {
    onFiltersChange({ ...filters, showSignificantOnly: checked });
  };

  const handleResetFilters = () => {
    onFiltersChange({
      searchText: "",
      selectedCategories: [],
      nesRange: [nesDataRange.min, nesDataRange.max],
      pValueThreshold: 1.0,
      fdrThreshold: 1.0,
      showSignificantOnly: false,
    });
  };

  const hasActiveFilters =
    filters.searchText ||
    filters.selectedCategories.length > 0 ||
    filters.nesRange[0] !== nesDataRange.min ||
    filters.nesRange[1] !== nesDataRange.max ||
    filters.pValueThreshold < 1.0 ||
    filters.fdrThreshold < 1.0 ||
    filters.showSignificantOnly;

  return (
    <Box sx={{ borderBottom: "1px solid", borderColor: "divider" }}>
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
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <FontAwesomeIcon icon={faFilter} />
          <Typography variant="body2" fontWeight={500}>
            Filters
          </Typography>
          <Chip
            label={`${filteredCount} of ${results.length} pathways`}
            size="small"
            color={hasActiveFilters ? "primary" : "default"}
            variant={hasActiveFilters ? "filled" : "outlined"}
          />
          {hasActiveFilters && (
            <Button
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                handleResetFilters();
              }}
            >
              Reset
            </Button>
          )}
        </Box>
        <FontAwesomeIcon icon={isExpanded ? faChevronUp : faChevronDown} />
      </Box>

      {/* Collapsible filter content - horizontal layout */}
      <Collapse in={isExpanded}>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 3,
            px: 2,
            py: 2,
            backgroundColor: "grey.50",
          }}
        >
          {/* Search */}
          <Box sx={{ minWidth: 200, flex: "1 1 200px", maxWidth: 300 }}>
            <TextField
              fullWidth
              size="small"
              label="Search pathways"
              value={filters.searchText}
              onChange={(e) => handleSearchTextChange(e.target.value)}
              placeholder="Search by name or ID..."
            />
          </Box>

          {/* Categories */}
          <Box sx={{ minWidth: 200, flex: "1 1 200px", maxWidth: 350 }}>
            <Autocomplete
              multiple
              size="small"
              options={pathwayCategories}
              value={filters.selectedCategories}
              onChange={(_, newValue) => handleCategoriesChange(newValue)}
              renderInput={(params) => (
                <TextField {...params} label="Categories" placeholder="Select..." />
              )}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip {...getTagProps({ index })} key={option} label={option} size="small" />
                ))
              }
              limitTags={2}
            />
          </Box>

          {/* P-value threshold */}
          <Box sx={{ minWidth: 130, flex: "0 0 130px" }}>
            <FormControl fullWidth size="small">
              <InputLabel>P-value</InputLabel>
              <Select
                value={filters.pValueThreshold}
                onChange={(e) => handlePValueThresholdChange(e.target.value as number)}
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
          <Box sx={{ minWidth: 130, flex: "0 0 130px" }}>
            <FormControl fullWidth size="small">
              <InputLabel>FDR</InputLabel>
              <Select
                value={filters.fdrThreshold}
                onChange={(e) => handleFDRThresholdChange(e.target.value as number)}
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
          <Box sx={{ minWidth: 180, flex: "0 0 180px" }}>
            <Typography variant="caption" color="text.secondary">
              NES Range
            </Typography>
            <Slider
              size="small"
              value={filters.nesRange}
              onChange={(_, value) => handleNESRangeChange(value as [number, number])}
              valueLabelDisplay="auto"
              min={nesDataRange.min}
              max={nesDataRange.max}
              step={0.1}
              sx={{ mt: 1 }}
            />
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="caption">{filters.nesRange[0].toFixed(1)}</Typography>
              <Typography variant="caption">{filters.nesRange[1].toFixed(1)}</Typography>
            </Box>
          </Box>
        </Box>
      </Collapse>
    </Box>
  );
}

export default SunburstFilters;
