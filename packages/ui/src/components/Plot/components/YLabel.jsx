import { usePlot } from "../contexts/PlotContext";
import { useFrame } from "../contexts/FrameContext";
import { fromFrameOrPlot } from "../util/fromFrameOrPlot";
import { finalData } from "../util/finalData";

export default function YLabel({
  values,
  position = "left",
  padding,
  dx = 0,
  dy = 0,
  format,
  ...textAttrs
}) {
  const plot = usePlot();
  if (!plot) {
    throw Error("YLabel component must appear inside a Plot component");
  }
  const frame = useFrame();

  const ops = fromFrameOrPlot(["yTick", "scales", "yReverse"], frame, plot);

  const tickValues = finalData(ops.yTick, values);
  if (!tickValues) return null;

  // eslint-disable-next-line
  padding ??= plot.labelPadding;

  const yScale = ops.yReverse ? ops.scales.y : v => plot.panelHeight - ops.scales.y(v);

  const topOrigin = `translate(${
    position === "right"
      ? plot.width - plot.padding.right + padding + dx
      : plot.padding.left - padding + dx
  },${plot.padding.top + dy})`;

  return (
    <g transform={topOrigin}>
      {tickValues.map((v, i) => {
        return (
          <text
            key={i}
            x={0}
            y={yScale(v)}
            fill={plot.fontColor}
            fontFamily={plot.fontFamily}
            fontSize={plot.fontSize}
            fontStyle={plot.fontStyle}
            fontWeight={plot.fontWeight}
            textAnchor={position === "right" ? "start" : "end"}
            dominantBaseline="middle"
            {...textAttrs}
          >
            {format ? format(v, i, tickValues, ops.yTick) : v}
          </text>
        );
      })}
    </g>
  );
}
