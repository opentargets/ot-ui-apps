import Mark from "./Mark";

export default function Segment({ data, dataFrom, missing = "throw", hover, ...accessors }) {
  const markChannels = [
    "x",
    "xx",
    "y",
    "yy",
    "dx",
    "dy",
    "stroke",
    "strokeOpacity",
    "strokeWidth",
    "strokeCap",
    "strokeDasharray",
    "pointerEvents",
  ];

  const tagName = "line";

  function createAttrs(row) {
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
    if (row.strokeDasharray) attrs.strokeDasharray = row.strokeDasharray;
    if (row.pointerEvents) attrs.pointerEvents = row.pointerEvents;
    return attrs;
  }

  return (
    <Mark
      {...{
        data,
        dataFrom,
        missing,
        hover,
        accessors,
        tagName,
        markChannels,
        createAttrs,
      }}
    />
  );
}
