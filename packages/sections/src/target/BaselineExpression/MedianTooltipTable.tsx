import { Box } from "@mui/material";
import { TooltipRow, TooltipTable } from "ui";

function formatExpression(v) {
  if (v === 0) return 0;
  if (v >= 100) return Math.round(v).toLocaleString();
  return v?.toFixed?.(3);
}

function MedianTooltipTable({ data, show, showSource, subname }) {
  const name = data._firstLevelName
    ? `${data._firstLevelName} (max: ${subname})`
    : data[`${show}Biosample`]?.biosampleName;
  return (
    <TooltipTable>
      {name && (
        <TooltipRow label={show === "tissue" ? "Tissue" : "Cell type"}>
          <Box display="flex">{name}</Box>
        </TooltipRow>
      )}
      {showSource && data?.[`${show}BiosampleFromSource`] && (
        <TooltipRow label="Reported annotation">
          <Box display="flex">{data?.[`${show}BiosampleFromSource`]}</Box>
        </TooltipRow>
      )}
      <TooltipRow label="Median expression">
        <Box display="flex">
          {formatExpression(data.median)} {data.unit}
        </Box>
      </TooltipRow>
    </TooltipTable>
  );
}

export default MedianTooltipTable;
