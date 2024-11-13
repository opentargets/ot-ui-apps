import { usePlot } from "../contexts/PlotContext";
import { useFrame } from "../contexts/FrameContext";
import { fromFrameOrPlot } from "../util/fromFrameOrPlot";
import { finalData } from "../util/finalData";

export default function XGrid({ values, ...lineAttrs }) {

  const plot = usePlot();
  if (!plot) {
    throw Error("XGrid component must appear inside a Plot component");
  }
  const frame = useFrame();

  const ops = fromFrameOrPlot(['xTick', 'scales', 'xReverse'], frame, plot);

  const tickValues = finalData(ops.xTick, values);
  if (!tickValues) return null;
  
  const xScale = ops.xReverse
    ? v => plot.panelWidth - ops.scales.x(v)
    : ops.scales.x;

  const leftOrigin = `translate(${plot.padding.left},${plot.padding.top})`;

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
            y2={plot.panelHeight}
            stroke={plot.gridColor}
            strokeWidth={plot.gridWidth}
            {...lineAttrs}
          />
        );
      })}
    </g>
  );
}