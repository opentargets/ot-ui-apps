import Mark from "./Mark";

export default function Segment({ data, missing = 'throw', ...accessors }) {

  const markChannels = [
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
  ];

  let key = 0;
  function createMark(row) {
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
    // eslint-disable-next-line
    return <line key={key++} {...attrs} />
  }
  
  return <Mark {...{ data, missing, accessors, markChannels, createMark }} />;
}