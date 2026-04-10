import { Box, Typography } from "@mui/material";
import type { ComputedStats } from "../utils";

interface EnrichmentMapHeaderProps {
  stats: ComputedStats;
  viewMode: "genes" | "pathways";
}

export function EnrichmentMapHeader({
  stats,
  viewMode,
}: EnrichmentMapHeaderProps) {
  if (viewMode === "genes") {
    return (
      <Box>
        <Typography variant="h6" gutterBottom>
          Gene Network
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {`${stats.totalGenes} genes from ${stats.totalPathways} pathways | ${stats.significantCount} significant pathways (FDR < 0.05) | ${stats.edges} gene connections`}
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 0.5 }}>
          Genes are organized in a network where edges represent co-occurrence in pathways. Related genes automatically cluster together to reveal functional modules.
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Pathway Network
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {`${stats.displayedPathways || stats.totalPathways} of ${stats.totalPathways} gene-sets organized into clusters | ${stats.totalGenes} unique genes | ${stats.significantCount} significant (FDR < 0.05) | ${stats.edges} functional theme connections`}
      </Typography>
      <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 0.5 }}>
        Gene-sets are organized in a network where edges represent gene overlap. Related gene-sets automatically cluster together, enabling quick identification of enriched functional themes.
      </Typography>
    </Box>
  );
}
