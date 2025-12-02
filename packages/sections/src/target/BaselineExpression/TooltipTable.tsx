import { Box } from "@mui/material";
import { naLabel } from "@ot/constants";
import { ObsTooltipRow, ObsTooltipTable } from "ui";

function formatZeroToOne(v) {
  if (v === 0 || v === 1) return v;
  return v?.toFixed?.(3);
}

function formatExpression(v) {
  if (v === 0) return 0;
  if (v >= 100) return Math.round(v).toLocaleString();
  return v?.toFixed?.(3);
}

export function TooltipTable({ data, show, showName }) {
  // const fromSource = data?.[`${show}BiosampleFromSource`];

  return (
    <ObsTooltipTable>
      {/* {fromSource && (
        <ObsTooltipRow label={`${show}BiosampleFromSource`}>
          <Box display="flex">{fromSource}</Box>
        </ObsTooltipRow>
      )} */}
      {showName && data[`${show}Biosample`] && (
        <ObsTooltipRow label={show === "tissue" ? "Tissue" : "Cell type"}>
          <Box display="flex">{data[`${show}Biosample`].biosampleName}</Box>
        </ObsTooltipRow>
      )}
      <ObsTooltipRow label="Median expression">
        <Box display="flex">{formatExpression(data.median)}</Box>
      </ObsTooltipRow>
      <ObsTooltipRow label="Specificity score">
        <Box display="flex">
          {data.specificity_score == null ? naLabel : formatZeroToOne(data.specificity_score)}
        </Box>
      </ObsTooltipRow>
      <ObsTooltipRow label="Distribution score">
        <Box display="flex">{formatZeroToOne(data.distribution_score)}</Box>
      </ObsTooltipRow>
    </ObsTooltipTable>
  );
}
