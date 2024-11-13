import { createContext, useContext, useState, useCallback } from 'react';

const SelectionContext = createContext(null);
const UpdateSelectionContext = createContext(null);

// provider
export function Vis({ children }) {
  const [selection, setSelection] = useState({ hover: {} });
  const updateSelection = useCallback(
    (selectionType, selectionLabel, selectionData) => {
      const newSelection = { ...selection };
      if (selectionType === 'hover') {
        const currentData = newSelection[selectionType][selectionLabel];
        if (currentData === selectionData ||
            currentData?.[0] === selectionData?.[0]) {
          return;
        }
        newSelection[selectionType][selectionLabel] = selectionData;
        setSelection(newSelection);
      }
    },
    []
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