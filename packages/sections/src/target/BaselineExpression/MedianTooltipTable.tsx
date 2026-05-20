import { Box } from "@mui/material";
import { TooltipRow, TooltipTable } from "ui";

function formatExpression(v) {
  if (v === 0) return 0;
  if (v >= 100) return Math.round(v).toLocaleString();
  return v?.toFixed?.(3);
}

function MedianTooltipTable({ data, show, showName, showSource }) {
  return (
    <TooltipTable>
      {showName && data[`${show}Biosample`] && (
        <TooltipRow label={show === "tissue" ? "Tissue" : "Cell type"}>
          <Box display="flex">{data[`${show}Biosample`].biosampleName}</Box>
        </TooltipRow>
      )}
      <TooltipRow label="Median expression">
        <Box display="flex">
          {formatExpression(data.median)} {data.unit}
        </Box>
      </TooltipRow>
      {showSource && data?.[`${show}BiosampleFromSource`] && (
        <TooltipRow label="Reported annotation">
          <Box display="flex">{data?.[`${show}BiosampleFromSource`]}</Box>
        </TooltipRow>
      )}
    </TooltipTable>
  );
}

export default MedianTooltipTable;
