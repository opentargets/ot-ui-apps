import { useReducer } from "react";

const StateContext = createContext({});
const DispatchContext = createContext({});

export function ViewerProvider({ children, initialState, reducer }) {
  const [viewerState, dispatch] = useReducer(reducer, initialState);

  return (
    <StateContext.Provider value={{ viewerState }}>
      <DispatchContext.Provider value={dispatch}>{children}</DispatchContext.Provider>
    </StateContext.Provider>
  );
}

export function useViewerState() {
  const context = useContext(StateContext);
  if (context === undefined) {
    throw new Error("useViewerState must be used within a ViewerProvider");
  }
  return context;
}

export function useViewerDispatch() {
  const context = useContext(DispatchContext);
  if (context === undefined) {
    throw new Error("useViewerDispatch must be used within a ViewerProvider");
  }
  return context;
}
