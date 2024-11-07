import { usePlot } from "../contexts/PlotContext";

export default function XAxis({ position = 'bottom', padding, ...lineAttrs }) {

  const plot = usePlot();
  if (!plot) {
    throw Error("XAxis component must appear inside a Plot component");
  }

  // eslint-disable-next-line
  padding ??= plot.axisPadding;

  const y = position === 'top'
    ? plot.padding.top - padding
    : plot.height - plot.padding.bottom + padding;

  return (
    <line
      x1={plot.padding.left}
      y1={y}
      x2={plot.width - plot.padding.right}
      y2={y}
      strokeWidth={plot.axisWidth}
      stroke={plot.axisColor}
      {...lineAttrs}
    />
  );
}