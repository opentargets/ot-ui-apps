import { format } from "d3-format";

const SEARCH_HISTORY_LS_KEY = "search-history";

const mapStandardKeys = (originalKey: string) => {
  switch (originalKey) {
    case "studyId":
      return "id";
    case "traitReported":
      return "name";
    case "approvedName":
      return "name";
    case "approvedSymbol":
      return "symbol";
    case "functionDescriptions":
      return "description";
    default:
      return originalKey;
  }
};

const flattenObj = (obj: Object) => {
  const result: { [key: string]: any } = {};
  Object.entries(obj).forEach(([key, value]) => {
    if (isObject(value)) {
      Object.entries(flattenObj(value)).forEach(([nestedKey, nestedValue]) => {
        result[nestedKey] = nestedValue;
      });
    } else if (key === "functionDescriptions") {
      result[mapStandardKeys(key)] = value[0];
    } else {
      result[mapStandardKeys(key)] = value;
    }
  });
  return result;
};

const isArray = (value: any): value is any[] => Array.isArray(value) && value.length > 0;

const isObject = (value: any): value is Object =>
  value && typeof value === "object" && !Array.isArray(value);

type SearchDataValue = Object[] | SearchDataValueHitsObj;
type SearchDataValueHitsObj = { hits: { entity: string; object: Object }[] };
type FormattedSearchResult = {
  type: string;
  entity: string;
  [key: string]: any;
};
export const formatSearchData = (unformattedData: { [key: string]: SearchDataValue }) => {
  const formattedData: { [key: string]: FormattedSearchResult[] } = {};

  Object.entries(unformattedData).forEach(([key, value]) => {
    const typesArray: FormattedSearchResult[] = [];
    if (isArray(value)) {
      value.map(i =>
        typesArray.push({
          type: key === "topHit" ? "topHit" : key,
          entity: key,
          ...flattenObj(i),
        })
      );
    } else if (isArray(value.hits)) {
      value.hits.map(i =>
        typesArray.push({
          type: key === "topHit" ? "topHit" : i.entity,
          entity: i.entity,
          ...flattenObj(i.object),
        })
      );
    }
    if (typesArray.length > 0) formattedData[key] = typesArray;
  });

  return formattedData;
};

export const containsObject = (obj: Object, list: Object[]) =>
  list.findIndex(item => JSON.stringify(item) === JSON.stringify(obj));

export const getSearchHistory = (): Object[] => {
  const searchHistoryItem = localStorage.getItem(SEARCH_HISTORY_LS_KEY);
  return searchHistoryItem ? JSON.parse(searchHistoryItem) : [];
};

export const addSearchToLocalStorage = (item: { description?: string } & Object) => {
  const recentItemsMaxLength = 4;
  const recentItems = getSearchHistory();
  const newItem = { ...item };
  delete newItem.description;
  const existingIndex = containsObject(newItem, recentItems);

  if (existingIndex >= 0) {
    recentItems.splice(existingIndex, 1);
  }
  const recentItemsDeepCopy = [...recentItems];
  if (recentItemsDeepCopy.length > recentItemsMaxLength) recentItemsDeepCopy.pop();
  if (newItem) {
    recentItemsDeepCopy.unshift(newItem);
    localStorage.setItem(SEARCH_HISTORY_LS_KEY, JSON.stringify(recentItemsDeepCopy));
  }
};

export const clearAllRecent = () => {
  localStorage.removeItem(SEARCH_HISTORY_LS_KEY);
  window.dispatchEvent(new Event("storage"));
};

export const clearRecentItem = (item: Object) => {
  const recentItems = [...getSearchHistory()];
  const existingIndex = containsObject(item, recentItems);
  recentItems.splice(existingIndex, 1);
  localStorage.setItem(SEARCH_HISTORY_LS_KEY, JSON.stringify(recentItems));
  window.dispatchEvent(new Event("storage"));
  return recentItems;
};

export const commaSeparate = format(",");
