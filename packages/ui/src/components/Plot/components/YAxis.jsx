import { usePlot } from "../contexts/PlotContext";

export default function YAxis({ position = 'left', padding, ...lineAttrs }) {

  const plot = usePlot();
  if (!plot) {
    throw Error("YAxis component must appear inside a Plot component");
  }

  // eslint-disable-next-line
  padding ??= plot.axisPadding;

  const x = position === 'right'
    ? plot.width - plot.padding.right + padding
    : plot.padding.left - padding;

  return (
    <line
      x1={x}
      y1={plot.padding.top}
      x2={x}
      y2={plot.height - plot.padding.bottom}
      strokeWidth={plot.axisWidth}
      stroke={plot.axisColor}
      {...lineAttrs}
    />
  );
}