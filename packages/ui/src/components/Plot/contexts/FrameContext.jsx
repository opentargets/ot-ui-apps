import { createContext, useContext, useReducer } from "react";
import { usePlot } from "./PlotContext";
import { finalData } from "../util/finalData";
import { addXYMaps } from "../util/addXYMaps";
import { onlyValidScales } from "../util/assert";

const FrameContext = createContext(null);
const FrameDispatchContext = createContext(null);

export function FrameProvider({ children, data, scales = {}, xTick, yTick, xReverse, yReverse }) {
  const plot = usePlot();

  const initialState = { data, scales, xTick, yTick, xReverse, yReverse };
  initialState.data = finalData(plot.data, initialState.data);
  onlyValidScales(scales);
  scales.x?.range?.([0, plot.width]);
  scales.y?.range?.([0, plot.height]);
  addXYMaps(initialState);
  if (!xTick && scales.x) {
    initialState.xTick = scales.x?.ticks?.() ?? scales.x?.domain();
  }
  if (!yTick && scales.y) {
    initialState.yTick = scales.y?.ticks?.() ?? scales.y.domain();
  }
  for (let [key, value] of Object.entries(plot.scales)) {
    scales[key] ??= value;
  }

  const [state, stateDispatch] = useReducer(reducer, initialState);

  return (
    <FrameContext.Provider value={state}>
      <FrameDispatchContext.Provider value={stateDispatch}>
        {children}
      </FrameDispatchContext.Provider>
    </FrameContext.Provider>
  );
}

// export hooks
export function useFrame() {
  return useContext(FrameContext);
}

export function useFrameDispatch() {
  return useContext(FrameDispatchContext);
}

// data reducer
function reducer(state, action) {}
