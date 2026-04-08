import { Box, Typography } from "@mui/material";

export function EnrichmentMapLegend() {
  return (
    <Box sx={{ display: "flex", gap: 3, mb: 2, flexWrap: "wrap" }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Box
          sx={{
            width: 14,
            height: 14,
            bgcolor: "#4caf50",
            borderRadius: "50%",
            border: "2px solid #2e7d32",
          }}
        />
        <Typography variant="caption">FDR &lt; 0.01</Typography>
      </Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Box
          sx={{
            width: 14,
            height: 14,
            bgcolor: "#8bc34a",
            borderRadius: "50%",
            border: "2px solid #558b2f",
          }}
        />
        <Typography variant="caption">FDR &lt; 0.05</Typography>
      </Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Box
          sx={{
            width: 14,
            height: 14,
            bgcolor: "#ff9800",
            borderRadius: "50%",
            border: "2px solid #ef6c00",
          }}
        />
        <Typography variant="caption">FDR &lt; 0.1</Typography>
      </Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Box
          sx={{
            width: 14,
            height: 14,
            bgcolor: "#ffcc80",
            borderRadius: "50%",
            border: "2px solid #ff9800",
          }}
        />
        <Typography variant="caption">FDR &lt; 0.25</Typography>
      </Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Box sx={{ width: 30, height: 3, bgcolor: "#90caf9", borderRadius: 1 }} />
        <Typography variant="caption">
          Edge = gene overlap (functional theme)
        </Typography>
      </Box>
    </Box>
  );
}
