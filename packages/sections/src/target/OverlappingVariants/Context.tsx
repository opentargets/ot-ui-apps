import { createContext, useContext, useReducer, ReactNode } from "react";
import { reducer, getInitialState, actions } from "./Reducer";
import { useQuery } from "@apollo/client";

interface StateContextType {
  state: State;
}

interface DispatchContextType {
  dispatch: Dispatch<Action>;
}

interface ProviderProps {
  children: ReactNode;
  data: [];
}

const StateContext = createContext<StateContextType | undefined>(undefined);
const DispatchContext = createContext<DispatchContextType | undefined>(undefined);

export function StateProvider({ children, data }: ProviderProps) {
  const initialState = getInitialState(data);
  const [state, dispatch] = useReducer(reducer, initialState);
  // const { data, loading, error } = useQuery(query, { variables: { freeSearch: state.searchText } });

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>{children}</DispatchContext.Provider>
    </StateContext.Provider>
  );
}

// custom hooks to use the contexts
export function useStateValue() {
  const context = useContext(StateContext);
  if (context === undefined) {
    throw new Error("useStateValue must be used within a StateProvider");
  }
  return context;
}

export function useDispatch() {
  const context = useContext(DispatchContext);
  if (context === undefined) {
    throw new Error("useDispatch must be used within a StateProvider");
  }
  return context;
}

export function useActions() {
  const context = useContext(DispatchContext);
  if (context === undefined) {
    throw new Error("useActions must be used within a StateProvider");
  }
  const wrappedActions = {};
  for (const [name, actionFn] of actions) {
    wrappedActions[name] = newValue => context(actionFn(newValue));
  }
  return wrappedActions;
}
