import { memo } from "react";
import { useVis } from "../../contexts/VisContext";
import { usePlot } from "../../contexts/PlotContext";
import { useFrame } from "../../contexts/FrameContext";
import { fromFrameOrPlot } from "../../util/fromFrameOrPlot";
import { isIterable } from "../../util/helpers";
import { finalData } from "../../util/finalData";
import { processAccessors } from "../../util/processAccessors";
import { rowValues } from "../../util/rowValues";
import { Field } from "../../../ProfileHeader";
import { OTHER } from "../../util/constants";

export default memo(function Mark({
      data,
      dataFrom,
      missing,
      hover,
      accessors,
      markChannels,
      tagName,
      createAttrs,
    }) {

    console.log(tagName);

  const vis = useVis(); 
  if ((dataFrom || hover) && !vis) {
    throw Error("dataFrom and hover props can only be used inside a VisProvider");
  }

  const plot = usePlot();
  if (!plot) {
    throw Error("mark components must appear inside a Plot component");
  }
  
  const frame = useFrame();
  const ops = fromFrameOrPlot(['data', 'scales', 'mapX', 'mapY'], frame, plot);
  const { scales, mapX, mapY } = ops;

  // get/process
  if (dataFrom) {
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
    const selectedData = vis.getSelection(selectionType, selectionLabel);
    // eslint-disable-next-line
    data = selectedData ? finalData(selectedData, data) : [];
  } else {
    // eslint-disable-next-line
    data = finalData(ops.data, data);
  }
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
        const selectionLabel = typeof hover === 'string' ? hover : OTHER;
        attrs.onMouseEnter = () => vis.setSelection(
          'hover',
          selectionLabel,
          [d],
        );
        attrs.onMouseLeave = () => vis.setSelection(
          'hover',
          selectionLabel,
          null,
        );
      }
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

function DynamicTag({ tagName, children, ...props }) {
  const Tag = tagName; // capitalize to use it as a component
  return <Tag {...props}>{children}</Tag>;
}