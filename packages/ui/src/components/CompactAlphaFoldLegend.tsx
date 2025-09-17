import { Box, Typography } from "@mui/material";
import { alphaFoldConfidenceBands } from "@ot/constants";
import { DetailPopover, AlphaFoldLegend } from "ui";

export default function CompactAlphaFoldLegend({ showTitle = true }) {
  return (
    <Box sx={{ display: "flex", gap: 1, justifyContent: "end", alignItems: "center" }}>
      <Box sx={{ display: "flex", gap: 1, alignItems: "end" }}>
        {showTitle && <Typography variant="caption">AlphaFold model confidence:</Typography>}
        <Box sx={{ display: "flex", gap: 0.75, alignItems: "center" }}>
          <Typography variant="caption">low</Typography>
          <Box sx={{ display: "flex", gap: 0.4, alignItems: "end" }}>
            {alphaFoldConfidenceBands
              .map(({ color }) => (
                <Box key={color} borderRadius="2px" width="11px" height="11px" bgcolor={color} />
              ))
              .reverse()}
          </Box>
          <Typography variant="caption">high</Typography>
        </Box>
      </Box>
      <Box sx={{ width: "10px" }}>
        <DetailPopover title="">
          <Box sx={{ maxWidth: "520px" }}>
            <AlphaFoldLegend showTitle={false} />
          </Box>
        </DetailPopover>
      </Box>
    </Box>
  );
}
