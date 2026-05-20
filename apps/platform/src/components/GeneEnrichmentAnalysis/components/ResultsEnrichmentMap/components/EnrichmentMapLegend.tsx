import { Box, Typography } from "@mui/material";
import { PRIORITISATION_COLORS } from "../../../utils/colorPalettes";

interface EnrichmentMapLegendProps {
  nesRange?: { min: number; max: number };
}

export function EnrichmentMapLegend({ nesRange }: EnrichmentMapLegendProps) {
  const pathwayItems = (
    <>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Box>
          <Typography variant="caption" sx={{ fontWeight: 600, mb: 1, display: "block" }}>
            NES Score {nesRange && `(${nesRange.min.toFixed(2)} to ${nesRange.max.toFixed(2)})`}
          </Typography>
          <Box
            sx={{
              width: 200,
              height: 24,
              background: `linear-gradient(to right, ${PRIORITISATION_COLORS.join(", ")})`,
              border: "1px solid #ccc",
              borderRadius: "2px",
            }}
          />
          <Box sx={{ display: "flex", justifyContent: "space-between", gap: 0.5, mt: 0.5 }}>
            <Typography variant="caption" sx={{ fontSize: "0.65rem" }}>
              Negative
            </Typography>
            <Typography variant="caption" sx={{ fontSize: "0.65rem" }}>
              Positive
            </Typography>
          </Box>
        </Box>
      </Box>
      <Box>
        <Typography variant="caption" sx={{ fontWeight: 600, mb: 0.5, display: "block" }}>
          Edge Thickness = Similarity (Overlap Coefficient)
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.8, ml: 0.5 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box sx={{ width: 40, height: 1.2, bgcolor: "#90caf9", borderRadius: 1 }} />
            <Typography variant="caption" sx={{ fontSize: "0.75rem" }}>
              Low (0.1)
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box sx={{ width: 40, height: 2.5, bgcolor: "#90caf9", borderRadius: 1 }} />
            <Typography variant="caption" sx={{ fontSize: "0.75rem" }}>
              Medium (0.5)
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box sx={{ width: 40, height: 4, bgcolor: "#90caf9", borderRadius: 1 }} />
            <Typography variant="caption" sx={{ fontSize: "0.75rem" }}>
              High (0.9)
            </Typography>
          </Box>
        </Box>
      </Box>
    </>
  );

  return (
    <Box sx={{ display: "flex", gap: 3, mb: 2, flexWrap: "wrap" }}>
      {pathwayItems}
    </Box>
  );
}
