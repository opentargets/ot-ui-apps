import isEmpty from "lodash/isEmpty";
import { atom, selectorFamily, selector } from "recoil";
import { getPage } from "ui";
import client from "../../client";
import { europePmcBiblioSearchPOSTQuery } from "../../utils/urls";

// ------------------------------------------
// Helpers
// ------------------------------------------
export const parsePublications = (publications) =>
  publications.map((pub) => {
    const row = {};
    row.source = pub.source;
    row.patentDetails = pub.patentDetails;
    row.europePmcId = pub.id;
    row.fullTextOpen = !!(pub.inEPMC === "Y" || pub.inPMC === "Y");
    row.title = pub.title;
    row.year = pub.pubYear;
    row.abstract = pub.abstractText;
    row.openAccess = pub.isOpenAccess !== "N";
    row.authors = pub.authorList?.author || [];
    row.journal = {
      ...pub.journalInfo,
      page: pub.pageInfo,
    };
    return row;
  });

// ------------------------------------------
// ATOMS
// ------------------------------------------
export const literatureState = atom({
  key: "literatureState",
  default: {
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
    earliestPubYear: 2000,
    litsIds: [],
    page: 0,
    pageSize: 5,
    litsCount: 0,
    loadingEntities: false,
  },
});

// ------------------------------------------
// SELECTORS
// ------------------------------------------
export const loadingEntitiesState = selector({
  key: "loadingEntitiesState",
  get: ({ get }) => {
    const { loadingEntities } = get(literatureState);
    return loadingEntities;
  },
  set: ({ set, get }, newStatus) => {
    const currentState = get(literatureState);
    return set(literatureState, {
      ...currentState,
      loadingEntities: newStatus,
    });
  },
});

export const selectedCategoriesState = selector({
  key: "selectedCategoriesState",
  get: ({ get }) => {
    const { category } = get(literatureState);
    const sortedCategories = [...category].sort();
    return sortedCategories;
  },
});

export const litsCursorState = selector({
  key: "litsCursorState",
  get: ({ get }) => {
    const { cursor } = get(literatureState);
    return cursor;
  },
});

export const tablePageState = selector({
  key: "tablePageState",
  get: ({ get }) => {
    const { page } = get(literatureState);
    return page;
  },
});

export const tablePageSizeState = selector({
  key: "tablePageSizeState",
  get: ({ get }) => {
    const { pageSize } = get(literatureState);
    return pageSize;
  },
  set: ({ set, get }, newPageSize) => {
    const currentState = get(literatureState);
    return set(literatureState, {
      ...currentState,
      pageSize: newPageSize,
    });
  },
});

export const litsCountState = selector({
  key: "litsCountState",
  get: ({ get }) => {
    const { litsCount } = get(literatureState);
    return litsCount;
  },
});

export const litsIdsState = selector({
  key: "litsIdsState",
  get: ({ get }) => {
    const { litsIds } = get(literatureState);
    return litsIds;
  },
  set: ({ set, get }, newValue) => {
    const currentState = get(literatureState);
    return set(literatureState, {
      ...currentState,
      litsIds: newValue,
    });
  },
});

export const displayedPublications = selector({
  key: "displayedPublications",
  get: ({ get }) => {
    const page = get(tablePageState);
    const pageSize = get(tablePageSizeState);
    const publications = get(litsIdsState);
    if (isEmpty(publications)) return [];
    const rows = getPage(publications, page, pageSize);
    return rows;
  },
});

export const entitiesState = selector({
  key: "entitiesState",
  get: ({ get }) => {
    const { entities } = get(literatureState);
    return entities;
  },
});

export const selectedEntitiesState = selector({
  key: "selectedEntitiesState",
  get: ({ get }) => {
    const { selectedEntities } = get(literatureState);
    return selectedEntities;
  },
  set: ({ set, get }, selectedEntities) => {
    const currentState = get(literatureState);
    return set(literatureState, { ...currentState, selectedEntities });
  },
});

export const updateLiteratureState = selector({
  key: "updateLiteratureState",
  set: ({ set, get }, stateUpdate) => {
    const currentState = get(literatureState);
    return set(literatureState, { ...currentState, ...stateUpdate });
  },
});

// ------------------------------------------
// Requests
// ------------------------------------------

const fetchLiteraturesFromPMC = async ({ baseUrl, requestOptions }) =>
  fetch(baseUrl, requestOptions).then((response) => response.json());

export const literaturesEuropePMCQuery = selectorFamily({
  key: "literaturesEuropePMCQuery",
  get:
    ({ literaturesIds }) =>
    async () => {
      if (literaturesIds.length === 0) return [];
      const { baseUrl, requestOptions } =
        europePmcBiblioSearchPOSTQuery(literaturesIds);
      const response = await fetchLiteraturesFromPMC({
        baseUrl,
        requestOptions,
      });
      if (response.error) {
        throw response.error;
      }
      return response.resultList?.result;
    },
});

export const fetchSimilarEntities = ({
  id = "",
  threshold = 0.5,
  size = 15,
  query,
  cursor = null,
  category = [],
  entities = [],
  startYear = null,
  startMonth = null,
  endYear = null,
  endMonth = null,
}) => {
  const entityNames = category.length === 0 ? null : category;
  const ids = entities.map((c) => c.object.id);
  return client.query({
    query,
    variables: {
      cursor,
      id,
      ids,
      startYear,
      startMonth,
      endYear,
      endMonth,
      threshold,
      size,
      entityNames,
    },
  });
};
