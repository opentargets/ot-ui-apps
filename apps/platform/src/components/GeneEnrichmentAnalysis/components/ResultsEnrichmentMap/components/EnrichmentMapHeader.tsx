import { Box, Typography } from "@mui/material";
import type { Core as CytoscapeCore } from "cytoscape";
import type { ComputedStats } from "../utils";
import { ExportButtons } from "./ExportButtons";

interface EnrichmentMapHeaderProps {
  stats: ComputedStats;
  cyRef?: React.MutableRefObject<CytoscapeCore | null>;
}

export function EnrichmentMapHeader({ stats, cyRef }: EnrichmentMapHeaderProps) {
  return (
    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 2 }}>
      <Box sx={{ flex: 1 }}>
        <Typography variant="h6" gutterBottom>
          Pathway Network (Hierarchy not visualized)
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {`${stats.displayedPathways || stats.totalPathways} of ${stats.totalPathways} gene-sets organized into clusters | ${stats.totalGenes} unique genes  | ${stats.edges} functional theme connections`}
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 0.5 }}>
          Gene-sets are organized in a network where edges represent gene overlap. Related gene-sets automatically cluster together, enabling quick identification of enriched functional themes.
        </Typography>
      </Box>
      {cyRef && <Box sx={{ ml: "auto" }}><ExportButtons cyRef={cyRef} /></Box>}
    </Box>
  );
}
