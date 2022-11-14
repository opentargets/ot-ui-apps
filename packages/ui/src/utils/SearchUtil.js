export const formatSearchData = (unformattedData) => {
  const allTypes = [];

  for (const key in unformattedData) {
    if (Object.hasOwnProperty.call(unformattedData, key)) {
      let element = unformattedData[key];
      if (isArray(element)) {
        element.map((i) =>
          allTypes.push({
            type: key === "topHit" ? "topHit" : "normal",
            entity: i.__typename,
            ...flattenObj(i),
          })
        );
      } else if (isArray(element["hits"])) {
        element["hits"].map((i) =>
          allTypes.push({
            type: key === "topHit" ? "topHit" : "normal",
            entity: i.entity,
            ...flattenObj(i.object),
          })
        );
      }
    }
  }

  return allTypes;
};

const mapStandardKeys = (origionalKey) => {
  switch (origionalKey) {
    // TODO: check for PMID
    case "studyId":
      return "id";
    case "traitReported":
      return "name";
    case "approvedName":
      return "name";
    case "approvedSymbol":
      return "symbol";
    default:
      return origionalKey;
  }
};

const flattenObj = (ob) => {
  let result = {};

  for (const i in ob) {
    if (typeof ob[i] === "object" && !Array.isArray(ob[i])) {
      const temp = flattenObj(ob[i]);
      for (const j in temp) {
        result[j] = temp[j];
      }
    } else {
      result[mapStandardKeys(i)] = ob[i];
    }
  }
  return result;
};

const isArray = (value) => {
  return Array.isArray(value) && value.length > 0;
};
