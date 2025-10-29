import * as PlotLib from "@observablehq/plot";
import { Box, useTheme } from "@mui/material";
import { ObsPlot } from "ui";
import { max } from "d3";
import { nullishComparator } from "@ot/utils";

function DetailPlot({
  data,
  show = "tissue",  //show:  "tissue" or "celltype"
}) {

  const height = 280;
  const theme = useTheme();
  const barBackground = theme.palette.grey[200];
  // const barFill = theme.palette.grey[700];
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

  return PlotLib.plot({
    width: 700,
    height,
    marginLeft: 0,
    marginRight: 100,
    marginTop: 16,
    marginBottom: 200,
    x: { domain: data.map(xAccessor) },  // preserve input order
    y: { axis: null },
    marks: [
      PlotLib.axisX({ tickRotate: 45, fontSize: 12 }),
      PlotLib.barY(data, {
        x: xAccessor,
        y: 1,
        fill: barBackground }
      ),
      PlotLib.barY(data, {
        x: xAccessor,
        y: d => d.median / maxMedian,
        fill: barFill,
      }),
    ],
  });
}