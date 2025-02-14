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

  return PlotLib.plot({
    width,
    height,
    marginLeft: 310,
    marginRight: 10,
    marginTop: 30,
    marginBottom: 30,
    style: { fontSize: 12 },
    x: {
      domain: [-1, 1],
      label: null,
      ticks: [-1, 0, 1],
      tickFormat: Math.round,
    },
    y: {
      type: "band",
      domain: featureNames,
      label: "",
      tickSize: 0,
      grid: true,
      padding: 0.2,
      inset: 0.1,
      tickPadding: -dxName,
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
        textAnchor: "end",
      }),
      PlotLib.text(data.slice(0, 1), {
        x: -1,
        y: "name",
        dx: dxValue,
        dy: dyHeader,
        text: d => "Value",
        fontWeight: 500,
        textAnchor: "end",
      }),
      PlotLib.text(data.slice(0, 1), {
        x: 0,
        y: "name",
        dy: dyHeader,
        fontWeight: 500,
        text: d => `Shapley (sum: ${sum(data, d => +d.shapValue).toFixed(3)})`,
      }),

      // // text mark for y labels for flexibility
      // PlotLib.text(data, {
      //   x: -1,
      //   y: "name",
      //   textAnchor: "end",
      //   dx: dxName,
      //   // text: d => `${Number.isInteger(d.value) ? d.value : d.value.toFixed(3)} = ${d.name}`,
      //   text: d => d.name,
      // }),

      // feature values
      PlotLib.text(data, {
        x: -1,
        y: "name",
        text: "value",
        dx: dxValue,
        textAnchor: "end",
        fontSize: 11.5,
      }),

      // bars
      PlotLib.barX(data, {
        x: "shapValue",
        y: "name",
        fill: d => (d.shapValue < 0 ? negColor : posColor),
      }),

      // show nunbers in or next to bars
      PlotLib.text(
        data.filter(d => d.shapValue > textInBarCutoff),
        {
          x: "shapValue",
          y: "name",
          text: "shapValue",
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
          text: "shapValue",
          textAnchor: "start",
          fill: "#fff",
          dx: 4,
          fontSize: 11,
        }
      ),
      PlotLib.text(
        data.filter(d => d.shapValue > 0 && d.shapValue < textInBarCutoff),
        { x: "shapValue", y: "name", text: "shapValue", textAnchor: "start", dx: 4, fontSize: 11 }
      ),
      PlotLib.text(
        data.filter(d => d.shapValue < 0 && d.shapValue > -textInBarCutoff),
        { x: "shapValue", y: "name", text: "shapValue", textAnchor: "end", dx: -4, fontSize: 11 }
      ),
      // PlotLib.text(
      //   data.filter(d => d.shapValue === 0),
      //   { x: "shapValue", y: "name", text: "shapValue" }
      // ),
    ],
  });
}
