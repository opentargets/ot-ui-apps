import Mark from "./Mark";

export default function Rect({
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
    'xx',
    'yy',
    'dxx',
    'dyy',
    'fill',
    'fillOpacity',
    'stroke',
    'strokeOpacity',
    'strokeWidth',
    'strokeCap',
    'strokeDasharray',
    'pointerEvents',
  ];

  const tagName = 'path';
  
  function createAttrs(row) {
    const x = row.x + row.dx;
    const y = row.y + row.dy;
    const xx = row.xx + (row.dxx ?? row.dx);
    const yy = row.yy + (row.dyy ?? row.dy);
    const attrs = {
      d: `M ${x},${y} L ${xx},${y} L ${xx},${yy} L ${x},${yy} Z`,
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