import { usePlot } from "../contexts/PlotContext";

// use rectAttrs for e.g. fill, stroke, strokeWidth, rx, ...
export default function Panel(rectAttrs) {
  const plot = usePlot();
  if (!plot) {
    throw Error("Panel component must appear inside a Plot component");
  }

  const { panelWidth, panelHeight, padding } = plot;

  return (
    <rect
      width={panelWidth}
      height={panelHeight}
      transform={`translate(${padding.left} ${padding.top})`}
      fill="transparent"
      {...rectAttrs}
    />
  );
}
