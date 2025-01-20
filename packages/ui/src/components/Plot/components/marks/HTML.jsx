import Mark from "./Mark";

export default function HTML({ data, dataFrom, missing = "throw", hover, ...accessors }) {
  const markChannels = [
    "x",
    "y",
    "dx",
    "dy",
    "pxWidth",
    "pxHeight",
    "content",
    "anchor",
    "pointerEvents",
  ];

  const tagName = "foreignObject";

  function createAttrs(row) {
    const attrs = {
      width: row.pxWidth,
      height: row.pxHeight,
    };
    const [x, y] = anchorPoint(row.x, row.y, row.pxWidth, row.pxHeight, row.anchor);
    attrs.x = x + row.dx;
    attrs.y = y + row.dy;
    if (row.pointerEvents) attrs.pointerEvents = row.pointerEvents;
    return attrs;
  }

  function createContent(row) {
    return (
      <div style={{ width: "100%", height: "100%" }} xmlns="http://www.w3.org/1999/xhtml">
        {row.content}
      </div>
    );
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
        createContent,
        createAttrs,
      }}
    />
  );
}

function anchorPoint(x, y, w, h, anchor) {
  switch (anchor) {
    case "middle":
      return [x - w / 2, y - h / 2];
    case "top":
      return [x - w / 2, y];
    case "top-right":
      return [x - w, y];
    case "right":
      return [x - w, y];
    case "bottom-right":
      return [x - w, y - h];
    case "bottom":
      return [x - w / 2, y - h];
    case "bottom-left":
      return [x, y - h];
    case "left":
      return [x, y - h / 2];
    default:
      return [x, y]; // 'top-left'
  }
}
