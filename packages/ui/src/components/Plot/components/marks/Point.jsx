import Mark from "./Mark";

export default function Point({ data, dataFrom, missing = "throw", hover, ...accessors }) {
  const markChannels = [
    "x",
    "y",
    "dx",
    "dy",
    "fill",
    "fillOpacity",
    "stroke",
    "strokeOpacity",
    "strokeWidth",
    "strokeCap",
    "strokeDasharray",
    "shape",
    "area",
    "rotation",
    "pointerEvents",
  ];

  const tagName = "g";

  function createAttrs(row) {
    const x = row.x + row.dx;
    const y = row.y + row.dy;
    const attrs = {
      transform: `translate(${x},${y})`,
    };
    return attrs;
  }

  function createContent(row) {
    const area = Math.sqrt(row.area / Math.PI);
    const attrs = {
      d: unitPaths[row.shape],
      transform: `rotate(${row.rotation}) scale(${area})`,
      fill: row.fill,
      fillOpacity: row.fillOpacity,
      stroke: row.stroke,
      strokeOpacity: row.strokeOpacity,
      strokeWidth: row.strokeWidth,
      vectorEffect: "non-scaling-stroke",
    };
    if (row.strokeCap) attrs.strokeCap = row.strokeCap;
    if (row.strokeDasharray) attrs.strokeDasharray = row.strokeDasharray;
    if (row.pointerEvents) attrs.pointerEvents = row.pointerEvents;
    return <path {...attrs} />;
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
        createContent,
      }}
    />
  );
}

const unitPaths = {
  circle: "M0.564,0A0.564,0.564,0,1,1,-0.564,0A0.564,0.564,0,1,1,0.564,0",
  cross:
    "M-0.671,-0.224L-0.224,-0.224L-0.224,-0.671L0.224,-0.671L0.224,-0.224L0.671,-0.224L0.671,0.224L0.224,0.224L0.224,0.671L-0.224,0.671L-0.224,0.224L-0.671,0.224Z",
  diamond: "M0,-0.931L0.537,0L0,0.931L-0.537,0Z",
  square: "M-0.5,-0.5h1v1h-1Z",
  star: "M0,-0.944L0.212,-0.292L0.898,-0.292L0.343,0.111L0.555,0.764L0,0.361L-0.555,0.764L-0.343,0.111L-0.898,-0.292L-0.212,-0.292Z",
  triangle: "M0,-0.877L0.76,0.439L-0.76,0.439Z",
  wye: "M0.27,0.156L0.27,0.696L-0.27,0.696L-0.27,0.156L-0.737,-0.114L-0.467,-0.581L0,-0.312L0.467,-0.581L0.737,-0.114Z",
};
