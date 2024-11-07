import { usePlot } from "../../contexts/PlotContext";
import { useFrame } from "../../contexts/FrameContext";
import { fromFrameOrPlot } from "../../util/fromFrameOrPlot";
import { isIterable } from "../../util/helpers";
import { finalData } from "../../util/finalData";
import { processAccessors } from "../../util/processAccessors";
import { rowValues } from "../../util/rowValues";

export default function Circle({ data, missing = 'throw', ...accessors }) {

  const plot = usePlot();
  if (!plot) {
    throw Error("Circle component must appear inside a Plot component");
  }
  const frame = useFrame();

  const ops = fromFrameOrPlot(['data', 'scales', 'mapX', 'mapY'], frame, plot);
  const { scales, mapX, mapY } = ops;

  data = finalData(ops.data, data);
  if (!isIterable(data)) {
    throw Error('mark data must be an iterable');
  }

  const finalAccessors = processAccessors({
    markChannels: [
      'x',
      'y',
      'dx',
      'dy',
      'fill',
      'fillOpacity',
      'stroke',
      'strokeOpacity',
      'strokeWidth',
      'strokeCap',
      'strokeDash',
      'area',
    ],
    accessors,
    scales,
    mapX,
    mapY,
  });

  const marks = [];

  for (const d of data) {

    const row = rowValues({
      rowData: d,
      missing,
      finalAccessors,
      scales,
      mapX,
      mapY,
    });
    
    if (row != null) {
      const attrs = {
        cx: row.x + row.dx,
        cy: row.y + row.dy,
        r: Math.sqrt(row.area / Math.PI),
        fill: row.fill,
        fillOpacity: row.fillOpacity,
        stroke: row.stroke,
        strokeOpacity: row.strokeOpacity,
        strokeWidth: row.strokeWidth,
      };
      if (row.strokeCap) attrs.strokeCap = row.strokeCap;
      if (row.strokeDash) attrs.strokeDash = row.strokeDash;
      marks.push(
        <circle key={marks.length} {...attrs} />
      );
    }
  }

  if (marks.length === 0) return null;

  return (
    <g transform={`translate(${plot.padding.left},${plot.padding.top})`}>
      {marks}
    </g>
  );

}