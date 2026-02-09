import { Box } from "@mui/material";
import { useMemo, useState } from "react";
import type { GseaResult } from "../api/gseaApi";
import PlotlySunburstChart from "./PlotlySunburstChart";
import SunburstFilters, { type PathwayFilters } from "./SunburstFilters";

interface ResultsPlotlySunburstProps {
  results: GseaResult[];
}

function ResultsPlotlySunburst({ results }: ResultsPlotlySunburstProps) {
  // Get initial NES range from data
  const nesDataRange = useMemo(() => {
    const nesValues = results.map((r) => r.NES || 0);
    return {
      min: Math.min(...nesValues),
      max: Math.max(...nesValues),
    };
  }, [results]);

  const [filters, setFilters] = useState<PathwayFilters>({
    searchText: "",
    selectedCategories: [],
    nesRange: [nesDataRange.min, nesDataRange.max],
    pValueThreshold: 1.0,
    fdrThreshold: 1.0,
    showSignificantOnly: false,
  });

  // Filter pathways based on current filters
  const filteredResults = useMemo(() => {
    return results.filter((pathway) => {
      // Search text filter
      if (filters.searchText) {
        const pathwayName = pathway.Pathway || "";
        const pathwayId = pathway.ID || "";
        const searchLower = filters.searchText.toLowerCase();
        if (
          !pathwayName.toLowerCase().includes(searchLower) &&
          !pathwayId.toLowerCase().includes(searchLower)
        ) {
          return false;
        }
      }

      // Category filter
      if (filters.selectedCategories.length > 0) {
        const pathwayName = pathway.Pathway || "";
        const matchesCategory = filters.selectedCategories.some((category) =>
          pathwayName.includes(category)
        );
        if (!matchesCategory) {
          return false;
        }
      }

      // NES range filter
      const nes = pathway.NES || 0;
      if (nes < filters.nesRange[0] || nes > filters.nesRange[1]) {
        return false;
      }

      // P-value threshold filter
      const pValue = pathway["p-value"] || 1;
      if (pValue > filters.pValueThreshold) {
        return false;
      }

      // FDR threshold filter
      const fdr = pathway.FDR || 1;
      if (fdr > filters.fdrThreshold) {
        return false;
      }

      // Show significant only filter
      if (filters.showSignificantOnly && pValue >= 0.05) {
        return false;
      }

      return true;
    });
  }, [results, filters]);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <SunburstFilters
        results={results}
        filters={filters}
        onFiltersChange={setFilters}
        filteredCount={filteredResults.length}
      />
      <Box sx={{ flex: 1, overflow: "auto", p: 2 }}>
        <PlotlySunburstChart results={filteredResults} />
      </Box>
    </Box>
  );
}

export default ResultsPlotlySunburst;
