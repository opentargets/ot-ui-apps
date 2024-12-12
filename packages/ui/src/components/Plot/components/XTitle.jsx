import { usePlot } from "../contexts/PlotContext";

export default function XTitle({
  children,
  position = "bottom",
  align = "center", // 'left', 'center' or 'right'
  padding,
  dx = 0,
  dy = 0,
  ...textAttrs // be very careful if change the transform-related CSS props
  // used in the <text> element
}) {
  const plot = usePlot();
  if (!plot) {
    throw Error("XTitle component must appear inside a Plot component");
  }

  if (!children) return null;

  // eslint-disable-next-line
  padding ??= plot.titlePadding;

  let x, textAnchor;
  if (align === "left") {
    x = plot.padding.left;
    textAnchor = "start";
  } else if (align === "right") {
    x = plot.width - plot.padding.right;
    textAnchor = "end";
  } else {
    x = plot.padding.left + plot.panelWidth / 2;
    textAnchor = "middle";
  }
  x += dx;

  let y, dominantBaseline;
  if (position === "top") {
    y = plot.padding.top - padding;
    dominantBaseline = "baseline";
  } else {
    y = plot.height - plot.padding.bottom + padding;
    dominantBaseline = "hanging";
  }
  y += dy;

  return (
    <text
      x={x}
      y={y}
      fill={plot.fontColor}
      fontFamily={plot.fontFamily}
      fontSize={plot.fontSize}
      fontStyle={plot.fontStyle}
      fontWeight={plot.fontWeight}
      textAnchor={textAnchor}
      dominantBaseline={dominantBaseline}
      {...textAttrs}
    >
      {children}
    </text>
  );
}
