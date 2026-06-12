import { Box, Typography } from "@mui/material";
import { alphaFoldConfidenceBands } from "@ot/constants";

export default function AlphaFoldLegend({ showTitle = true }) {
  return (
    <Box display="flex">
      <Box display="flex" flexDirection="column" gap={0.75} pt={0.5}>
        {showTitle && <Typography variant="subtitle2">Model Confidence</Typography>}
        <Box display="flex" gap={3.5}>
          {alphaFoldConfidenceBands
            .map(({ label, sublabel, color }) => (
              <Box key={label}>
                <Box display="flex" gap={0.75} alignItems="center">
                  <Box width="11px" height="11px" bgcolor={color} borderRadius="2px" />
                  <Box display="flex" flexDirection="column">
                    <Typography variant="caption" fontWeight={500} lineHeight={1}>
                      {label}
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="caption" fontSize={11.5} lineHeight={1}>
                  {sublabel}
                </Typography>
              </Box>
            ))
            .reverse()}
        </Box>

        <Typography variant="caption" mt={1}>
          AlphaFold produces a per-residue model confidence score (pLDDT) between 0 and 100. Some
          regions below 50 pLDDT may be unstructured in isolation.
        </Typography>
      </Box>
    </Box>
  );
}
