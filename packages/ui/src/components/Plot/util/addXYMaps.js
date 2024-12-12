export function addXYMaps(state) {
  const { scales } = state;

  if (scales.x) {
    state.mapX = state.xReverse ? v => state.panelWidth - scales.x(v) : scales.x;
  }

  if (scales.y) {
    state.mapY = state.yReverse ? scales.y : v => state.panelHeight - scales.y(v);
  }
}
