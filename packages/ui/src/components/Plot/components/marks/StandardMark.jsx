import { memo } from "react";
import {
  useVisUpdateSelection,
  useVisClearSelection
} from "../../contexts/VisContext";
import { usePlot } from "../../contexts/PlotContext";
import { useFrame } from "../../contexts/FrameContext";
import { fromFrameOrPlot } from "../../util/fromFrameOrPlot";
import { isIterable } from "../../util/helpers";
import { finalData } from "../../util/finalData";
import { processAccessors } from "../../util/processAccessors";
import { rowValues } from "../../util/rowValues";
import DynamicTag from "../util/DynamicTag";

export default memo(function StandardMark({
  data,
  missing,
  hover,
  accessors,
  markChannels,
  tagName,
  createAttrs,
  createContent,
}) {

  const visUpdateSelection = useVisUpdateSelection();
  const visClearSelection = useVisClearSelection();
  if (hover && !visUpdateSelection) {
    throw Error("hover props can only be used inside a Vis component");
  }

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
      rowIndex,
      rowData: d,
      missing,
      finalAccessors,
      scales,
      mapX,
      mapY,
    });

    if (row != null) {
      const attrs = createAttrs(row);

      if (hover) {
        attrs.onMouseEnter = () => visUpdateSelection('hover', [d]);
        if (hover !== 'stay') {
          attrs.onMouseLeave = visClearSelection;
        }
      }

      marks.push(
        <DynamicTag tagName={tagName} key={rowIndex} {...attrs}>
          {createContent?.(row)}
        </DynamicTag>
      );
    }

    rowIndex += 1;
  }

  if (marks.length === 0) return null;

  return (
    <g transform={`translate(${plot.padding.left},${plot.padding.top})`}>
      {marks}
    </g>
  );

});