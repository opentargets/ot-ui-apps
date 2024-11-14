// can omit frame and pass plot as second argument
export function fromFrameOrPlot(keys, frame, plot) {
  const o = {};
  for (const key of keys) {
    o[key] = frame?.[key] ?? plot?.[key];
  }
  return o;
}