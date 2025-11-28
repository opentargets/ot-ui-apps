const minDataPoints = 3; // only do regressions if at least this many

export function addScaledMedians(data, columnNames) {
  const scales = {};
  const warning = "";
  const description = [];
  if (columnNames.length !== 3) {
    // only consider 3 column case for now
    throw Error("Expected 3 column names");
  }
  const pairwiseData = getPairwiseData(data.firstLevel, columnNames);
  const regressionOrder = getRegressionOrder(pairwiseData, columnNames);
  // if (regressionOrder[0].length < minDataPoints) {
  //   warning = 'Insufficient paired points for any regression';
  //   columnNames.map(name => scales[name] = 1);
  // } else {
  //   const gradA =
  // }

  console.log({ pairwiseData, regressionOrder });
  // !! REMOVE !!
  window.pairwiseData = pairwiseData;
  window.regressionOrder = regressionOrder;
}

// !!! assumes single data array so will currently only work for first level data!!!!
function getPairwiseData(dataArray, columnNames) {
  const pairwiseData = {};
  for (let i = 0; i < columnNames.length; i++) {
    pairwiseData[columnNames[i]] = {};
    for (let j = i + 1; j < columnNames.length; j++) {
      pairwiseData[columnNames[i]][columnNames[j]] = [];
    }
  }
  for (const row of dataArray) {
    const nameObjectPairs = Object.entries(row);
    for (let i = 0; i < nameObjectPairs.length; i++) {
      const [iName, iObject] = nameObjectPairs[i];
      if (!(iObject.median != null)) continue;
      for (let j = i + 1; j < nameObjectPairs.length; j++) {
        const [jName, jObject] = nameObjectPairs[j];
        if (!(jObject.median != null)) continue;
        pairwiseData[iName][jName]
          ? pairwiseData[iName][jName].push(row)
          : pairwiseData[jName][iName].push(row);
      }
    }
  }
  return pairwiseData;
}

function getRegressionOrder(pairwiseData, columnNames) {
  const columnPairs = [];
  for (const [outerName, innerObject] of Object.entries(pairwiseData)) {
    for (const [innerName, dataArray] of Object.entries(innerObject)) {
      columnPairs.push([outerName, innerName, dataArray]);
    }
  }
  columnPairs.sort((a, b) => b[2].length - a[2].length);
  return columnPairs;
}

// assumes zero intercept
function regression(dataArray, columnName1, columnName2) {}

// !!!! NOW HAVE THE ORDER, DO THE FIRST REGRESSION NORMALLY,
// THEN FOR THE OTHER REGRESSION, REPLACE 3RD PLACED PAIR WITH MORE 2ND PLACE VALUES USING THE ORIGINAL REGRESSION

// total least squares fit
function tlsOriginFit(data) {
  const xx = d3.sum(data.map((row) => x(row) ** 2));
  const yy = d3.sum(data.map((row) => y(row) ** 2));
  const xy = d3.sum(data.map((row) => x(row) * y(row)));
  return (yy - xx + Math.sqrt((yy - xx) ** 2 + 4 * xy ** 2)) / (2 * xy);
}
