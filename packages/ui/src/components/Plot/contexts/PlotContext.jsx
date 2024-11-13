
import { createContext, useContext, useReducer } from 'react';
import { safeAssign } from '../util/helpers';
import { plotDefaults } from '../defaults/plotDefaults';
import { addXYMaps } from '../util/addXYMaps';
import { onlyValidScales } from '../util/assert';

const PlotContext = createContext(null);
const PlotDispatchContext = createContext(null);

export function PlotProvider({ children, options }) {

  const initialState = safeAssign({ ...plotDefaults }, options);

  // compute values related to plot size and panel spacing
  let { padding } = initialState;
  if (typeof padding === 'number') {
    padding = { top: padding, right: padding, bottom: padding, left: padding };
    initialState.padding = padding;
  }
  const { scales } = initialState;
  onlyValidScales(scales);
  updateSize(initialState);

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

function reducer(state, action) {

  switch(action.type) {
    
    case 'updateSize': {
      const newState = { ...state };
      updateSize(newState, action.width, action.height);
      return newState;
    }

  }

}

// update width and height of state and properties that depend on them
function updateSize(state, width, height) {
  if (width != null) state.width = width;
  if (height != null) state.height = height;
  const { padding, scales } = state;
  state.panelWidth = state.width - padding.left - padding.right;
  state.panelHeight = state.height - padding.top - padding.bottom;
  scales.x?.range?.([0, state.panelWidth]);
  scales.y?.range?.([0, state.panelHeight]);
  addXYMaps(state);
  state.xTick ??= scales.x?.ticks?.() ?? scales.x?.domain();
  state.yTick ??= scales.y?.ticks?.() ?? scales.y?.domain();
}