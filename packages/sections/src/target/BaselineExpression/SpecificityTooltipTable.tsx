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

function SpecificityTooltipTable({ data, show, specificityThreshold, symbol, subname }) {
  const name = data._firstLevelName
    ? (data._firstLevelName === subname
      ? data._firstLevelName
      : `${data._firstLevelName} - ${subname}`
    )
    : data[`${show}Biosample`]?.biosampleName;

   const lastname = data._firstLevelName
    ? subname
    : data[`${show}Biosample`]?.biosampleName;  

  return (
    <>
      <TooltipTable>
        {name && (
          <TooltipRow label={show === "tissue" ? "Tissue" : "Cell type"}>
            <Box display="flex">{name}</Box>
          </TooltipRow>
        )}
        <TooltipRow label="Specificity score">
          <Box display="flex">
            {data.specificity_score == null ? naLabel : `${formatToPercent(data.specificity_score)}%`}
          </Box>
        </TooltipRow>
      </TooltipTable>
      {data.specificity_score >= specificityThreshold && (
        <Typography variant="caption">
          {symbol} is in the top {formatToPercent(1 - data.specificity_score)}% of specifically expressed genes for{" "}
          {lastname}
        </Typography>
      )}
    </>
  );
}

export default SpecificityTooltipTable;
