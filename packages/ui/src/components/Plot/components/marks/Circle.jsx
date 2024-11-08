import Mark from "./Mark";

export default function Circle({ data, missing = 'throw', ...accessors }) {
  
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
    'strokeDash',
    'area',
  ];

  let key = 0;
  function createMark(row) {
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
    // eslint-disable-next-line
    return <circle key={key++} {...attrs} />
  }
  
  return <Mark {...{ data, missing, accessors, markChannels, createMark }} />;
}