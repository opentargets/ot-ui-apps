import { createContext, useContext, useReducer, useEffect, useRef, useCallback, useMemo } from "react";
import type { Dispatch, ReactNode } from "react";
import type { DocumentNode } from "graphql";
import type { Facet } from "../../Facets/facetsTypes";
import { DEFAULT_TABLE_SORTING_STATE } from "../associationsUtils";
import { aotfReducer, createInitialState } from "./aotfReducer";
import {
  aggregationClick,
  facetFilterSelectAction,
  onPaginationChange,
  resetDataSourceControl,
  resetPagination,
  resetToInitialState,
  setDataSourceControl,
  setEnableIndirect,
} from "./aotfActions";
import type { Action, QueryState, Pagination, Sorting } from "../types";
import { ActionType, ENTITY } from "../types";

const rowEntityMap: Partial<Record<ENTITY, ENTITY>> = {
  [ENTITY.TARGET]: ENTITY.DISEASE,
  [ENTITY.DISEASE]: ENTITY.TARGET,
};

export interface QueryContextState extends QueryState {
  id: string;
  entity: ENTITY;
  entityToGet: ENTITY;
  query: DocumentNode;
}

export interface QueryContextDispatch {
  dispatch: Dispatch<Action>;
  handlePaginationChange: (updater: (prev: Pagination) => Pagination) => void;
  handleSortingChange: (fn: () => Sorting) => void;
  resetSorting: () => void;
  handleAggregationClick: (aggregation: string) => void;
  resetDatasourceControls: () => void;
  resetToInitialPagination: () => void;
  updateDataSourceControls: (
    id: string,
    weight: number,
    required: boolean,
    aggregation: string
  ) => void;
  facetFilterSelect: (facets: Facet[]) => void;
  setEnableIndirect: (value: boolean) => void;
}

const AssociationsQueryStateContext = createContext<QueryContextState | null>(null);
const AssociationsQueryDispatchContext = createContext<QueryContextDispatch | null>(null);

interface AssociationsQueryProviderProps {
  children: ReactNode;
  id: string;
  entity: ENTITY;
  query: DocumentNode;
}

export function AssociationsQueryProvider({
  children,
  id,
  entity,
  query,
}: AssociationsQueryProviderProps) {
  const [state, dispatch] = useReducer(aotfReducer, { entity }, createInitialState);
  const hasRendered = useRef(false);

  useEffect(() => {
    if (hasRendered.current) dispatch(resetToInitialState());
    hasRendered.current = true;
  }, [id]);

  const handlePaginationChange = useCallback(
    (updater: (prev: Pagination) => Pagination) => {
      dispatch(onPaginationChange(updater(state.pagination)));
    },
    [state.pagination]
  );

  const handleSortingChange = useCallback(
    (fn: () => Sorting) => {
      const newSorting = fn();
      dispatch({
        type: ActionType.SORTING,
        sorting:
          newSorting[0].id === state.sorting[0].id ? DEFAULT_TABLE_SORTING_STATE : newSorting,
      });
    },
    [state.sorting]
  );

  const resetSorting = useCallback(() => {
    dispatch({ type: ActionType.SORTING, sorting: DEFAULT_TABLE_SORTING_STATE });
  }, []);

  const handleAggregationClick = useCallback((aggregation: string) => {
    dispatch(aggregationClick(aggregation));
  }, []);

  const resetDatasourceControls = useCallback(() => {
    dispatch(resetDataSourceControl());
  }, []);

  const resetToInitialPagination = useCallback(() => {
    dispatch(resetPagination());
  }, []);

  const updateDataSourceControls = useCallback(
    (colId: string, weight: number, required: boolean, aggregation: string) => {
      dispatch(setDataSourceControl(colId, weight, required, aggregation));
    },
    []
  );

  const facetFilterSelect = useCallback((facets: Facet[]) => {
    dispatch(facetFilterSelectAction(facets));
  }, []);

  const handleSetEnableIndirect = useCallback((value: boolean) => {
    dispatch(setEnableIndirect(value));
  }, []);

  const queryState = useMemo<QueryContextState>(
    () => ({
      ...state,
      id,
      entity,
      entityToGet: rowEntityMap[entity] ?? ENTITY.TARGET,
      query,
    }),
    [state, id, entity, query]
  );

  const queryDispatch = useMemo<QueryContextDispatch>(
    () => ({
      dispatch,
      handlePaginationChange,
      handleSortingChange,
      resetSorting,
      handleAggregationClick,
      resetDatasourceControls,
      resetToInitialPagination,
      updateDataSourceControls,
      facetFilterSelect,
      setEnableIndirect: handleSetEnableIndirect,
    }),
    [
      handlePaginationChange,
      handleSortingChange,
      resetSorting,
      handleAggregationClick,
      resetDatasourceControls,
      resetToInitialPagination,
      updateDataSourceControls,
      facetFilterSelect,
      handleSetEnableIndirect,
    ]
  );

  return (
    <AssociationsQueryStateContext.Provider value={queryState}>
      <AssociationsQueryDispatchContext.Provider value={queryDispatch}>
        {children}
      </AssociationsQueryDispatchContext.Provider>
    </AssociationsQueryStateContext.Provider>
  );
}

export function useAotfQueryState(): QueryContextState {
  const ctx = useContext(AssociationsQueryStateContext);
  if (!ctx) throw new Error("useAotfQueryState must be used within AssociationsQueryProvider");
  return ctx;
}

export function useAotfQueryDispatch(): QueryContextDispatch {
  const ctx = useContext(AssociationsQueryDispatchContext);
  if (!ctx) throw new Error("useAotfQueryDispatch must be used within AssociationsQueryProvider");
  return ctx;
}
