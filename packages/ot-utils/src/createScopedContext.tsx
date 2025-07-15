import { useReducer, useContext, createContext } from "react";

export function createScopedContext(name: string) {
  const StateContext = createContext(null);
  const DispatchContext = createContext(null);

  const ScopedProvider = ({ reducer, initialState = {}, children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    return (
      <StateContext.Provider value={state}>
        <DispatchContext.Provider value={dispatch}>
          {children}
        </DispatchContext.Provider>
      </StateContext.Provider>
    );
  };

  const useScopedState = () => {
    const context = useContext(StateContext);
    if (context === undefined) {
      throw new Error(`useStateValue must be used within the ${name ?? ""} provider`);
    }
    return context;
  };

  const useScopedDispatch = () => {
    const context = useContext(DispatchContext);
    if (context === undefined) {
      throw new Error(`useDispatch must be used within the ${name ?? ""} provider`);
    }
    return context;
  };

  return {
    ScopedProvider,
    useScopedState,
    useScopedDispatch,
  }
}

