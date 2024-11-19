import Mark from "./Mark";

export default function Circle({
  data,
  dataFrom,
  missing = 'throw',
  hover,
  ...accessors
}) {

  const markChannels = [
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
    'strokeDasharray',
    'area',
    'pointerEvents',
  ];

  const tagName = 'circle';

  function createAttrs(row) {
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
    if (row.strokeDasharray) attrs.strokeDasharray = row.strokeDasharray;
    if (row.pointerEvents) attrs.pointerEvents = row.pointerEvents;
    return attrs;
  }

  return <Mark {...{
    data,
    dataFrom,
    missing,
    hover,
    accessors,
    tagName,
    markChannels,
    createAttrs,
  }} />;

}