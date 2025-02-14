import * as PlotLib from "@observablehq/plot";
import { schemeRdBu, sum } from "d3";

export function renderWaterfallPlot({ data, width, height }) {
  const { features: originalFeatures, shapBaseValue } = data;
  const negColor = schemeRdBu.at(-1)[2];
  const posColor = schemeRdBu.at(-1).at(-3);

  const features = structuredClone(originalFeatures);
  features.sort((a, b) => Math.abs(a.shapValue) - Math.abs(b.shapValue));
  for (const [index, feature] of features.entries()) {
    feature._start = features[index - 1]?._end ?? shapBaseValue;
    feature._end = feature._start + feature.shapValue;
  }

  return PlotLib.plot({
    marginLeft: 250,
    marginRight: 150,
    marginTop: 20,
    marginBottom: 50,
    style: { fontSize: 12 },
    x: {
      axis: "bottom",
      line: true,
      label: "",
      labelArrow: false,
    },
    y: {
      type: "band",
      // order features by group or by largest absolute shap value
      domain: features.map(d => d.name),
      label: "",
      reverse: true,
      tickSize: 0,
      // padding: 0.4,
      grid: true,
      tickPadding: 40,
    },
    marks: [
      // vertical line at total score - and label at top
      PlotLib.ruleX(features.slice(-1), {
        x: "_end",
        stroke: "#000",
        strokeOpacity: 0.3,
        strokeDasharray: "4,3",
      }),
      PlotLib.text(features.slice(-1), {
        x: "_end",
        y: "name",
        text: d => `L2G score: ${d._end.toFixed(3)}`,
        dy: -24,
      }),

      // vertical line at base score - and label at bottom
      PlotLib.tickX([0], {
        x: d => shapBaseValue,
        y: d => features[0].name,
        dy: 24,
        strokeOpacity: 0.3,
        strokeDasharray: "4,3",
      }),
      PlotLib.text(features.slice(-1), {
        x: d => shapBaseValue,
        y: d => features[0].name,
        text: d => `Base score: ${shapBaseValue}`,
        dy: 40,
      }),

      // bars
      PlotLib.ruleY(
        features.filter(d => d.shapValue !== 0),
        {
          x1: "_start",
          x2: "_end",
          y: "name",
          // dy: 10,
          stroke: d => (d.shapValue < 0 ? negColor : posColor),
          strokeWidth: 10,
        }
      ),

      // vertical ticks at current score
      PlotLib.tickX(features.slice(0, -1), {
        x: "_end",
        y: "name",
        stroke: "#000",
        strokeOpacity: 0.2,
        dy: -10,
        // fill: d => d.shapValue < 0 ? negColor : posColor,
      }),

      // show shap values in or next to bars
      PlotLib.text(
        features.filter(d => d.shapValue > 0.0005),
        {
          x: "_end",
          y: "name",
          text: d => `+${d.shapValue.toFixed(3)}`,
          textAnchor: "start",
          dx: 3,
        }
      ),
      PlotLib.text(
        features.filter(d => d.shapValue < -0.0005),
        { x: "_end", y: "name", text: d => d.shapValue.toFixed(3), textAnchor: "end", dx: -3 }
      ),
      // PlotLib.text(
      //   features.filter(d => d.shapValue === 0),
      //   { x: "_end", y: "name", text: d => "0" }
      // ),
    ],
  });
}
