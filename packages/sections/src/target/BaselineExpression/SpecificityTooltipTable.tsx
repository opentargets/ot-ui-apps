import { Box, Typography } from "@mui/material";
import { naLabel } from "@ot/constants";
import { TooltipRow, TooltipTable } from "ui";

function formatToPercent(v) {
  if (v === 0) return 0;
  if (v === 1) return 100;
  const pct = v * 100;
  if (Number.isInteger(pct)) return pct;
  return pct.toFixed(1);
}

function SpecificityTooltipTable({ data, specificityThreshold, groupByTissue, symbol }) {
  return (
    <>
      <TooltipTable>
        <TooltipRow label="Specificity score">
          <Box display="flex">
            {data.specificity_score == null ? naLabel : `${formatToPercent(data.specificity_score)}%`}
          </Box>
        </TooltipRow>
      </TooltipTable>
      {data.specificity_score >= specificityThreshold && (
        <Typography variant="caption">
          {symbol} is in the top {formatToPercent(1 - data.specificity_score)}% of specifically expressed genes for this{" "}
          {groupByTissue ? "tissue" : "cell type"}
        </Typography>
      )}
    </>
  );
}

export default SpecificityTooltipTable;
