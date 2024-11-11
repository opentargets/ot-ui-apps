
import { createContext, useContext, useState, useCallback } from 'react';
import { OTHER } from '../util/constants';

const VisContext = createContext(null);

export function VisProvider({ children, data = null }) {
  
  let setData;
  // eslint-disable-next-line
  [data, setData] = useState(data);

  // use a getter function for selection so only components that depend on
  // selection rerender when it changes
  const [_selection, _setSelection] = useState({ hover: {} });
  
  const getSelection = useCallback((selectionType, selectionLabel = OTHER) => {
    return _selection[selectionType][selectionLabel];
  }, [_selection]);
  const setSelection = useCallback(
    (selectionType, selectionLabel, selectionData) => {
      const newSelection = { ..._selection };
      newSelection[selectionType][selectionLabel] = selectionData;
      _setSelection(newSelection);
    },
    [_selection, _setSelection]
  );

  return (
    <VisContext.Provider value={{ data, setData, getSelection, setSelection }}>
      {children}
    </VisContext.Provider>
  );
}
 
export function useVis() {
  return useContext(VisContext);
}