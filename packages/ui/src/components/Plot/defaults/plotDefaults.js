export const plotDefaults = {

  data: null,
  scales: {},
  xReverse: false,
  yReverse: false,
  width: 260,
  minWidth: null,
  maxWidth: null,
  height: 260,
  setPanelSize: false,
  padding: 40,  // number or object with props 'top', 'left', 'bottom', 'right'
  background: 'transparent',
  cornerRadius: 0,
  
  // font defaults for labels and titles - not used by marks
  fontFamily: 'sans-serif',
  fontSize: '11px',
  fontStyle: 'normal',
  fontWeight: 'normal',
  fontColor: '#000',

  // axis, titles, ticks, labels
  axisPadding: 0,  // axis, tick, label and title padding is from edge of panel
  axisColor: '#888',
  axisWidth: 1,
  tickPadding: 0,
  tickColor: '#888',
  tickLength: 5,
  tickWidth: 1,
  labelPadding: 7,
  titlePadding: 24,
  gridColor: '#ddd',
  gridWidth: 1,
  xTick: null,
  yTick: null,

};