import { useReducer } from "react";

const StateContext = createContext({});
const DispatchContext = createContext({});

export function ViewerProvider({ children, initialState, actions }) {
  const [viewerState, dispatch] = useReducer(reducer, initialState);

  function reducer(state, { type, value }) {
    if (!actions[type]) {
      throw Error("invalid action");
    }
    return actions[type](state, value);
  }

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

export function useViewerActions() {
  const context = useContext(DispatchContext);
  if (context === undefined) {
    throw new Error("useStateActions must be used within a ViewerProvider");
  }
  const wrappedActions = {};

  // !!!! HERE !!!! - BUT DON'T KNOW ACTIONS HERE - WILL NEED TO USE FACTORY FUNCTION

  for (const type of Object.keys(actions)) {
    wrappedActions[type] = value => context({ type, value });
  }
  return wrappedActions;
}
