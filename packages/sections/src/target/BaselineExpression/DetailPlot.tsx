import * as PlotLib from "@observablehq/plot";
import { Box, useTheme } from "@mui/material";
import { ObsPlot, ObsTooltipTable, ObsTooltipRow  } from "ui";
import { max } from "d3";
import { nullishComparator } from "@ot/utils";

function DetailPlot({
  data,
  show = "tissue",  // "tissue" or "celltype"
}) {

  const height = 210;
  const theme = useTheme();
  const barBackground = theme.palette.grey[200];
  const barFill = theme.palette.primary.light;

  if (data == null) return null;

  const sortedData = data.toSorted(nullishComparator((a, b) => b - a, a => a.median));

  const xAccessor = d => d[`${show}BiosampleFromSource`];
  // const xAccessor = d => d[`${show}Biosample`].biosampleName;

  return (
    <Box>
      <ObsPlot
        data={sortedData}
        otherData={{ barBackground, barFill, xAccessor }}
        height={height}
        renderChart={renderChart}
        xTooltip={xAccessor}
        yTooltip={d => 1}
        xAnchorTooltip="left"
        yAnchorTooltip="bottom"
        // dxTooltip={10}
        // dyTooltip={10}
        renderTooltip={renderTooltip}
      />
    </Box>
  );
}

export default DetailPlot;

function renderChart({
  data,
  otherData: { barBackground, barFill, xAccessor },
  height,
}) {

  const maxMedian = max(data, d => d.median);

  const maxLabelChars = 22;
  const truncateLabel = (s) => {
    return `${s.slice(0, maxLabelChars)}${s.length > maxLabelChars ? "..." : ""}`;
  }

  return PlotLib.plot({
    width: 500,
    height,
    marginLeft: 0,
    marginRight: 100,
    marginTop: 16,
    marginBottom: 130,
    style: { cursor: "default" },
    x: { axis: null, domain: data.map(xAccessor) },  // preserve input order
    y: { axis: null, domain: [0, 1] },
    marks: [
      // text mark for x labels for more control and so can add tooltip
      PlotLib.text(data, {
        x: xAccessor,
        y: 0,
        text: d => truncateLabel(xAccessor(d)),
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
      }),

      // median value bars
      PlotLib.barY(data, {
        x: xAccessor,
        y: d => d.median / maxMedian,
        fill: barFill,
        className: "obs-tooltip",
      }),
    ],
  });
}

function renderTooltip(datum, otherData) {
  const { xAccessor } = otherData;
  return (
    <ObsTooltipTable>
      <ObsTooltipRow>
        <Box display="flex">
          {xAccessor(datum)}
        </Box>
      </ObsTooltipRow>
    </ObsTooltipTable>
  );
}