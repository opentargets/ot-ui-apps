import { usePlot } from "../contexts/PlotContext";
import { useFrame } from "../contexts/FrameContext";
import { fromFrameOrPlot } from "../util/fromFrameOrPlot";
import { finalData } from "../util/finalData";

export default function YTick({ values, position = "left", padding, tickLength, ...lineAttrs }) {
  const plot = usePlot();
  if (!plot) {
    throw Error("YTick component must appear inside a Plot component");
  }
  const frame = useFrame();

  const ops = fromFrameOrPlot(["yTick", "scales", "yReverse"], frame, plot);

  // eslint-disable-next-line
  padding ??= plot.tickPadding;

  const tickValues = finalData(ops.yTick, values);
  if (!tickValues) return null;

  const yScale = ops.yReverse ? ops.scales.y : v => plot.panelHeight - ops.scales.y(v);

  const topOrigin = `translate(${
    position === "right" ? plot.width - plot.padding.right + padding : plot.padding.left - padding
  },${plot.padding.top})`;

  // eslint-disable-next-line
  tickLength ??= plot.tickLength;
  const x2 = position === "right" ? tickLength : -tickLength;

  return (
    <g transform={topOrigin}>
      {tickValues.map((v, i) => {
        const y = yScale(v);
        return (
          <line
            key={i}
            x1={0}
            y1={y}
            x2={x2}
            y2={y}
            stroke={plot.tickColor}
            strokeWidth={plot.tickWidth}
            {...lineAttrs}
          />
        );
      })}
    </g>
  );
}
