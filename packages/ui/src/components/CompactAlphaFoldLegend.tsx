import { Box, Typography } from "@mui/material";
import { alphaFoldConfidenceBands } from "@ot/constants";
import { DetailPopover, AlphaFoldLegend } from "ui";

export default function CompactAlphaFoldLegend() {
  return (
    <Box sx={{ display: "flex", gap: 1, justifyContent: "end", alignItems: "center" }}>
      <Box sx={{ display: "flex", gap: 1, alignItems: "end" }}>
        <Typography variant="caption">AlphaFold model confidence:</Typography>
        <Box sx={{ display: "flex", gap: 0.75, alignItems: "center" }}>
          <Typography variant="caption">high</Typography>
          <Box sx={{ display: "flex", gap: 0.4, alignItems: "end" }}>
            {alphaFoldConfidenceBands.map(({ color }) => (
              <Box borderRadius="2px" width="11px" height="11px" bgcolor={color} />
            ))}
          </Box>
          <Typography variant="caption">low</Typography>
        </Box>
      </Box>
      <Box sx={{ width: "10px" }}>
        <DetailPopover title="">
          <Box sx={{ maxWidth: "540px" }}>
            <AlphaFoldLegend showTitle={false} />
          </Box>
        </DetailPopover>
      </Box>
    </Box>
  );
}
