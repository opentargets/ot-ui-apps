export const channelDefaults = {

  // common
  x: 0,
  y: 0,
  dx: 0,  // pixels
  dy: 0,  // pixels
  fill: '#000',
  fillOpacity: 1,
  stroke: '#000',
  strokeOpacity: 1,
  strokeWidth: 0,  // !! MUST SET STROKE WIDTHS TO SEE LINES !!
  strokeCap: null,
  strokeDasharray: null,
  pointerEvents: null,  // though 'none' is the default for selection marks

  // special - only used by one/few marks
  xx: 0,               // HBar, Segment, HLink, VLink, Edge, VBand
  yy: 0,               // VBar, Segment, HLink, VLink, Edge, HBand
  shape: 'circle',     // Point
  area: 36,            // Circle, Point
  cornerRadius: null,  // HBar, VBar, Rect
  width: 1,            // VBar, Rect, (x units)
  height: 1,           // HBar, Rect, (y units)
  pxWidth: 1,          // VBar, Rect, HTML (pixels)
  pxHeight: 1,         // HBar, Rect, HTML (pixels)
  tension: 0.5,        // Edge
  clockwise: true,     // Edge
  path: null,          // Path
  text: '',                     // Text
  fontFamily: 'sans-serif',     // Text
  fontSize: '11px',             // Text
  fontStyle: 'normal',          // Text
  fontWeight: 'normal',         // Text
  textAnchor: 'middle',         // Text
  dominantBaseline: 'middle',   // Text
  transformOrigin: 'center',    // Text (CSS)
  transformBox: 'fill-box',     // Text (CSS)
  transform: null,              // Text (CSS)
  content: null,                // HTML
  anchor: 'top-left'            // HTML
};