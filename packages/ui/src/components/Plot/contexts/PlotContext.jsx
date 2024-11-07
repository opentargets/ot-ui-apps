
import { createContext, useContext, useReducer } from 'react';
import { useVis } from './VisContext';
import { safeAssign } from '../util/helpers';
import { finalData } from '../util/finalData';
import { plotDefaults } from '../defaults/plotDefaults';
import { addXYMaps } from '../util/addXYMaps';
import { onlyValidScales } from '../util/assert';

const PlotContext = createContext(null);
const PlotDispatchContext = createContext(null);

export function PlotProvider({ children, options }) {
  
  const vis = useVis();
  const initialState = safeAssign({ ...plotDefaults }, options);
  initialState.data = finalData(vis?.data, initialState.data);
  
  // compute values related to plot and panel spacing
  let { padding } = initialState;
  if (typeof padding === 'number') {
    padding = { top: padding, right: padding, bottom: padding, left: padding };
    initialState.padding = padding;
  }
  initialState.panelWidth = initialState.width - padding.left - padding.right;
  initialState.panelHeight = initialState.height - padding.top - padding.bottom;
  const { scales } = initialState;
  onlyValidScales(scales);
  scales.x?.range?.([0, initialState.panelWidth]);
  scales.y?.range?.([0, initialState.panelHeight]);
  addXYMaps(initialState);
  initialState.xTick ??= scales.x?.ticks?.() ?? scales.x?.domain();
  initialState.yTick ??= scales.y?.ticks?.() ?? scales.y?.domain();

  const [state, stateDispatch] = useReducer(reducer, initialState);

  return (
    <PlotContext.Provider value={state}>
      <PlotDispatchContext.Provider value={stateDispatch}>
        {children}
      </PlotDispatchContext.Provider>
    </PlotContext.Provider>
  );
}

// export hooks
export function usePlot() {
  return useContext(PlotContext);
}

export function usePlotDispatch() {
  return useContext(PlotDispatchContext);
}

// data reducer
function reducer(state, action) {

}