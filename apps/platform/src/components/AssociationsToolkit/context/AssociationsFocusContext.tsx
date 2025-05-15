import { createContext, useContext, useReducer, Dispatch, ReactElement, useEffect } from "react";
import useAotfContext from "../hooks/useAotfContext";
import {
  TABLE_PREFIX,
  INTERACTORS_SOURCES,
  INTERACTORS_SOURCE_THRESHOLD,
  InteractorsSource,
} from "../associationsUtils";

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

const AssociationsFocusDispatchContext = createContext<Dispatch<FocusAction>>(_ => _);

type FocusElementParams = Partial<FocusElement>;

function createFocusElement(params: FocusElementParams = {}): FocusElement {
  return {
    ...defaultFocusElement,
    ...params,
  };
}

const getFocusElementState = (
  state: FocusState,
  {
    table,
    row,
    section,
  }: { table: FocusElementTable; row: string; section: [string, string] | null }
) => {
  let sectionActive = false;
  let rowActive = false;
  let tableActive = false;
  let interactorsActive = false;
  let hasSectionActive = false;
  state.forEach((el: FocusElement) => {
    if (!tableActive && el.table === table) {
      tableActive = true;
    }
    if (el.row === row && el.table === table) {
      rowActive = true;
      interactorsActive = el.interactors;
      hasSectionActive = Array.isArray(el.section);
      if (el.section?.join("-") === section?.join("-")) {
        sectionActive = true;
        return { sectionActive, rowActive, tableActive, interactorsActive, hasSectionActive };
      }
    }
  });

  return { sectionActive, rowActive, tableActive, interactorsActive, hasSectionActive };
};

function focusReducer(focusState: FocusState, action: FocusAction): FocusState {
  switch (action.type) {
    case FocusActionType.SET_FOCUS_SECTION: {
      return handleSetFocusSection(focusState, action);
    }

    case FocusActionType.SET_FOCUS_CONTEXT_MENU: {
      const { rowActive } = getFocusElementState(focusState, {
        table: action.focus.table,
        row: action.focus.row,
        section: null,
      });

      if (rowActive) {
        return focusState;
      }

      const newElement = createFocusElement({
        row: action.focus.row,
        table: action.focus.table,
      });

      return [...focusState, newElement];
    }

    case FocusActionType.CLEAR_FOCUS_CONTEXT_MENU: {
      const { rowActive, hasSectionActive, interactorsActive } = getFocusElementState(focusState, {
        table: action.focus.table,
        row: action.focus.row,
        section: null,
      });
      if (rowActive && (hasSectionActive || interactorsActive)) {
        return focusState;
      }
      return focusState.filter(
        focusElement =>
          focusElement.row !== action.focus.row || focusElement.table !== action.focus.table
      );
    }

    case FocusActionType.SET_INTERACTORS_ON: {
      return handleSetInteractorsOn(focusState, action);
    }

    case FocusActionType.SET_INTERACTORS_OFF: {
      const relevantElements = focusState.filter(
        element =>
          !(
            element.table === action.focus.table &&
            element.row === action.focus.row &&
            element.section === null
          )
      );

      return relevantElements.map(element => {
        if (element.table === action.focus.table && element.row === action.focus.row) {
          return {
            ...element,
            interactors: false,
            interactorsSection: null,
          };
        }
        return element;
      });
    }

    case FocusActionType.SET_INTERACTORS_SECTION: {
      return handleSetInteractorsSection(focusState, action);
    }

    case FocusActionType.SET_INTERACTORS_SOURCE: {
      return focusState.map(element => {
        if (element.table === action.focus.table && element.row === action.focus.row) {
          return {
            ...element,
            interactorsSection: null,
            interactorsSource: action.focus.source,
            interactorsThreshold: INTERACTORS_SOURCE_THRESHOLD[action.focus.source],
          };
        }
        return element;
      });
    }

    case FocusActionType.SET_INTERACTORS_THRESHOLD: {
      return focusState.map(element => {
        if (element.table === action.focus.table && element.row === action.focus.row) {
          return {
            ...element,
            interactorsThreshold: action.focus.interactorsThreshold,
          };
        }
        return element;
      });
    }

    case FocusActionType.RESET: {
      return [];
    }

    default: {
      throw Error("Unknown action: " + action.type);
    }
  }
}

// Helper functions for complex operations
function handleSetFocusSection(focusState: FocusState, action: FocusAction): FocusState {
  const { table, row, section } = action.focus;

  const matchingIndex = focusState.findIndex(
    element => element.table === table && element.row === row
  );

  const elementExists = matchingIndex !== -1;
  let updatedElements: FocusState = [];

  if (elementExists) {
    const element = focusState[matchingIndex];

    // Check if section is the same and interactors are active
    if (
      element.section !== null &&
      element.section.join("") === section.join("") &&
      element.interactors
    ) {
      // Close section
      updatedElements = [
        ...focusState.slice(0, matchingIndex),
        { ...element, section: null },
        ...focusState.slice(matchingIndex + 1),
      ];
    }
    // Remove element if same section and interactors off
    else if (
      element.section !== null &&
      element.section.join("") === section.join("") &&
      !element.interactors
    ) {
      updatedElements = [
        ...focusState.slice(0, matchingIndex),
        ...focusState.slice(matchingIndex + 1),
      ];
    }
    // Update section for same row
    else {
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
    const newElement = createFocusElement({
      row,
      table,
      section,
    });
    updatedElements = [...focusState, newElement];
  }

  // Process other elements in the same table
  return updatedElements.flatMap(element => {
    // Skip the element we just processed
    if (element.table === table && element.row === row) {
      return [element];
    }

    // Handle other elements in the same table
    if (element.table === table) {
      // Keep with reset states if it has interactors
      if (element.interactors) {
        return [
          {
            ...element,
            section: null,
            interactorsSection: null,
            interactorsRow: null,
          },
        ];
      }
      // Remove if in same table with interactors off
      return [];
    }

    // Keep elements from different tables unchanged
    return [];
  });
}

function handleSetInteractorsOn(focusState: FocusState, action: FocusAction): FocusState {
  const { table, row } = action.focus;

  // Check if element exists
  const elementExists = focusState.some(element => element.table === table && element.row === row);

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
  if (!elementExists) {
    const newElement = createFocusElement({
      row,
      table,
      interactors: true,
    });
    return [...updatedElements, newElement];
  }

  return updatedElements;
}

function handleSetInteractorsSection(focusState: FocusState, action: FocusAction): FocusState {
  const { table, row, interactorsRow, section } = action.focus;

  return focusState.flatMap(element => {
    // Active row
    if (element.table === table && element.row === row) {
      // Toggle off if section already active
      if (
        element.interactorsRow === interactorsRow &&
        element.interactorsSection?.join("-") === section?.join("-")
      ) {
        return [
          {
            ...element,
            interactorsRow: null,
            interactorsSection: null,
          },
        ];
      }
      // Set section on element
      return [
        {
          ...element,
          interactorsRow,
          interactorsSection: section,
          section: null,
        },
      ];
    }

    // Reset other elements in same table with interactors
    if (element.table === table && element.interactors) {
      return [
        {
          ...element,
          interactorsRow: null,
          interactorsSection: null,
        },
      ];
    }

    // Keep other elements from different tables
    return [element];
  });
}

export function AssociationsFocusProvider({ children }: { children: ReactElement }): ReactElement {
  const [focusState, dispatch] = useReducer(focusReducer, []);
  const { id } = useAotfContext();

  useEffect(() => {
    dispatch({ type: FocusActionType.RESET });
  }, [id]);

  return (
    <AssociationsFocusContext.Provider value={focusState}>
      <AssociationsFocusDispatchContext.Provider value={dispatch}>
        {children}
      </AssociationsFocusDispatchContext.Provider>
    </AssociationsFocusContext.Provider>
  );
}

export function useAssociationsFocus(): FocusState {
  return useContext(AssociationsFocusContext);
}

export function useAssociationsFocusDispatch(): Dispatch<FocusAction> {
  return useContext(AssociationsFocusDispatchContext);
}
