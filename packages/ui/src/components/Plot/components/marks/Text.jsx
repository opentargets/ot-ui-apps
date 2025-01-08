import Mark from "./Mark";

export default function Text({ data, dataFrom, missing = "throw", hover, ...accessors }) {
  const markChannels = [
    "x",
    "y",
    "dx",
    "dy",
    "fill",
    "fillOpacity",
    "text",
    "fontFamily",
    "fontSize",
    "fontStyle",
    "fontWeight",
    "textAnchor",
    "dominantBaseline",
    "transformOrigin",
    "transformBox",
    "transform",
    "pointerEvents",
  ];

  const tagName = "text";

  function createAttrs(row) {
    const style = {
      transformOrigin: row.transformOrigin,
      transformBox: row.transformBox,
    };
    if (row.transform) style.transform = row.transform;

    const attrs = {
      x: row.x + row.dx,
      y: row.y + row.dy,
      fill: row.fill,
      fillOpacity: row.fillOpacity,
      fontFamily: row.fontFamily,
      fontSize: row.fontSize,
      fontStyle: row.fontStyle,
      fontWeight: row.fontWeight,
      textAnchor: row.textAnchor,
      dominantBaseline: row.dominantBaseline,
      style,
    };
    if (row.pointerEvents) attrs.pointerEvents = row.pointerEvents;
    return attrs;
  }

  function createContent(row) {
    return row.text;
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
