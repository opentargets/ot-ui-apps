import * as PlotLib from "@observablehq/plot";
import { Box, useTheme } from "@mui/material";
import { ObsPlot } from "ui";
import { max } from "d3";



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
  data,
  otherData: { show, barBackground, barFill },
  height,
}) {

  const maxMedian = max(data, d => d.median);  
  const xAccessor = d => d[`${show}BiosampleFromSource`];
  // const xAccessor = d => d[`${show}Biosample`].biosampleName

  return PlotLib.plot({
    width: 700,  // WINDOW IN PLATFORM - or want fixed bar width?
    height,
    marginLeft: 0,
    marginRight: 100,
    marginTop: 30,
    marginBottom: 200,
    y: { axis: null },
    style: { fontSize: "11px", fontWeight: "500" },
    marks: [
      PlotLib.axisX({ tickRotate: 45 }),
      PlotLib.barY(data, {
        x: xAccessor,
        y: 1,
        fill: barBackground }
      ),
      PlotLib.barY(data, {
        x: xAccessor,
        // y: "_normalisedMedian", 
        y: d => d.median / maxMedian,
        fill: barFill,
      }),
    ],
  });

  // return PlotLib.plot({
  //   // width,
  //   height,
  //   marginLeft: 100,
  //   marginRight: 50,
  //   marginTop: 30,
  //   marginBottom: 130,
  //   style: { fontSize: "11px", fontWeight: "500" },
  //   marks: [
  //     PlotLib.axisX({ tickRotate: 90 }),
  //     PlotLib.barY(data, {
  //       // x: d => d[`${show}Biosample`].biosampleName,
  //       x: d => d[`${show}BiosampleFromSource`],
  //       y: "median" 
  //     }),
  //   ],
  // });
}