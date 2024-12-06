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
  return (
    <div>
      <Box>
        <ChartControls data={data} query={query} variables={variables} columns={columns} />
      </Box>
      <Box sx={{ width: "90%", margin: "0 auto", mb: 6 }} ref={ref}>
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

const colorScale = PRIORITISATION_COLORS.reverse();
const getXLabel = (tick: number) => {
  if (tick === -1) return "Likely benign";
  if (tick === 0) return "Uncertain";
  if (tick === 1) return "Likely deleterious";
  return "";
};

function Plot({ data, width }) {
  const headerRef = useRef();

  useEffect(() => {
    if (data === undefined || width === null) return;
    const chart = PlotLib.plot({
      width: width,
      height: 250,
      label: null,
      marginLeft: 120,
      marginRight: 100,
      x: {
        axis: "bottom",
        ticks: 2,
        labelAnchor: "center",
        tickFormat: d => getXLabel(d),
        tickSize: 0,
        domain: [-1, 1],
      },

      color: {
        legend: false,
        type: "linear",
        range: colorScale,
        domain: [-1, 1],
        interpolate: "hsl",
      },
      style: {
        fontSize: "15px",
      },
      marks: [
        PlotLib.ruleY(data, {
          x1: -0.99,
          x2: 0.99,
          y: "method",
          stroke: grey[400],
          strokeWidth: 1,
          strokeDasharray: 6,
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
              x: false,
              y: false,
              fill: false,
              normalisedScore: false,
            },
          },
          channels: {
            method: {
              value: "method",
              label: "",
            },
            assessment: {
              value: "assessment",
              label: "Assessment:",
            },
            score: {
              value: "score",
              label: "Score:",
            },
            assessmentFlag: {
              value: "assessmentFlag",
              label: "Assessment Flag:",
            },
            normalisedScore: {
              value: "normalisedScore",
              label: "Normalised Score:",
            },
          },
        }),
      ],
    });
    headerRef.current.append(chart);
    return () => chart.remove();
  }, [data, width]);

  return <Box ref={headerRef}></Box>;
}

export default InSilicoPredictorsPlot;
