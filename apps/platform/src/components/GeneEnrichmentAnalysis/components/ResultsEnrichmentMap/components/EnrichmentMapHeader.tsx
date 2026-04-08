import { Box, Typography } from "@mui/material";
import type { ComputedStats } from "../utils";

interface EnrichmentMapHeaderProps {
  stats: ComputedStats;
}

export function EnrichmentMapHeader({
  stats,
}: EnrichmentMapHeaderProps) {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Pathway Network
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {`${stats.totalPathways} gene-sets organized into clusters | ${stats.totalGenes} unique genes | ${stats.significantCount} significant (FDR < 0.05) | ${stats.edges} functional theme connections`}
      </Typography>
      <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 0.5 }}>
        Gene-sets are organized in a network where edges represent gene overlap. Related gene-sets automatically cluster together, enabling quick identification of enriched functional themes.
      </Typography>
    </Box>
  );
}
