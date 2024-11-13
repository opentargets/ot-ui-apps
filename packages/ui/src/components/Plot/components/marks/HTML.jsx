import Mark from "./Mark";

export default function HTML({
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
    'pxWidth',
    'pxHeight',
    'content',
    'anchor',  // !! TO DO !!
    'pointerEvents',
  ];

  const tagName = 'foreignObject';
  
  function createAttrs(row) {
    const attrs = {
      x: row.x + row.dx,  // !! MODIFY X AND Y BASED ON ANCHOR !!
      y: row.y + row.dy,
      width: row.pxWidth,
      height: row.pxHeight,
    };
    if (row.pointerEvents) attrs.pointerEvents = row.pointerEvents;
    return attrs;
  }

  function createContent(row) {
    return (
      <div xmlns="http://www.w3.org/1999/xhtml">
        {row.content}
      </div>
    );
  }
  
  return <Mark {...{
    data,
    dataFrom,
    missing,
    hover,
    accessors,
    tagName,
    markChannels,
    createContent,
    createAttrs,
  }} />;

}

// !! TO DO !!
// function xyToAnchor(x, y, width, height, anchor) {
//   switch (anchor) {
//   }
// }