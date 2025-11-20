import { Box, useTheme } from "@mui/material";
import * as PlotLib from "@observablehq/plot";
import { nullishComparator } from "@ot/utils";
import { max } from "d3";
import { ObsPlot, ObsTooltipRow, ObsTooltipTable } from "ui";

function DetailPlot({
  data,
  show = "tissue", // "tissue" or "celltype"
}) {
  const height = 230;
  const theme = useTheme();
  const barBackground = theme.palette.grey[200];
  const barFill = "#BFDAEE";

  if (data == null) return null;

  const sortedData = data.toSorted(
    nullishComparator(
      (a, b) => b - a,
      (a) => a.median
    )
  );

  const xAccessor = (d) => d[`${show}Biosample`].biosampleName;
  // const xAccessor = d => d[`${show}Biosample`].biosampleName;

  return (
    <Box>
      <ObsPlot
        data={sortedData}
        otherData={{ barBackground, barFill, xAccessor }}
        height={height}
        xTooltip={xAccessor}
        yTooltip={(d) => 1}
        xAnchorTooltip="left"
        yAnchorTooltip="bottom"
        containerProps={{
          width: "100%",
          marginTop: 3,
          marginBottom: 3,
          display: "flex",
          justifyContent: "center",
        }}
        // dxTooltip={10}
        // dyTooltip={10}
        renderChart={renderChart}
        renderTooltip={renderTooltip}
      />
    </Box>
  );
}

function displaySpecificityScore({ specificity_score: score }) {
  if (score == null) return "null";
  if (score === 0) return 0;
  return score.toFixed(2);
}

export default DetailPlot;

function renderChart({ data, otherData: { barBackground, barFill, xAccessor }, height }) {
  const maxMedian = max(data, (d) => d.median);

  const maxLabelChars = 22;
  const truncateLabel = (s) => {
    return `${s.slice(0, maxLabelChars)}${s.length > maxLabelChars ? "..." : ""}`;
  };

  const barWidth = 23;
  const gapWidth = 6;
  const marginLeft = 0;
  const marginRight = 50;
  const plotWidth = data.length * (barWidth + gapWidth) + marginLeft + marginRight;

  return PlotLib.plot({
    width: plotWidth,
    height,
    marginLeft: marginLeft,
    marginRight: marginRight,
    marginTop: 20,
    marginBottom: 130,
    style: { cursor: "default" },
    x: {
      axis: null,
      domain: data.map(xAccessor),
      paddingInner: gapWidth / (barWidth + gapWidth), // padding is ratio of gap to total space
      paddingOuter: 0,
    }, // preserve input order
    y: { axis: null, domain: [0, 1] },
    marks: [
      // text mark for x labels for more control and so can add tooltip
      PlotLib.text(data, {
        x: xAccessor,
        y: 0,
        text: (d) => truncateLabel(xAccessor(d)),
        textAnchor: "start",
        lineAnchor: "top",
        rotate: 45,
        fontSize: 11,
        dy: 4,
        className: "obs-tooltip",
      }),

      // background bars
      PlotLib.barY(data, {
        x: xAccessor,
        y: 1,
        fill: barBackground,
        className: "obs-tooltip",
        inset: 0,
      }),

      // median value bars
      PlotLib.barY(data, {
        x: xAccessor,
        y: (d) => d.median / maxMedian,
        fill: barFill,
        className: "obs-tooltip",
        inset: 0,
      }),

      // specificity scores
      PlotLib.text(data, {
        x: xAccessor,
        y: 1,
        text: displaySpecificityScore,
        textAnchor: "middle",
        lineAnchor: "bottom",
        dy: -4,
      }),
    ],
  });
}

function renderTooltip(datum, otherData) {
  const { xAccessor } = otherData;
  return (
    <ObsTooltipTable>
      <ObsTooltipRow>
        <Box display="flex">{xAccessor(datum)}</Box>
      </ObsTooltipRow>
    </ObsTooltipTable>
  );
}
