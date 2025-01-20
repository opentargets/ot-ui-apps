import { usePlot } from "../contexts/PlotContext";
import { useFrame } from "../contexts/FrameContext";
import { fromFrameOrPlot } from "../util/fromFrameOrPlot";
import { finalData } from "../util/finalData";

export default function XLabel({
  values,
  position = "bottom",
  padding,
  dx = 0,
  dy = 0,
  format,
  ...textAttrs
}) {
  const plot = usePlot();
  if (!plot) {
    throw Error("XLabel component must appear inside a Plot component");
  }
  const frame = useFrame();

  const ops = fromFrameOrPlot(["xTick", "scales", "xReverse"], frame, plot);

  const tickValues = finalData(ops.xTick, values);
  if (!tickValues) return null;

  // eslint-disable-next-line
  padding ??= plot.labelPadding;

  const xScale = ops.xReverse ? v => plot.panelWidth - ops.scales.x(v) : ops.scales.x;

  const leftOrigin = `translate(${plot.padding.left + dx},${
    position === "top"
      ? plot.padding.top - padding + dy
      : plot.height - plot.padding.bottom + padding + dy
  })`;

  return (
    <g transform={leftOrigin}>
      {tickValues.map((v, i) => {
        return (
          <text
            key={i}
            x={xScale(v)}
            y={0}
            fill={plot.fontColor}
            fontFamily={plot.fontFamily}
            fontSize={plot.fontSize}
            fontStyle={plot.fontStyle}
            fontWeight={plot.fontWeight}
            textAnchor="middle"
            dominantBaseline={position === "top" ? "baseline" : "hanging"}
            {...textAttrs}
          >
            {format ? format(v, i, tickValues, ops.xTick) : v}
          </text>
        );
      })}
    </g>
  );
}
