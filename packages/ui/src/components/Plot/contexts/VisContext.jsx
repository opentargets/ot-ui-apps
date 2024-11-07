
import { createContext, useContext, useReducer } from 'react';

const VisContext = createContext(null);
const VisDispatchContext = createContext(null);

export function VisProvider({ children, data = null }) {
  
  const initialState = { 
    data,
    selected: {},  // individual points that are selected
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
  
  // switch(action.type) {

    // case 'select': {
    //   const newState = {};
    //   newState.selected[action.] = action.data;
    //   }
    // }

  // }

  // !! IF ACTION REPLACES DATA, SET selected TO {} - AND ANY OTHER
  // INTERACTION IBJECTS THAT INTRODUCE
  
  // return newState;
}