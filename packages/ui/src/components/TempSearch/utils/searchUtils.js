import { format } from "d3-format";

const mapStandardKeys = (origionalKey) => {
  switch (origionalKey) {
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
      return origionalKey;
  }
};

const flattenObj = (ob) => {
  const result = {};

  Object.entries(ob).forEach(([key, value]) => {
    if (typeof value === "object" && !Array.isArray(value)) {
      const temp = flattenObj(value);
      Object.entries(temp).forEach(([nestedKey, nestedValue]) => {
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

const isArray = (value) => Array.isArray(value) && value.length > 0;

const exceedsArrayLengthLimit = (array) => {
  const limitLength = 10;
  let exceedsLimit = false;

  if (array.length > limitLength) {
    exceedsLimit = true;
  }
  return exceedsLimit;
};

export const formatSearchData = (unformattedData) => {
  const allTypes = [];

  Object.entries(unformattedData).forEach(([key, value]) => {
    if (isArray(value)) {
      value.map((i) =>
        allTypes.push({
          type: key === "topHit" ? "topHit" : key,
          entity: key,
          ...flattenObj(i),
        })
      );
    } else if (isArray(value.hits)) {
      value.hits.map((i) =>
        allTypes.push({
          type: key === "topHit" ? "topHit" : i.entity,
          entity: i.entity,
          ...flattenObj(i.object),
        })
      );
    }
  });

  return allTypes;
};

export const containsObject = (obj, list) => {
  for (let i = 0; i < list.length; i++) {
    if (JSON.stringify(list[i]) === JSON.stringify(obj)) {
      return i;
    }
  }

  return -1;
};

export const addSearchToLocalStorage = (item) => {
  const recentItems =
    JSON.parse(localStorage.getItem("search-history") || "[]") || [];
  const newItem = { ...item };
  delete newItem.description;
  const existingIndex = containsObject(newItem, recentItems);

  if (existingIndex >= 0) {
    recentItems.splice(existingIndex, 1);
  }
  const recentItemsDeepCopy = [...recentItems];
  if (newItem) {
    recentItemsDeepCopy.unshift(newItem);
    localStorage.setItem("search-history", JSON.stringify(recentItemsDeepCopy));
  }
  if (exceedsArrayLengthLimit(recentItemsDeepCopy)) recentItemsDeepCopy.pop();
};

export const clearAllRecent = () => {
  localStorage.removeItem("search-history");
};

export const commaSeparate = format(",");
