import * as PlotLib from "@observablehq/plot";
import { Box, useTheme } from "@mui/material";
import { ObsPlot } from "ui";
import { max } from "d3";
import { nullishComparator } from "@ot/utils";

function DetailPlot({
  data,
  show = "tissue",  //show:  "tissue" or "celltype"
}) {

  const height = 210;
  const theme = useTheme();
  const barBackground = theme.palette.grey[200];
  const barFill = theme.palette.primary.light;

  if (data == null) return null;

  return (
    <Box>
      <ObsPlot
        data={data}
        otherData={{ show, barBackground, barFill }}
        height={height}
        renderChart={renderChart}
      />
    </Box>
  );
}

export default DetailPlot;

function renderChart({
  data: rawData,
  otherData: { show, barBackground, barFill },
  height,
}) {

  const data = rawData.toSorted(nullishComparator((a, b) => b - a, a => a.median));

  const maxMedian = max(data, d => d.median);  
  const xAccessor = d => d[`${show}BiosampleFromSource`];
  // const xAccessor = d => d[`${show}Biosample`].biosampleName;
  
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
    x: { axis: null, domain: data.map(xAccessor) },  // preserve input order
    y: { axis: null },
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
      }),

      // background bars
      PlotLib.barY(data, {
        x: xAccessor,
        y: 1,
        fill: barBackground }
      ),

      // median value bars
      PlotLib.barY(data, {
        x: xAccessor,
        y: d => d.median / maxMedian,
        fill: barFill,
      }),
    ],
  });
}