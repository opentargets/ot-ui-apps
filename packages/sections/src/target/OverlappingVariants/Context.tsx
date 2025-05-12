// !! IMPORT SEARCH LIBRARTY HERE UNTIL DECIDE IF USING IT !!
import Fuse from "https://cdn.jsdelivr.net/npm/fuse.js@7.1.0/dist/fuse.mjs";

import { useMemo } from "react";

import { createContext, useContext, useReducer, ReactNode } from "react";
import { reducer, getInitialState, actions } from "./Reducer";
// import { useQuery } from "@apollo/client";

// !! NEED TO CREATE STATE AND DISPATCH TYPES ??

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

export function StateProvider({ children, data, query, variables }: ProviderProps) {
  const initialState = getInitialState({ data, query, variables });
  const [state, dispatch] = useReducer(reducer, initialState);

  const filteredRows = useMemo(() => {
    let rows = data.proteinCodingCoordinates.rows;
    if (state.searchText) {
      const fuse = new Fuse(rows, { keys: ["diseases.name"] });
      rows = fuse.search(state.searchText).map(row => row.item);
    }
    if (state.therapeuticAreas.length > 0) {
      const selectedAreas = new Set(state.therapeuticAreas);
      rows = rows.filter(row => {
        // !! UPDATE BELOW TO USE CORRECT FIELD AND SHAPE WHEN API UPDATED
        for (const area of row.therapeuticAreas ?? []) {
          if (selectedAreas.has(area)) return true;
        }
        return false;
      });
    }
    return rows;
  }, [state]);

  return (
    <StateContext.Provider value={{ state, filteredRows }}>
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
  for (const [name, actionFn] of Object.entries(actions)) {
    wrappedActions[name] = newValue => context(actionFn(newValue));
  }
  return wrappedActions;
}
