const TARGET_PRIORITISATION_FACTORS_PATH = `${import.meta.env.BASE_URL}assets/target-prioritisation-factors.tsv`;

const REQUIRED_HEADERS = {
  geneId: "GeneID",
  newTissueDistribution: "Tissue distribution score",
  newTissueSpecificity: "Tissue specificity score",
  newCellTypeDistribution: "Cell type distribution score",
  newCellTypeSpecificity: "Cell type specificity score",
};

const OPTIONAL_HEADERS = {
  newTissueSpecificityAnnotation: "Tissue specificity score annotation",
  newCellTypeSpecificityAnnotation: "Cell type specificity score annotation",
};

let externalPrioritisationLookupPromise;

const parseNumber = value => {
  if (value == null || value === "") return undefined;

  const parsedValue = Number(value);
  return Number.isFinite(parsedValue) ? parsedValue : undefined;
};

const parseText = value => {
  const trimmedValue = value?.trim();
  return trimmedValue ? trimmedValue : undefined;
};

const hasRequiredHeaders = headerIndex =>
  Object.values(REQUIRED_HEADERS).every(header => headerIndex[header] !== undefined);

const parseLookupTsv = tsvContent => {
  const trimmedContent = tsvContent.trim();
  if (!trimmedContent) return new Map();

  const [headerLine, ...rows] = trimmedContent.split(/\r?\n/);
  const headers = headerLine.split("\t");
  const headerIndex = headers.reduce((acc, header, index) => {
    acc[header] = index;
    return acc;
  }, {});

  if (!hasRequiredHeaders(headerIndex)) {
    console.warn(
      "Custom prioritisation lookup is missing required headers and will be ignored.",
      REQUIRED_HEADERS
    );
    return new Map();
  }

  return rows.reduce((lookup, row) => {
    if (!row) return lookup;

    const values = row.split("\t");
    const geneId = values[headerIndex[REQUIRED_HEADERS.geneId]]?.trim();

    if (!geneId) return lookup;

    lookup.set(geneId, {
      newTissueSpecificity: parseNumber(
        values[headerIndex[REQUIRED_HEADERS.newTissueSpecificity]]
      ),
      newTissueDistribution: parseNumber(
        values[headerIndex[REQUIRED_HEADERS.newTissueDistribution]]
      ),
      newCellTypeSpecificity: parseNumber(
        values[headerIndex[REQUIRED_HEADERS.newCellTypeSpecificity]]
      ),
      newCellTypeDistribution: parseNumber(
        values[headerIndex[REQUIRED_HEADERS.newCellTypeDistribution]]
      ),
      newTissueSpecificityAnnotation: parseText(
        headerIndex[OPTIONAL_HEADERS.newTissueSpecificityAnnotation] !== undefined
          ? values[headerIndex[OPTIONAL_HEADERS.newTissueSpecificityAnnotation]]
          : undefined
      ),
      newCellTypeSpecificityAnnotation: parseText(
        headerIndex[OPTIONAL_HEADERS.newCellTypeSpecificityAnnotation] !== undefined
          ? values[headerIndex[OPTIONAL_HEADERS.newCellTypeSpecificityAnnotation]]
          : undefined
      ),
    });

    return lookup;
  }, new Map());
};

export const loadExternalPrioritisationLookup = async () => {
  if (!externalPrioritisationLookupPromise) {
    externalPrioritisationLookupPromise = fetch(TARGET_PRIORITISATION_FACTORS_PATH)
      .then(response => {
        if (response.status === 404) return "";
        if (!response.ok) {
          throw new Error(
            `Failed to load custom prioritisation lookup: ${response.status} ${response.statusText}`
          );
        }

        return response.text();
      })
      .then(parseLookupTsv)
      .catch(error => {
        console.warn(error);
        return new Map();
      });
  }

  return externalPrioritisationLookupPromise;
};

export const mergeExternalPrioritisationRows = (rows, lookup = new Map()) => {
  if (!lookup.size) return rows;

  return rows.map(row => {
    if (!row.prioritisations) return row;

    const externalScores = lookup.get(row.id);
    if (!externalScores) return row;

    return {
      ...row,
      prioritisations: {
        ...row.prioritisations,
        ...Object.fromEntries(
          Object.entries(externalScores).filter(([, value]) => value !== undefined)
        ),
      },
    };
  });
};