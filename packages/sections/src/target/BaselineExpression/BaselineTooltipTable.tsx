import { Box } from "@mui/material";
import { naLabel } from "@ot/constants";
import { TooltipRow, TooltipTable } from "ui";

function formatZeroToOne(v) {
  if (v === 0 || v === 1) return v;
  return v?.toFixed?.(3);
}

function formatExpression(v) {
  if (v === 0) return 0;
  if (v >= 100) return Math.round(v).toLocaleString();
  return v?.toFixed?.(3);
}

function BaselineTooltipTable({ data, show, showName }) {
  // const fromSource = data?.[`${show}BiosampleFromSource`];

  return (
    <TooltipTable>
      {/* {fromSource && (
        <TooltipRow label={`${show}BiosampleFromSource`}>
          <Box display="flex">{fromSource}</Box>
        </TooltipRow>
      )} */}
      {showName && data[`${show}Biosample`] && (
        <TooltipRow label={show === "tissue" ? "Tissue" : "Cell type"}>
          <Box display="flex">{data[`${show}Biosample`].biosampleName}</Box>
        </TooltipRow>
      )}
      <TooltipRow label="Median expression">
        <Box display="flex">{formatExpression(data.median)}</Box>
      </TooltipRow>
      <TooltipRow label="Specificity score">
        <Box display="flex">
          {data.specificity_score == null ? naLabel : formatZeroToOne(data.specificity_score)}
        </Box>
      </TooltipRow>
      <TooltipRow label="Distribution score">
        <Box display="flex">{formatZeroToOne(data.distribution_score)}</Box>
      </TooltipRow>
    </TooltipTable>
  );
}

export default BaselineTooltipTable;
