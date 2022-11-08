export const formatSearchData = (unformattedData = []) => {
  const allTypes = [];

  for (const key in unformattedData) {
    if (Object.hasOwnProperty.call(unformattedData, key)) {
      let element = unformattedData[key];
      if (isArray(element)) {
        const flatArray = [];
        for (let index = 0; index < element.length; index++) {
          flatArray.push(flattenObj(element[index]));
        }
        const data = {
          type: key,
          data: flatArray,
        };
        allTypes.push(data);
      } else if (isArray(element["hits"])) {
        const flatArray = [];
        for (let index = 0; index < element["hits"].length; index++) {
          flatArray.push(flattenObj(element["hits"][index]));
        }

        const data = {
          type: key,
          data: flatArray,
        };
        allTypes.push(data);
      }
    }
  }
  console.log(`👻 ~ file: SearchUtil.js ~ line 34 ~ formatSearchData ~ allTypes`, allTypes);

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
