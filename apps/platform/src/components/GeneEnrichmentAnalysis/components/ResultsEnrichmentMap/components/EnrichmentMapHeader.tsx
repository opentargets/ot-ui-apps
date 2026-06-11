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
    <Box>
      {cyRef && <Box sx={{ ml: "auto" }}><ExportButtons cyRef={cyRef} /></Box>}
    </Box>
  );
}
