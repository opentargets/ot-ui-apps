import { memo } from "react";
import { useVisSelection } from "../../contexts/VisContext";
import { usePlot } from "../../contexts/PlotContext";
import { useFrame } from "../../contexts/FrameContext";
import { fromFrameOrPlot } from "../../util/fromFrameOrPlot";
import { isIterable } from "../../util/helpers";
import { finalData } from "../../util/finalData";
import { processAccessors } from "../../util/processAccessors";
import { rowValues } from "../../util/rowValues";
import { OTHER } from "../../util/constants";
import DynamicTag from "../util/DynamicTag";

export default memo(function SelectionMark({
      data,
      dataFrom,  // SelectionMark is only used the dataFrom prop is used
      missing,
      accessors,
      markChannels,
      tagName,
      createAttrs,
    }) {

  // console.log(`selection mark render: ${tagName}`);

  const visSelection = useVisSelection(); 
  if (!visSelection) {
    throw Error("the dataFrom prop can only be used inside a VisProvider");
  }

  const plot = usePlot();
  if (!plot) {
    throw Error("mark components must appear inside a Plot component");
  }
  
  const frame = useFrame();
  const ops = fromFrameOrPlot(['data', 'scales', 'mapX', 'mapY'], frame, plot);
  const { scales, mapX, mapY } = ops;

  const parts = dataFrom.trim().split('-');
  const selectionType = parts[0];
  const selectionLabel = parts.slice(1).join('-') || OTHER;
  if (selectionType !== 'hover') {
    throw Error(`"${selectionType}" is not a valid selection type`);
  }
  if (data && typeof data !== 'function') {
    throw Error(
      'when the dataFrom prop is used, the data prop must be omitted or be a function'
    );
  }
  const selectedData = visSelection[selectionType][selectionLabel];
  // eslint-disable-next-line
  data = selectedData ? finalData(selectedData, data) : [];

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
      attrs.pointerEvents = "none";
      marks.push(
        <DynamicTag tagName={tagName} key={rowIndex} {...attrs} />
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