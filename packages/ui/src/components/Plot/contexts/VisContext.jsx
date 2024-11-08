
import { createContext, useContext, useReducer } from 'react';

const VisContext = createContext(null);
const VisDispatchContext = createContext(null);

export function VisProvider({ children, data = null }) {
  
  const initialState = { 
    data,
    tooltip: null,
  };

  const [state, stateDispatch] = useReducer(reducer, initialState);

  return (
    <VisContext.Provider value={state}>
      <VisDispatchContext.Provider value={stateDispatch}>
        {children}
      </VisDispatchContext.Provider>
    </VisContext.Provider>
  );
}
 
export function useVis() {
  return useContext(VisContext);
}

export function useVisDispatch() {
  return useContext(VisDispatchContext);
}
                                    
// data reducer
function reducer(state, action) {
  
  switch(action.type) {

    case 'tooltip': {
      const newState = { ...state };
      newState.tooltip = action.data;
      return newState;
    }

  }

  // !! IF ACTION REPLACES DATA, SET tooltip TO {} - AND ANY OTHER
  // INTERACTION OBJECTS THAT INTRODUCE
  
}