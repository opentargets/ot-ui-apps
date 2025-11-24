import { max } from "d3";

export function processData(
  data: BaselineExpressionRow[],
  datatypes: string[],
  groupByTissue: boolean
) {
  const [topLevelName, otherName] = groupByTissue ? ["tissue", "celltype"] : ["celltype", "tissue"];

  // !! REMOVE !!
  window.data = data;

  data = structuredClone(data);

  const firstLevel = []; // array of data rows - unique parent biosample ids
  const secondLevel = {}; // object of array of objects, top-level keys: biosampleIds, bottom-level keys: datatypeIds
  const thirdLevel = {}; // each entry is an array of data rows where datatypeId is always datatypes[0]

  // 2nd and 3rd levels
  for (const row of data) {
    const topLevelBiosampleId = row[`${topLevelName}Biosample`]?.biosampleId; // the 2nd level id!
    const otherBiosampleId = row[`${otherName}Biosample`]?.biosampleId;
    if (!topLevelBiosampleId) continue;
    if (!otherBiosampleId) {
      // 2nd level
      const topLevelBiosampleParentId = row[`${topLevelName}BiosampleParent`].biosampleId;
      secondLevel[topLevelBiosampleParentId] ??= {};
      const _secondLevelName = // will add to the original data row and the table row
        row[`${groupByTissue ? "tissue" : "celltype"}Biosample`].biosampleName;
      const _secondLevelId = row[`${groupByTissue ? "tissue" : "celltype"}Biosample`].biosampleId;
      row._secondLevelName = _secondLevelName;
      row._secondLevelId = _secondLevelId;
      if (!secondLevel[topLevelBiosampleParentId][topLevelBiosampleId]) {
        secondLevel[topLevelBiosampleParentId][topLevelBiosampleId] = {};
        Object.defineProperty(
          // so not enumerable
          secondLevel[topLevelBiosampleParentId][topLevelBiosampleId],
          "_secondLevelName",
          { value: _secondLevelName, writable: true }
        );
        Object.defineProperty(
          // so not enumerable
          secondLevel[topLevelBiosampleParentId][topLevelBiosampleId],
          "_secondLevelId",
          { value: _secondLevelId, writable: true }
        );
      }
      secondLevel[topLevelBiosampleParentId][topLevelBiosampleId][row.datatypeId] = row;
    } else {
      // 3rd level
      if (row.datatypeId !== datatypes[0]) {
        throw Error(`Expected all third level rows to have datatypeid '${datatypes[0]}'`);
      }
      thirdLevel[topLevelBiosampleId] ??= [];
      thirdLevel[topLevelBiosampleId].push(row);
    }
  }

  // convert 2nd level objects to arrays
  for (const [bioSampleId, obj] of Object.entries(secondLevel)) {
    secondLevel[bioSampleId] = Object.values(obj);
  }

  // add _normalisedMedian to each 2nd level object - normalised by max median per datatypeid
  {
    const maxMedians = {};
    for (const datatype of datatypes) maxMedians[datatype] = 0;
    for (const arr of Object.values(secondLevel)) {
      for (const obj of arr) {
        for (const [datatypeId, row] of Object.entries(obj)) {
          if (maxMedians[datatypeId] < row.median) {
            maxMedians[datatypeId] = row.median;
          }
        }
      }
    }
    for (const arr of Object.values(secondLevel)) {
      for (const obj of arr) {
        for (const [datatypeId, row] of Object.entries(obj)) {
          row._normalisedMedian = row.median === null ? null : row.median / maxMedians[datatypeId];
        }
      }
    }
  }

  // add _normalisedMedian to each 3rd level object - all 3rd level objects have datatypeId === datatypes[0]
  {
    let maxMedian = 0;
    for (const arr of Object.values(thirdLevel)) {
      for (const row of arr) {
        if (maxMedian < row.median) {
          maxMedian = row.median;
        }
      }
    }
    for (const arr of Object.values(thirdLevel)) {
      for (const row of arr) {
        row._normalisedMedian = row.median === null ? null : row.median / maxMedian;
      }
    }
  }

  // 1st level
  for (const objects of Object.values(secondLevel)) {
    const firstLevelRow = {};
    for (const obj of objects) {
      for (const [datatypeId, row] of Object.entries(obj)) {
        const biosampleParent = row[`${groupByTissue ? "tissue" : "celltype"}BiosampleParent`];
        if (!firstLevelRow._firstLevelName) {
          Object.defineProperty(firstLevelRow, "_firstLevelName", {
            value: biosampleParent.biosampleName,
          });
          Object.defineProperty(firstLevelRow, "_firstLevelId", {
            value: biosampleParent.biosampleId,
          });
        }
        if (!(firstLevelRow[datatypeId]?.median >= row.median)) {
          const copiedRow = { ...row };
          copiedRow._firstLevelName = biosampleParent.biosampleName;
          copiedRow._firstLevelId = biosampleParent.biosampleId;
          copiedRow._firstLevelSpecificityScore =
            firstLevelRow[datatypeId]?._firstLevelSpecificityScore;
          delete copiedRow._secondLevelName;
          delete copiedRow._secondLevelId;
          firstLevelRow[datatypeId] = copiedRow;
        }
        // top-level specificity score may come from different object to that with the highest median
        if (!(firstLevelRow[datatypeId]._firstLevelSpecificityScore >= row.specificity_score)) {
          firstLevelRow[datatypeId]._firstLevelSpecificityScore = row.specificity_score;
        }
      }
    }
    firstLevel.push(firstLevelRow);
  }

  // get datatype (i.e. column) to sort on
  {
    let maxSpecificity = { datatype: datatypes[0], score: -Infinity };
    for (const datatype of datatypes) {
      const score = max(firstLevel.map((obj) => obj[datatype]?._firstLevelSpecificityScore));
      if (score > maxSpecificity.score) {
        maxSpecificity = { datatype, score };
      }
    }
    Object.defineProperty(firstLevel, "_maxSpecificity", {
      value: maxSpecificity,
    });
  }

  console.log({ firstLevel, secondLevel, thirdLevel });
  return { firstLevel, secondLevel, thirdLevel };
}
