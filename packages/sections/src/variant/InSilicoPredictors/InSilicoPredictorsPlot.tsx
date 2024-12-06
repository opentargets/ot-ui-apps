import { useRef, useEffect } from "react";
import * as PlotLib from "@observablehq/plot";
import * as d3 from "d3";
import { rgb } from "d3";
// import * as htl from "htl";
import { useMeasure } from "@uidotdev/usehooks";
import { Box, Fade } from "@mui/material";
import { grey } from "@mui/material/colors";
import { DataDownloader } from "ui";
import { sentenceCase } from "ui/src/utils/global";

const PRIORITISATION_COLORS = [
  rgb("#bc3a19"),
  rgb("#d65a1f"),
  rgb("#e08145"),
  rgb("#e3a772"),
  rgb("#e6ca9c"),
  rgb("#eceada"),
  rgb("#c5d2c1"),
  rgb("#9ebaa8"),
  rgb("#78a290"),
  rgb("#528b78"),
  rgb("#2f735f"),
];

function InSilicoPredictorsPlot({ data, query, variables, columns }) {
  const [ref, { width }] = useMeasure();
  // const parsedData = prepareData(data);
  return (
    <div>
      <Box>
        <ChartControls data={data} query={query} variables={variables} columns={columns} />
      </Box>
      <Box sx={{ width: "95%", margin: "0 auto" }} ref={ref}>
        <Fade in>
          <div>
            <Plot data={data} width={width} />
          </div>
        </Fade>
      </Box>
    </div>
  );
}

function ChartControls({ data, query, variables, columns }) {
  return (
    <Box
      sx={{
        borderColor: grey[300],
        borderRadius: 1,
        display: "flex",
        justifyContent: "flex-end",
        gap: 1,
      }}
    >
      <DataDownloader
        btnLabel="Export"
        rows={data}
        query={query}
        variables={variables}
        columns={columns}
      />
    </Box>
  );
}

function Plot({ data, width }) {
  const headerRef = useRef();
  console.log(d3);
  // return null;
  useEffect(() => {
    if (data === undefined || width === null) return;
    const chart = PlotLib.plot({
      width: width,
      height: 250,
      label: null,
      marginLeft: 100,
      marginRight: 100,
      x: {
        // axis: "bottom",
        label: null,

        // tickFormat: "+",
        domain: [-1, 1],
      },

      color: {
        // label: "tr",
        legend: true,
        type: "linear",
        range: PRIORITISATION_COLORS,
        domain: [-1, 1],
        interpolate: "hsl",
      },
      marks: [
        //   () => htl.svg`<defs>
        //   <linearGradient id="gradient" gradientTransform="rotate(90)">
        //     <stop offset="15%" stop-color="purple" />
        //     <stop offset="75%" stop-color="red" />
        //     <stop offset="100%" stop-color="gold" />
        //   </linearGradient>
        // </defs>`,
        // PlotLib.barX(data, {
        //   x: "normalisedScore",
        //   y: "method",
        //   // fontSize: "18px",
        //   fill: "#3389ca",
        //   // fill: d => d.normalisedScore,
        //   // sort: { y: "x" },
        //   inset: 0.5,
        // }),

        // BARS
        // PlotLib.ruleY(data, {
        //   x: "normalisedScore",
        //   y: "method",
        //   // fontSize: "18px",
        //   // fill: "#3389ca",
        //   stroke: "#3389ca",
        //   strokeWidth: 8,
        //   // fill: d => d.normalisedScore,
        //   // sort: { y: "x" },
        // }),

        PlotLib.ruleY(data, {
          // x: [-1, 1],
          x1: -0.99,
          x2: 0.99,
          y: "method",
          // fontSize: "18px",
          // fill: "#3389ca",
          stroke: grey[400],
          strokeWidth: 1,
          strokeDasharray: 6,
          // fill: d => d.normalisedScore,
          // sort: { y: "x" },
        }),
        PlotLib.dot(data, {
          x: "normalisedScore",
          y: "method",
          r: 12,
          fill: "normalisedScore",
          stroke: grey[100],
          strokeWidth: 4,
          tip: {
            fontSize: 14,
            textPadding: 20,
            format: {
              // fill: false,
              // score: true,
              // assessment: true,
              // assessmentFlag: true,
              // diseaseFromSource: true,
              // x: false,
              // y: false,
            },
          },
          // ticks: data.map(d => d.method),
          // tickSize: 1,
          // fontSize: "16px",
        }),
        // PlotLib.axisX({
        // x: 0,
        // ticks: data.map(d => d.method),
        // tickSize: 1,
        // fontSize: "16px",
        // }),
        // PlotLib.axisY({
        //   x: 0,
        //   ticks: data.map(d => d.method),
        //   tickSize: 0,
        //   fontSize: "16px",
        //   fontWeight: "600",
        // }),
        // PlotLib.textX(data, {
        //   x: "normalisedScore",
        //   y: "method",
        //   text: (
        //     f => d =>
        //       f(d.normalisedScore)
        //   )(d3.format("+.1")),
        //   textAnchor: "start",
        //   dx: 4,
        // }),
        // d3
        //   .groups(data, d => d.normalisedScore > 0)
        //   .map(([growth, predictors]) => [
        //   ]),
        PlotLib.ruleX([0], { strokeDasharray: 6, stroke: grey[400] }),
      ],
    });
    headerRef.current.append(chart);
    return () => chart.remove();
  }, [data, width]);

  return <Box ref={headerRef}></Box>;
}

export default InSilicoPredictorsPlot;
