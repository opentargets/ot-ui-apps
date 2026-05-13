import { createContext, useContext, useReducer, useEffect, useRef, useCallback, useMemo } from "react";
import type { Dispatch, ReactNode } from "react";
import type { DocumentNode } from "graphql";
import { useStateParams } from "ui";
import type { Facet } from "../../Facets/facetsTypes";
import {
  DEFAULT_TABLE_SORTING_STATE,
  DEFAULT_TABLE_PAGE_INDEX,
  DEFAULT_TABLE_PAGE_SIZE,
  serializeSorting,
  deserializeSorting,
} from "../associationsUtils";
import { aotfReducer, createInitialState } from "./aotfReducer";
import {
  aggregationClick,
  facetFilterSelectAction,
  resetDataSourceControl,
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

// Full shape exposed to consumers — reducer state + URL-backed fields
export interface QueryContextState extends QueryState {
  id: string;
  entity: ENTITY;
  entityToGet: ENTITY;
  query: DocumentNode;
  pagination: Pagination;
  sorting: Sorting;
  entitySearch: string;
  facetFiltersIds: string[];
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
  handleEntitySearch: (value: string) => void;
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

  // --- URL-backed state ---

  const [pageIndex, setPageIndex] = useStateParams(
    DEFAULT_TABLE_PAGE_INDEX,
    "page",
    (v: number) => String(v),
    (s: string) => {
      const n = parseInt(s, 10);
      return isNaN(n) || n < 0 ? DEFAULT_TABLE_PAGE_INDEX : n;
    }
  );

  const [pageSize, setPageSize] = useStateParams(
    DEFAULT_TABLE_PAGE_SIZE,
    "pageSize",
    (v: number) => String(v),
    (s: string) => {
      const n = parseInt(s, 10);
      return isNaN(n) || n <= 0 ? DEFAULT_TABLE_PAGE_SIZE : n;
    }
  );

  const [sortParam, setSortParam] = useStateParams(
    serializeSorting(DEFAULT_TABLE_SORTING_STATE),
    "sort",
    (v: string) => v,
    (v: string) => v
  );

  const [entitySearch, setEntitySearchParam] = useStateParams(
    "",
    "q",
    (v: string) => v,
    (v: string) => v
  );

  const [facetFiltersIds, setFacetFiltersIds] = useStateParams<string[]>(
    [],
    "facets",
    (arr: string[]) => arr.join(","),
    (s: string) => (s ? s.split(",").filter(Boolean) : [])
  );

  const pagination: Pagination = useMemo(
    () => ({ pageIndex, pageSize }),
    [pageIndex, pageSize]
  );
  const sorting: Sorting = useMemo(() => deserializeSorting(sortParam), [sortParam]);

  // Reset all URL-backed state + reducer when entity ID changes
  useEffect(() => {
    if (hasRendered.current) {
      dispatch(resetToInitialState());
      setPageIndex(DEFAULT_TABLE_PAGE_INDEX);
      setSortParam(serializeSorting(DEFAULT_TABLE_SORTING_STATE));
      setEntitySearchParam("");
      setFacetFiltersIds([]);
    }
    hasRendered.current = true;
  }, [id]);

  // --- Dispatch callbacks ---

  const handlePaginationChange = useCallback(
    (updater: (prev: Pagination) => Pagination) => {
      const newPag = updater(pagination);
      if (newPag.pageIndex !== pageIndex) setPageIndex(newPag.pageIndex);
      if (newPag.pageSize !== pageSize) setPageSize(newPag.pageSize);
    },
    [pageIndex, pageSize, pagination]
  );

  const handleSortingChange = useCallback(
    (fn: () => Sorting) => {
      const newSorting = fn();
      const resolved =
        newSorting[0].id === sorting[0].id ? DEFAULT_TABLE_SORTING_STATE : newSorting;
      setSortParam(serializeSorting(resolved));
      setPageIndex(DEFAULT_TABLE_PAGE_INDEX);
    },
    [sorting]
  );

  const resetSorting = useCallback(() => {
    setSortParam(serializeSorting(DEFAULT_TABLE_SORTING_STATE));
  }, []);

  const handleAggregationClick = useCallback((aggregation: string) => {
    dispatch(aggregationClick(aggregation));
    setPageIndex(DEFAULT_TABLE_PAGE_INDEX);
  }, []);

  const resetDatasourceControls = useCallback(() => {
    dispatch(resetDataSourceControl());
    setPageIndex(DEFAULT_TABLE_PAGE_INDEX);
  }, []);

  const resetToInitialPagination = useCallback(() => {
    setPageIndex(DEFAULT_TABLE_PAGE_INDEX);
  }, []);

  const updateDataSourceControls = useCallback(
    (colId: string, weight: number, required: boolean, aggregation: string) => {
      dispatch(setDataSourceControl(colId, weight, required, aggregation));
      setPageIndex(DEFAULT_TABLE_PAGE_INDEX);
    },
    []
  );

  const facetFilterSelect = useCallback((facets: Facet[]) => {
    dispatch(facetFilterSelectAction(facets));
    setFacetFiltersIds(facets.map(f => f.id));
    setPageIndex(DEFAULT_TABLE_PAGE_INDEX);
  }, []);

  const handleSetEnableIndirect = useCallback((value: boolean) => {
    dispatch(setEnableIndirect(value));
  }, []);

  const handleEntitySearch = useCallback((value: string) => {
    setEntitySearchParam(value);
    setPageIndex(DEFAULT_TABLE_PAGE_INDEX);
  }, []);

  // --- Context values ---

  const queryState = useMemo<QueryContextState>(
    () => ({
      ...state,
      id,
      entity,
      entityToGet: rowEntityMap[entity] ?? ENTITY.TARGET,
      query,
      pagination,
      sorting,
      entitySearch,
      facetFiltersIds,
    }),
    [state, id, entity, query, pagination, sorting, entitySearch, facetFiltersIds]
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
      handleEntitySearch,
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
      handleEntitySearch,
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
