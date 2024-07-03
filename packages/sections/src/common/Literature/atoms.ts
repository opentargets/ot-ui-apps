import isEmpty from "lodash/isEmpty";
import { atom, selectorFamily, selector, DefaultValue } from "recoil";
import { getPage } from "ui";
import client from "../../client";
import { europePmcBiblioSearchPOSTQuery } from "../../utils/urls";

// ------------------------------------------
// Helpers
// ------------------------------------------

type AuthorListType = {
  fullName: string;
  firstName: string;
  lastName: string;
  initials: string;
  authorId: {
    type: string;
    value: string;
  };
  authorAffiliationDetailsList: {
    authorAffiliation: {
      affiliation: string;
    }[];
  };
};

type JournalInfoType = {
  issue: string;
  volume: string;
  journalIssueId: number;
  dateOfPublication: string;
  monthOfPublication: number;
  yearOfPublication: number;
  printPublicationDate: string;
  journal: {
    title: string;
    medlineAbbreviation: string;
    isoabbreviation: string;
    nlmid: string;
    issn: string;
    essn: string;
  };
};

type PublicationType = {
  source: string;
  patentDetails: any;
  id: string;
  inEPMC: string;
  inPMC: string;
  title: string;
  pubYear: string;
  abstractText: string;
  isOpenAccess: string;
  authorList: {
    author: AuthorListType;
  };
  journalInfo: JournalInfoType;
  pageInfo: string;
};

type RowType = {
  source: string;
  patentDetails: any;
  europePmcId: string;
  fullTextOpen: boolean;
  title: string;
  year: string;
  abstract: string;
  openAccess: boolean;
  authors: AuthorListType;
  journal: JournalInfoType & { page: string };
};

export const parsePublications = (publications: PublicationType[]) =>
  publications.map(pub => {
    const row: RowType = {
      source: pub.source,
      patentDetails: pub.patentDetails,
      europePmcId: pub.id,
      fullTextOpen: !!(pub.inEPMC === "Y" || pub.inPMC === "Y"),
      title: pub.title,
      year: pub.pubYear,
      abstract: pub.abstractText,
      openAccess: pub.isOpenAccess !== "N",
      authors: pub.authorList?.author || [],
      journal: {
        ...pub.journalInfo,
        page: pub.pageInfo,
      },
    };
    return row;
  });

type LiteratureStateType = {
  id: string;
  cursor: string | null;
  threshold?: number;
  size?: number;
  category: string[];
  query: any | null;
  globalEntity: any | null;
  entities: any[];
  selectedEntities: any[] | DefaultValue;
  startYear: number | null;
  startMonth: number | null;
  endYear: number | null;
  endMonth: number | null;
  earliestPubYear: number;
  litsIds:
    | {
        id: string;
        status: string;
        publication: null;
      }[]
    | DefaultValue;
  page: number;
  pageSize: number | DefaultValue;
  litsCount: number;
  loadingEntities: boolean | DefaultValue;
};

// ------------------------------------------
// ATOMS
// ------------------------------------------

const defaultState: LiteratureStateType = {
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

export const literatureState = atom({
  key: "literatureState",
  default: defaultState,
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
    const newState: LiteratureStateType = {
      ...currentState,
      loadingEntities: newStatus,
    };
    return set(literatureState, newState);
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
    const newState: LiteratureStateType = {
      ...currentState,
      pageSize: newPageSize,
    };
    return set(literatureState, newState);
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
    const newState: LiteratureStateType = {
      ...currentState,
      litsIds: newValue,
    };
    return set(literatureState, newState);
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
    const newState: LiteratureStateType = { ...currentState, selectedEntities };
    return set(literatureState, newState);
  },
});

export const updateLiteratureState = selector({
  key: "updateLiteratureState",
  get: ({ get }) => get(literatureState),
  set: ({ set, get }, stateUpdate) => {
    const currentState = get(literatureState);
    return set(literatureState, { ...currentState, ...stateUpdate });
  },
});

// ------------------------------------------
// Requests
// ------------------------------------------

const fetchLiteraturesFromPMC = async ({
  baseUrl,
  requestOptions,
}: {
  baseUrl: string;
  requestOptions: any;
}) => fetch(baseUrl, requestOptions).then(response => response.json());

export const literaturesEuropePMCQuery = selectorFamily({
  key: "literaturesEuropePMCQuery",
  get:
    ({ literaturesIds }: { literaturesIds: string[] }) =>
    async () => {
      if (literaturesIds.length === 0) return [];
      const { baseUrl, requestOptions } = europePmcBiblioSearchPOSTQuery(literaturesIds);
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
}: LiteratureStateType) => {
  const entityNames = category.length === 0 ? null : category;
  const ids = entities.map(c => c.object.id);
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
