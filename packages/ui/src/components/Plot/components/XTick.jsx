import { usePlot } from "../contexts/PlotContext";
import { useFrame } from "../contexts/FrameContext";
import { fromFrameOrPlot } from "../util/fromFrameOrPlot";
import { finalData } from "../util/finalData";

export default function XTick({ values, position = "bottom", padding, tickLength, ...lineAttrs }) {
  const plot = usePlot();
  if (!plot) {
    throw Error("XTick component must appear inside a Plot component");
  }
  const frame = useFrame();

  const ops = fromFrameOrPlot(["xTick", "scales", "xReverse"], frame, plot);

  // eslint-disable-next-line
  padding ??= plot.tickPadding;

  const tickValues = finalData(ops.xTick, values);
  if (!tickValues) return null;

  const xScale = ops.xReverse ? v => plot.panelWidth - ops.scales.x(v) : ops.scales.x;

  const leftOrigin = `translate(${plot.padding.left},${
    position === "top" ? plot.padding.top - padding : plot.height - plot.padding.bottom + padding
  })`;

  // eslint-disable-next-line
  tickLength ??= plot.tickLength;
  const y2 = position === "top" ? -tickLength : tickLength;

  return (
    <g transform={leftOrigin}>
      {tickValues.map((v, i) => {
        const x = xScale(v);
        return (
          <line
            key={i}
            x1={x}
            y1={0}
            x2={x}
            y2={y2}
            stroke={plot.tickColor}
            strokeWidth={plot.tickWidth}
            {...lineAttrs}
          />
        );
      })}
    </g>
  );
}
