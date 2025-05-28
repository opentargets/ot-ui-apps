import type { ReactElement, Dispatch } from "react";
import { createContext, useContext, useReducer, useEffect, useMemo } from "react";
import type {
  TABLE_PREFIX,
  INTERACTORS_SOURCES,
  INTERACTORS_SOURCE_THRESHOLD,
  InteractorsSource,
} from "../associationsUtils";
import useAotfContext from "../hooks/useAotfContext";

// Types
export type FocusElementTable = "core" | "pinned" | "upload";

export type FocusElement = {
  table: FocusElementTable;
  row: string;
  interactorsRow: string | null;
  interactorsSource: InteractorsSource | null;
  interactors: boolean;
  section: null | [string, string];
  interactorsSection: null | [string, string];
  interactorsThreshold: number | null;
};

export type FocusState = FocusElement[];

export enum FocusActionType {
  RESET = "RESET",
  SET_INTERACTORS_ON = "SET_INTERACTORS_ON",
  SET_INTERACTORS_OFF = "SET_INTERACTORS_OFF",
  SET_INTERACTORS_SECTION = "SET_INTERACTORS_SECTION",
  SET_INTERACTORS_THRESHOLD = "SET_INTERACTORS_THRESHOLD",
  CLEAR_INTERACTORS_SECTION = "CLEAR_INTERACTORS_SECTION",
  SET_FOCUS_SECTION = "SET_FOCUS_SECTION",
  CLEAR_FOCUS_CONTEXT_MENU = "CLEAR_FOCUS_CONTEXT_MENU",
  SET_FOCUS_CONTEXT_MENU = "SET_FOCUS_CONTEXT_MENU",
  SET_INTERACTORS_SOURCE = "SET_INTERACTORS_SOURCE",
}

export type FocusAction =
  | { type: FocusActionType.RESET }
  | {
      type: FocusActionType.SET_FOCUS_CONTEXT_MENU;
      focus: { row: string; table: FocusElementTable };
    }
  | {
      type: FocusActionType.CLEAR_FOCUS_CONTEXT_MENU;
      focus: { row: string; table: FocusElementTable };
    }
  | {
      type: FocusActionType.SET_FOCUS_SECTION;
      focus: { row: string; table: FocusElementTable; section: [string, string] };
    }
  | { type: FocusActionType.SET_INTERACTORS_ON; focus: { row: string; table: FocusElementTable } }
  | { type: FocusActionType.SET_INTERACTORS_OFF; focus: { row: string; table: FocusElementTable } }
  | {
      type: FocusActionType.SET_INTERACTORS_SOURCE;
      focus: { row: string; table: FocusElementTable; source: InteractorsSource };
    }
  | {
      type: FocusActionType.SET_INTERACTORS_SECTION;
      focus: {
        row: string;
        table: FocusElementTable;
        section: [string, string];
        interactorsRow: string;
      };
    }
  | {
      type: FocusActionType.SET_INTERACTORS_THRESHOLD;
      focus: {
        row: string;
        table: FocusElementTable;
        interactorsThreshold: number;
      };
    };

// Default values and context setup
const defaultFocusElement: FocusElement = {
  table: TABLE_PREFIX.CORE,
  row: "",
  section: null,
  interactors: false,
  interactorsRow: null,
  interactorsSection: null,
  interactorsSource: INTERACTORS_SOURCES.INTACT,
  interactorsThreshold: INTERACTORS_SOURCE_THRESHOLD[INTERACTORS_SOURCES.INTACT],
};

const AssociationsFocusContext = createContext<FocusState>([]);
const AssociationsFocusDispatchContext = createContext<Dispatch<FocusAction>>(() => undefined);

// Helper functions
/**
 * Creates a new focus element with defaults overridden by provided params
 */
function createFocusElement(params: Partial<FocusElement> = {}): FocusElement {
  return {
    ...defaultFocusElement,
    ...params,
  };
}

/**
 * Gets the current state of a focus element based on table, row, and section
 * Returns active states for different aspects of the focus element
 */
function getFocusElementState(
  state: FocusState,
  {
    table,
    row,
    section,
  }: { table: FocusElementTable; row: string; section: [string, string] | null }
) {
  let sectionActive = false;
  let rowActive = false;
  let tableActive = false;
  let interactorsActive = false;
  let hasSectionActive = false;

  // Find matching elements in state
  for (const el of state) {
    if (!tableActive && el.table === table) {
      tableActive = true;
    }

    if (el.row === row && el.table === table) {
      rowActive = true;
      interactorsActive = el.interactors;
      hasSectionActive = Array.isArray(el.section);

      // Check if section matches
      if (section && el.section && el.section[0] === section[0] && el.section[1] === section[1]) {
        sectionActive = true;
        break;
      }
    }
  }

  return { sectionActive, rowActive, tableActive, interactorsActive, hasSectionActive };
}

// Reducer handlers for complex state transformations
/**
 * Handles the action to set focus on a specific section
 * Can toggle sections on/off and resets other focus elements in the same table
 */
function handleSetFocusSection(focusState: FocusState, action: FocusAction): FocusState {
  if (action.type !== FocusActionType.SET_FOCUS_SECTION) return focusState;

  const { table, row, section } = action.focus;
  const matchingIndex = focusState.findIndex(
    element => element.table === table && element.row === row
  );

  // Step 1: Process the target element
  let updatedElements: FocusState = [];

  if (matchingIndex !== -1) {
    const element = focusState[matchingIndex];
    const isSameSection =
      element.section && element.section[0] === section[0] && element.section[1] === section[1];

    if (isSameSection && element.interactors) {
      // Close section if it's the same and interactors are active
      updatedElements = [
        ...focusState.slice(0, matchingIndex),
        { ...element, section: null },
        ...focusState.slice(matchingIndex + 1),
      ];
    } else if (isSameSection && !element.interactors) {
      // Remove element if same section and interactors are off
      updatedElements = [
        ...focusState.slice(0, matchingIndex),
        ...focusState.slice(matchingIndex + 1),
      ];
    } else {
      // Update section for same row
      updatedElements = [
        ...focusState.slice(0, matchingIndex),
        {
          ...element,
          interactorsRow: null,
          interactorsSection: null,
          section: section,
        },
        ...focusState.slice(matchingIndex + 1),
      ];
    }
  } else {
    // Create new element if it doesn't exist
    updatedElements = [
      ...focusState,
      createFocusElement({
        row,
        table,
        section,
      }),
    ];
  }

  // Step 2: Process other elements in the state
  return updatedElements.filter(element => {
    // Keep the element we just processed
    if (element.table === table && element.row === row) {
      return true;
    }

    // Handle other elements in the same table
    if (element.table === table) {
      // Keep with reset states if it has interactors
      if (element.interactors) {
        element.section = null;
        element.interactorsSection = null;
        element.interactorsRow = null;
        return true;
      }
      // Remove if in same table with interactors off
      return false;
    }

    // Keep elements from different tables
    return true;
  });
}

/**
 * Handles the action to turn on interactors for a specific row
 * Updates existing elements or creates a new one if needed
 */
function handleSetInteractorsOn(focusState: FocusState, action: FocusAction): FocusState {
  if (action.type !== FocusActionType.SET_INTERACTORS_ON) return focusState;

  const { table, row } = action.focus;
  const existingElementIndex = focusState.findIndex(
    element => element.table === table && element.row === row
  );

  // Process existing elements
  const updatedElements = focusState.map(element => {
    if (element.table === table && element.row === row) {
      // Update existing element
      return {
        ...element,
        interactors: true,
      };
    } else if (element.table === table && element.section) {
      // Update other elements in same table with sections
      return {
        ...element,
        interactors: false,
      };
    }
    // Keep other elements unchanged
    return element;
  });

  // Add new element if it doesn't exist
  if (existingElementIndex === -1) {
    return [
      ...updatedElements,
      createFocusElement({
        row,
        table,
        interactors: true,
      }),
    ];
  }

  return updatedElements;
}

/**
 * Handles setting interactors section on a specific row
 * Toggles sections on/off and updates other elements in the same table
 */
function handleSetInteractorsSection(focusState: FocusState, action: FocusAction): FocusState {
  if (action.type !== FocusActionType.SET_INTERACTORS_SECTION) return focusState;

  const { table, row, interactorsRow, section } = action.focus;

  return focusState.map(element => {
    // Active row
    if (element.table === table && element.row === row) {
      const isSameSection =
        element.interactorsRow === interactorsRow &&
        element.interactorsSection &&
        section &&
        element.interactorsSection[0] === section[0] &&
        element.interactorsSection[1] === section[1];

      // Toggle off if section already active
      if (isSameSection) {
        return {
          ...element,
          interactorsRow: null,
          interactorsSection: null,
        };
      }

      // Set section on element
      return {
        ...element,
        interactorsRow,
        interactorsSection: section,
        section: null,
      };
    }

    // Reset other elements in same table with interactors
    if (element.table === table && element.interactors) {
      return {
        ...element,
        interactorsRow: null,
        interactorsSection: null,
      };
    }

    // Keep other elements unchanged
    return element;
  });
}

/**
 * Sets interactors source for a specific row
 */
function handleSetInteractorsSource(focusState: FocusState, action: FocusAction): FocusState {
  if (action.type !== FocusActionType.SET_INTERACTORS_SOURCE) return focusState;

  const { table, row, source } = action.focus;

  return focusState.map(element => {
    if (element.table === table && element.row === row) {
      return {
        ...element,
        interactorsSection: null,
        interactorsSource: source,
        interactorsThreshold: INTERACTORS_SOURCE_THRESHOLD[source],
      };
    }
    return element;
  });
}

/**
 * Sets interactors threshold for a specific row
 */
function handleSetInteractorsThreshold(focusState: FocusState, action: FocusAction): FocusState {
  if (action.type !== FocusActionType.SET_INTERACTORS_THRESHOLD) return focusState;

  const { table, row, interactorsThreshold } = action.focus;

  return focusState.map(element => {
    if (element.table === table && element.row === row) {
      return {
        ...element,
        interactorsThreshold,
      };
    }
    return element;
  });
}

/**
 * Handles context menu focus setting
 */
function handleSetFocusContextMenu(focusState: FocusState, action: FocusAction): FocusState {
  if (action.type !== FocusActionType.SET_FOCUS_CONTEXT_MENU) return focusState;

  const { table, row } = action.focus;
  const { rowActive } = getFocusElementState(focusState, { table, row, section: null });

  // Skip if row is already active
  if (rowActive) {
    return focusState;
  }

  // Add new element
  return [
    ...focusState,
    createFocusElement({
      row,
      table,
    }),
  ];
}

/**
 * Handles clearing context menu focus
 */
function handleClearFocusContextMenu(focusState: FocusState, action: FocusAction): FocusState {
  if (action.type !== FocusActionType.CLEAR_FOCUS_CONTEXT_MENU) return focusState;

  const { table, row } = action.focus;
  const { rowActive, hasSectionActive, interactorsActive } = getFocusElementState(focusState, {
    table,
    row,
    section: null,
  });

  // Keep if row has section or interactors active
  if (rowActive && (hasSectionActive || interactorsActive)) {
    return focusState;
  }

  // Remove element
  return focusState.filter(element => element.row !== row || element.table !== table);
}

/**
 * Handles the SET_INTERACTORS_OFF action
 */
function handleSetInteractorsOff(focusState: FocusState, action: FocusAction): FocusState {
  if (action.type !== FocusActionType.SET_INTERACTORS_OFF) return focusState;

  const { table, row } = action.focus;

  // Remove elements with no section
  const filteredElements = focusState.filter(
    element => !(element.table === table && element.row === row && element.section === null)
  );

  // Update existing elements
  return filteredElements.map(element => {
    if (element.table === table && element.row === row) {
      return {
        ...element,
        interactors: false,
        interactorsSection: null,
      };
    }
    return element;
  });
}

/**
 * Main reducer function for focus state
 * Delegates to specialized handlers for complex state transformations
 */
function focusReducer(focusState: FocusState, action: FocusAction): FocusState {
  switch (action.type) {
    case FocusActionType.SET_FOCUS_SECTION:
      return handleSetFocusSection(focusState, action);

    case FocusActionType.SET_FOCUS_CONTEXT_MENU:
      return handleSetFocusContextMenu(focusState, action);

    case FocusActionType.CLEAR_FOCUS_CONTEXT_MENU:
      return handleClearFocusContextMenu(focusState, action);

    case FocusActionType.SET_INTERACTORS_ON:
      return handleSetInteractorsOn(focusState, action);

    case FocusActionType.SET_INTERACTORS_OFF:
      return handleSetInteractorsOff(focusState, action);

    case FocusActionType.SET_INTERACTORS_SECTION:
      return handleSetInteractorsSection(focusState, action);

    case FocusActionType.SET_INTERACTORS_SOURCE:
      return handleSetInteractorsSource(focusState, action);

    case FocusActionType.SET_INTERACTORS_THRESHOLD:
      return handleSetInteractorsThreshold(focusState, action);

    case FocusActionType.RESET:
      return [];

    default:
      throw Error(`Unknown action: ${(action as any).type}`);
  }
}

// Custom hooks for accessing focus state
/**
 * Creates a selector function to get focus state for a specific element
 */
export function useFocusElementState(
  table: FocusElementTable,
  row: string,
  section: [string, string] | null = null
) {
  const focusState = useContext(AssociationsFocusContext);

  return useMemo(() => {
    return getFocusElementState(focusState, { table, row, section });
  }, [focusState, table, row, section]);
}

/**
 * Gets the focus element for a specific row if it exists
 */
export function useFocusElement(table: FocusElementTable, row: string) {
  const focusState = useContext(AssociationsFocusContext);

  return useMemo(() => {
    return focusState.find(element => element.table === table && element.row === row) || null;
  }, [focusState, table, row]);
}

/**
 * Provider component for focus state
 */
export function AssociationsFocusProvider({ children }: { children: ReactElement }): ReactElement {
  const [focusState, dispatch] = useReducer(focusReducer, []);
  const { id } = useAotfContext();

  // Reset focus state when ID changes
  useEffect(() => {
    dispatch({ type: FocusActionType.RESET });
  }, [id]);

  useEffect(() => {
    console.log({ focusState });
  });

  return (
    <AssociationsFocusContext.Provider value={focusState}>
      <AssociationsFocusDispatchContext.Provider value={dispatch}>
        {children}
      </AssociationsFocusDispatchContext.Provider>
    </AssociationsFocusContext.Provider>
  );
}

/**
 * Hook to access the focus state
 */
export function useAssociationsFocus(): FocusState {
  return useContext(AssociationsFocusContext);
}

/**
 * Hook to access the focus dispatch function
 */
export function useAssociationsFocusDispatch(): Dispatch<FocusAction> {
  return useContext(AssociationsFocusDispatchContext);
}
