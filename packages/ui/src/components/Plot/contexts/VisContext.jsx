import { createContext, useContext, useState, useCallback } from 'react';

const SelectionContext = createContext(null);
const UpdateSelectionContext = createContext(null);

// provider
export function Vis({ children }) {
  const [selection, setSelection] = useState({ hover: null});
  const updateSelection = useCallback(
    (selectionType, newData) => {
      if (selectionType === 'hover') {
        if (selection.hover === newData ||
            selection.hover?.[0] === newData?.[0]) {
          return;
        }
        setSelection({ hover: newData });
      }
    },
    [selection]
  );

  return (
    <SelectionContext.Provider value={selection}>
      <UpdateSelectionContext.Provider value={updateSelection}>
        {children}
      </UpdateSelectionContext.Provider>
    </SelectionContext.Provider>
  );
}

export function useVisSelection() {
  return useContext(SelectionContext);
}

export function useVisUpdateSelection() {
  return useContext(UpdateSelectionContext);
}

export function useVisClearSelection() {
  const visUpdateSelection = useVisUpdateSelection();
  return () => visUpdateSelection('hover', null);
}