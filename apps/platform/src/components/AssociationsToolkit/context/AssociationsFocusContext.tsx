import { createContext, useContext, useReducer, Dispatch, ReactElement, useEffect } from "react";
import useAotfContext from "../hooks/useAotfContext";
import { INTERACTORS_SOURCES, TABLE_PREFIX } from "../utils";

export type FocusElementTable = "core" | "pinned" | "upload";
export type InteractorsSource = "intac" | "signor" | "reactome" | "string";

export type FocusElement = {
  table: FocusElementTable;
  row: string;
  interactorsRow: string | null;
  interactorsSource: InteractorsSource | null;
  interactors: boolean;
  section: null | [string, string];
  interactorsSection: null | [string, string];
};

export type FocusState = FocusElement[];

export enum FocusActionType {
  RESET = "RESET",
  SET_INTERACTORS_ON = "SET_INTERACTORS_ON",
  SET_INTERACTORS_OFF = "SET_INTERACTORS_OFF",
  SET_INTERACTORS_SECTION = "SET_INTERACTORS_SECTION",
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
    };

const defaultFocusElement: FocusElement = {
  table: TABLE_PREFIX.CORE,
  row: "",
  interactors: false,
  interactorsRow: null,
  interactorsSource: INTERACTORS_SOURCES.REACTOME,
  section: null,
  interactorsSection: null,
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
      let elementExists = false;

      const updatedElements = focusState.reduce<FocusState>((acc, element) => {
        if (element.table === action.focus.table) {
          if (element.row === action.focus.row) {
            elementExists = true;
            // same active section with interactors active -> close section
            if (
              element.section !== null &&
              element.section.join("") === action.focus.section.join("") &&
              element.interactors
            ) {
              acc.push({
                ...element,
                section: null,
              });
              return acc;
            }
            // same active section with interactors off  -> remove focusElement
            if (
              element.section !== null &&
              element.section.join("") === action.focus.section.join("") &&
              !element.interactors
            ) {
              return acc;
            } else {
              // same row active  -> update active section
              acc.push({
                ...element,
                section: action.focus.section,
              });
              return acc;
            }
          }
          // focusElements in other row with interactors -> keep element -> reset section states
          if (element.interactors) {
            acc.push({
              ...element,
              section: null,
            });
            return acc;
          }
          // focusElements in same table with interactors off -> remove focusElement
          return acc;
        } else {
          // return the element unchanged if it's from a different table
          acc.push(element);
        }
        return acc;
      }, []);

      if (!elementExists) {
        const newElement = createFocusElement({
          row: action.focus.row,
          table: action.focus.table,
          section: action.focus.section,
        });

        updatedElements.push(newElement);
      }

      return updatedElements;
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
        (focusElement: FocusElement) =>
          focusElement.row !== action.focus.row || focusElement.table !== action.focus.table
      );
    }

    case FocusActionType.SET_INTERACTORS_ON: {
      let elementExists = false;

      const updatedElements = focusState.reduce<FocusState>((acc, element) => {
        if (element.table === action.focus.table && element.row === action.focus.row) {
          elementExists = true;
          acc.push({
            ...element,
            interactors: true,
          });
          return acc;
        }
        if (element.table === action.focus.table) {
          if (element.section) {
            acc.push({
              ...element,
              interactors: false,
            });
          }
          return acc;
        } else {
          acc.push(element);
          return acc;
        }
      }, []);
      if (!elementExists) {
        const newElement = createFocusElement({
          row: action.focus.row,
          table: action.focus.table,
          interactors: true,
        });
        updatedElements.push(newElement);
      }

      return updatedElements;
    }

    case FocusActionType.SET_INTERACTORS_OFF: {
      return focusState.reduce<FocusState>((acc, element) => {
        if (element.table === action.focus.table && element.row === action.focus.row) {
          if (element.section !== null) {
            acc.push({
              ...element,
              interactors: false,
              interactorsSection: null,
            });
          }
          return acc;
        } else {
          acc.push(element);
        }
        return acc;
      }, []);
    }

    case FocusActionType.SET_INTERACTORS_SECTION: {
      return focusState.reduce<FocusState>((acc, element) => {
        // Active row
        if (element.table === action.focus.table && element.row === action.focus.row) {
          // Section already active
          if (
            element.interactorsRow === action.focus.interactorsRow &&
            element.interactorsSection?.join("-") === action.focus.section?.join("-")
          ) {
            acc.push({
              ...element,
              interactorsRow: null,
              interactorsSection: null,
            });
            return acc;
          }
          // Set section on element
          else {
            acc.push({
              ...element,
              interactorsRow: action.focus.interactorsRow,
              interactorsSection: action.focus.section,
            });
            return acc;
          }
        }
        // Rest of elements in same table
        if (element.table === action.focus.table) {
          if (element.interactors) {
            acc.push({
              ...element,
              interactorsRow: null,
              interactorsSection: null,
            });
          } else {
            acc.push({ ...element });
          }
          return acc;
        } else {
          acc.push(element);
        }
        return acc;
      }, []);
    }

    case FocusActionType.SET_INTERACTORS_SOURCE: {
      return focusState.reduce<FocusState>((acc, element) => {
        if (element.table === action.focus.table && element.row === action.focus.row) {
          acc.push({
            ...element,
            interactorsSource: action.focus.source,
          });
          return acc;
        }
        acc.push(element);
        return acc;
      }, []);
    }

    case FocusActionType.RESET: {
      return [];
    }

    default: {
      throw Error("Unknown action: " + action);
    }
  }
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
