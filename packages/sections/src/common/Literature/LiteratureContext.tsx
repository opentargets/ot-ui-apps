import isEmpty from "lodash/isEmpty";
import { createContext, useContext, useReducer } from 'react';
import type { LiteratureStateType, DetailsStateType } from './types';
import { getPage } from "ui";

export const defaultLiteratureState: LiteratureStateType = {
  id: "",
  cursor: "",
  category: ["disease", "drug", "target"],
  query: null,
  globalEntity: null,
  entities: [],
  selectedEntities: [],
  startYear: null,
  startMonth: null,
  endYear: null,
  endMonth: null,
  earliestPubYear: 0,
  litsIds: [],
  page: 0,
  pageSize: 5,
  litsCount: 0,
  loadingEntities: false,
};

const LiteratureContext = createContext(null as any);
const LiteratureDispatchContext = createContext(null as any);

const DetailsContext = createContext(null as any);
const DetailsDispatchContext = createContext(null as any);

function literatureReducer(literatureState: LiteratureStateType, action: any) {
  console.log(`LITERATURE REDUCER: ${action.type}`);
  switch (action.type) {
    case 'loadingEntities':
      return {
        ...literatureState,
        loadingEntities: action.value,
      };
    case 'tablePageSize':
      return {
        ...literatureState,
        pageSize: action.value,
      };
    case 'selectedEntities':
      return {
        ...literatureState,
        selectedEntities: action.value,
      };
    case 'stateUpdate':
      return {
        ...literatureState,
        ...action.value,
      };
    default:
      throw Error('invalid action type');
  }
}

function detailsReducer(detailsState: DetailsStateType, action: any) {
  console.log(`DETAILS REDUCER: ${action.type}`);
  let newObj;
  switch (action.type) {
    case 'addDetails':
      return { ...detailsState, ...action.value };
    case 'setToLoading':
      newObj = { ...detailsState };
      for (const id of action.value) {
        newObj[id] = 'loading';
      }
      return newObj;
  }
}

export function LiteratureProvider({ children }) {
  
  const [literature, literatureDispatch] =
    useReducer(literatureReducer, defaultLiteratureState);
  
  const [details, detailsDispatch] = useReducer(detailsReducer, {});

  return (
    <LiteratureContext.Provider value={literature}>
      <LiteratureDispatchContext.Provider value={literatureDispatch}>
        <DetailsContext.Provider value={details}>
          <DetailsDispatchContext.Provider value={detailsDispatch}>
            {children}
          </DetailsDispatchContext.Provider>
        </DetailsContext.Provider>
      </LiteratureDispatchContext.Provider>
    </LiteratureContext.Provider>
  );

}

export function useLiterature() {
  return useContext(LiteratureContext);
}

export function useLiteratureDispatch() {
  return useContext(LiteratureDispatchContext);
}

export function useSelectedCategories() {
  const { category } = useLiterature();
  return [...category].sort();
}

export function useDisplayedPublications() {
  const { page, pageSize, litsIds } = useLiterature();
  return isEmpty(litsIds) ? [] : getPage(litsIds, page, pageSize);
}

export function useDetails() {
  return useContext(DetailsContext);
}

export function useDetailsDispatch() {
  return useContext(DetailsDispatchContext);
}