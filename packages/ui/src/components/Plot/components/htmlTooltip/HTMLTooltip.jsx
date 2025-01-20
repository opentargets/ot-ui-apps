import { usePlot } from "../../contexts/PlotContext";
import { useFrame } from "../../contexts/FrameContext";
import { fromFrameOrPlot } from "../../util/fromFrameOrPlot";
import HTML from "../marks/HTML";

export default function HTMLTooltip({
  // HTML mark channels
  x,
  y,
  pxWidth,
  pxHeight,
  content,
  pointerEvents = "visiblePainted",
  // offsets > 0 increase space between anchor point and tooltip
  xOffset = 10,
  yOffset = 10,
}) {
  const plot = usePlot();
  if (!plot) {
    throw Error("HTMLTooltip component must appear inside a Plot component");
  }
  const frame = useFrame();

  const ops = fromFrameOrPlot(["scales", "xReverse", "yReverse"], frame, plot);

  if (typeof x !== "function") {
    throw Error("x channel must be an accessor function");
  }
  if (typeof y !== "function") {
    throw Error("y channel must be an accessor function");
  }

  function xAnchor(d, x) {
    const [, rangeMax] = ops.scales.x.range();
    const output = ops.scales.x(x(d));
    if (ops.xReverse) {
      return output > rangeMax / 2 ? "left" : "right";
    } else {
      return output < rangeMax / 2 ? "left" : "right";
    }
  }

  function yAnchor(d, y) {
    const [, rangeMax] = ops.scales.y.range();
    const output = ops.scales.y(y(d));
    if (ops.yReverse) {
      return output > rangeMax / 2 ? "bottom" : "top";
    } else {
      return output < rangeMax / 2 ? "bottom" : "top";
    }
  }

  return (
    <HTML
      dataFrom="hover"
      x={x}
      y={y}
      pxWidth={pxWidth}
      pxHeight={pxHeight}
      content={content}
      anchor={d => `${yAnchor(d, y)}-${xAnchor(d, x)}`}
      pointerEvents={pointerEvents}
      dx={d => (xAnchor(d, x) === "left" ? xOffset : -xOffset)}
      dy={d => (yAnchor(d, y) === "top" ? yOffset : -yOffset)}
    />
  );
}
