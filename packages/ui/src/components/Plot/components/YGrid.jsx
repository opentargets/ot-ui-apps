import { usePlot } from "../contexts/PlotContext";
import { useFrame } from "../contexts/FrameContext";
import { fromFrameOrPlot } from "../util/fromFrameOrPlot";
import { finalData } from "../util/finalData";

export default function YGrid({ values, ...lineAttrs }) {

  const plot = usePlot();
  if (!plot) {
    throw Error("YGrid component must appear inside a Plot component");
  }
  const frame = useFrame();

  const ops = fromFrameOrPlot(['yTick', 'scales', 'yReverse'], frame, plot);

  const tickValues = finalData(ops.yTick, values);
  if (!tickValues) return null;
  
  const yScale = ops.yReverse
    ? ops.scales.y
    : v => plot.panelHeight - ops.scales.y(v);

  const topOrigin = `translate(${plot.padding.left},${plot.padding.top})`;

  return (
    <g transform={topOrigin}> 
      {tickValues.map((v, i) => {
        const y = yScale(v);
        return (
          <line
            key={i}
            x1={0}
            y1={y}
            x2={plot.panelWidth}
            y2={y}
            stroke={plot.gridColor}
            strokeWidth={plot.gridWidth}
            {...lineAttrs}
          />
        );
      })}
    </g>
  );
}