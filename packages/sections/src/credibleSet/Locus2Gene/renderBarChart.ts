import * as PlotLib from "@observablehq/plot";
import { schemeRdBu, sum } from "d3";

const colorScheme = schemeRdBu;
const negColor = colorScheme.at(-1)[2];
const posColor = colorScheme.at(-1).at(-3);

export function renderBarChart({ data, otherData: { featureNames }, width, height }) {
  const textInBarCutoff = 0.4;
  const dxName = -70;
  const dxValue = -18;
  const dyHeader = -25;
  const textFontSize = 12;

  return PlotLib.plot({
    width,
    height,
    marginLeft: 310,
    marginRight: 10,
    marginTop: 30,
    marginBottom: 30,
    style: { fontSize: 11.5 },
    x: {
      domain: [-1, 1],
      label: null,
      ticks: [-1, 0, 1],
      tickFormat: Math.round,
    },
    y: {
      type: "band",
      domain: featureNames,
      grid: true,
      padding: 0.2,
      // inset: 0.5,
      axis: null,
      paddingInner: 0.5,
      paddingOuter: 0.5,
      // reverse: true,
    },
    marks: [
      // x = 0 line
      PlotLib.ruleX([0], {
        strokeOpacity: 0.1,
      }),

      // column headers
      PlotLib.text(data.slice(0, 1), {
        x: -1,
        y: "name",
        dx: dxName,
        dy: dyHeader,
        text: d => "Feature",
        fontWeight: 500,
        fontSize: textFontSize,
        textAnchor: "end",
      }),
      PlotLib.text(data.slice(0, 1), {
        x: -1,
        y: "name",
        dx: dxValue,
        dy: dyHeader,
        text: d => "Value",
        fontSize: textFontSize,
        fontWeight: 500,
        textAnchor: "end",
      }),
      PlotLib.text(data.slice(0, 1), {
        x: 0,
        y: "name",
        dy: dyHeader,
        fontWeight: 500,
        fontSize: textFontSize,
        text: d => `Shapley (sum: ${sum(data, d => +d.shapValue).toFixed(3)})`,
      }),

      // feature names
      PlotLib.text(data, {
        x: -1,
        y: "name",
        text: "name",
        dx: dxName,
        textAnchor: "end",
        fontSize: textFontSize,
      }),

      // feature values
      PlotLib.text(data, {
        x: -1,
        y: "name",
        text: d => d.value.toFixed(3),
        dx: dxValue,
        textAnchor: "end",
        fontSize: 11.5,
        fontVariant: "common-ligatures tabular-nums",
      }),

      // bars
      PlotLib.ruleY(data, {
        x1: 0,
        x2: "shapValue",
        y: "name",
        stroke: d => (d.shapValue < 0 ? negColor : posColor),
        strokeWidth: 18,
      }),

      // show nunbers in or next to bars
      PlotLib.text(
        data.filter(d => d.shapValue > textInBarCutoff),
        {
          x: "shapValue",
          y: "name",
          text: d => d.shapValue.toFixed(3),
          textAnchor: "end",
          fill: "#fff",
          dx: -4,
          fontSize: 11,
        }
      ),
      PlotLib.text(
        data.filter(d => d.shapValue < -textInBarCutoff),
        {
          x: "shapValue",
          y: "name",
          text: d => d.shapValue.toFixed(3),
          textAnchor: "start",
          fill: "#fff",
          dx: 4,
          fontSize: 11,
        }
      ),
      PlotLib.text(
        data.filter(d => d.shapValue > 0.0005 && d.shapValue < textInBarCutoff),
        {
          x: "shapValue",
          y: "name",
          text: d => d.shapValue.toFixed(3),
          textAnchor: "start",
          dx: 4,
          fontSize: 11,
        }
      ),
      PlotLib.text(
        data.filter(d => d.shapValue < -0.0005 && d.shapValue > -textInBarCutoff),
        {
          x: "shapValue",
          y: "name",
          text: d => d.shapValue.toFixed(3),
          textAnchor: "end",
          dx: -4,
          fontSize: 11,
        }
      ),
    ],
  });
}
