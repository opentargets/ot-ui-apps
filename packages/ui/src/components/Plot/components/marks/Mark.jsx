import { usePlot } from "../../contexts/PlotContext";
import { useFrame } from "../../contexts/FrameContext";
import { fromFrameOrPlot } from "../../util/fromFrameOrPlot";
import { isIterable } from "../../util/helpers";
import { finalData } from "../../util/finalData";
import { processAccessors } from "../../util/processAccessors";
import { rowValues } from "../../util/rowValues";

export default function Mark({
      data,
      missing,
      accessors,
      markChannels,
      createMark
    }) {

  const plot = usePlot();
  if (!plot) {
    throw Error("mark components must appear inside a Plot component");
  }
  const frame = useFrame();

  const ops = fromFrameOrPlot(['data', 'scales', 'mapX', 'mapY'], frame, plot);
  const { scales, mapX, mapY } = ops;

  // eslint-disable-next-line
  data = finalData(ops.data, data);
  if (!isIterable(data)) {
    throw Error('mark data must be an iterable');
  }

  const finalAccessors = processAccessors({
    markChannels,
    accessors,
    scales,
    mapX,
    mapY,
  });

  const marks = [];

  let rowIndex = 0;
  for (const d of data) {
    const row = rowValues({
      // eslint-disable-next-line
      rowIndex: rowIndex++,
      rowData: d,
      missing,
      finalAccessors,
      scales,
      mapX,
      mapY,
    });

    if (row != null) {
      marks.push(createMark(row));
    }
  }

  if (marks.length === 0) return null;

  return (
    <g transform={`translate(${plot.padding.left},${plot.padding.top})`}>
      {marks}
    </g>
  );

}