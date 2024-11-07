import { usePlot } from "../../contexts/PlotContext";
import { useFrame } from "../../contexts/FrameContext";
import { fromFrameOrPlot } from "../../util/fromFrameOrPlot";
import { isIterable } from "../../util/helpers";
import { finalData } from "../../util/finalData";
import { processAccessors } from "../../util/processAccessors";
import { rowValues } from "../../util/rowValues";

export default function Segment({ data, missing = 'throw', ...accessors }) {

  const plot = usePlot();
  if (!plot) {
    throw Error("Segment component must appear inside a Plot component");
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
      'xx',
      'y',
      'yy',
      'dx',
      'dy',
      'stroke',
      'strokeOpacity',
      'strokeWidth',
      'strokeCap',
      'strokeDash',
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
        x1: row.x + row.dx,
        y1: row.y + row.dy,
        x2: row.xx + row.dx,
        y2: row.yy + row.dy,
        stroke: row.stroke,
        strokeOpacity: row.strokeOpacity,
        strokeWidth: row.strokeWidth,
      };
      if (row.strokeCap) attrs.strokeCap = row.strokeCap;
      if (row.strokeDash) attrs.strokeDash = row.strokeDash;
      marks.push(
        <line key={marks.length} {...attrs} />
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