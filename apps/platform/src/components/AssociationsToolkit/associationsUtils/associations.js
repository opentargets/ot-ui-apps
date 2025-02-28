import { ENTITIES } from "./index";
import { v1 } from "uuid";

const getEmptyRow = id => ({
  dataSources: {},
  prioritisations: {},
  score: 0,
  disease: { id },
  target: { id },
});

/***********
 * HELPERS *
 ***********/

/**
 * Extracts and returns associated target rows from the disease data.
 * @param {Object} data - The data object containing disease associations.
 * @returns {Array} Associated target rows.
 */
export const diseaseAssociationsTargetSelector = data =>
  data[ENTITIES.DISEASE].associatedTargets.rows;

/**
 * Extracts and returns associated disease rows from the target data.
 * @param {Object} data - The data object containing target associations.
 * @returns {Array} Associated disease rows.
 */
export const targetAssociationsDiseaseSelector = data =>
  data[ENTITIES.TARGET].associatedDiseases.rows;

/**
 * Extracts and returns prioritisation items from the target data for disease prioritisation.
 * @param {Object} data - The data object containing prioritisation items.
 * @returns {Array} Prioritisation items.
 */
export const diseasePrioritisationTargetsSelector = data =>
  data[ENTITIES.TARGET].prioritisation.items;

/**
 * Processes the prioritisation data and converts it into a key-value pair object.
 * @param {Object} data - The data object containing prioritisation items.
 * @returns {Object} Key-value pair object with prioritisation keys and their respective scores.
 */
export const getPrioritisationData = data => {
  const dataRows = diseasePrioritisationTargetsSelector(data);
  const prioritisations = dataRows.reduce(
    (acc, curr) => ((acc[curr.key] = parseFloat(curr.value)), acc),
    {}
  );
  return { prioritisations };
};

/**
 * Processes data source scores and converts them into a key-value pair object.
 * @param {Object} data - The data object containing data source scores.
 * @returns {Object} Key-value pair object with component IDs and their respective scores.
 */
export const getDataSourcesData = data => {
  const sources = data.datasourceScores.reduce(
    (acc, curr) => ((acc[curr.componentId] = curr.score), acc),
    {}
  );
  return sources;
};

/**
 * Retrieves metadata for a given row based on the fixed entity type.
 * @param {Object} parentEntity - The parent entity object.
 * @param {Object} row - The current row object.
 * @param {string} fixedEntity - The fixed entity type.
 * @returns {Object} Metadata object containing target symbol, disease name, and ID.
 */
export const getDataRowMetadata = (parentEntity, row, fixedEntity) => {
  let targetSymbol, diseaseName, id;
  switch (fixedEntity) {
    case ENTITIES.DISEASE:
      id = row.target.id;
      targetSymbol = row.target.approvedSymbol;
      diseaseName = parentEntity.disease.name;
      break;
    case ENTITIES.TARGET:
      id = row.disease.id;
      targetSymbol = parentEntity.target.approvedSymbol;
      diseaseName = row.disease.name;
      break;
    default:
      return { targetSymbol, diseaseName };
  }
  return { targetSymbol, diseaseName, id };
};

/**
 * Returns the total count of associated diseases or targets based on the fixed entity type.
 * @param {string} fixedEntity - The fixed entity type.
 * @param {Object} data - The data object containing associations count.
 * @returns {number} The total count of associated diseases or targets.
 */
export const getAllDataCount = (fixedEntity, data) => {
  switch (fixedEntity) {
    case ENTITIES.TARGET:
      return data[ENTITIES.TARGET].associatedDiseases.count;
    case ENTITIES.DISEASE:
      return data[ENTITIES.DISEASE].associatedTargets.count;
    default:
      return 0;
  }
};

/**
 * Aggregates and formats association data based on the fixed entity type.
 * @param {string} fixedEntity - The fixed entity type.
 * @param {Object} data - The data object containing association data.
 * @returns {Array} Formatted association data.
 */
export const getAssociationsData = (fixedEntity, data) => {
  if (!data) return [];
  const withPrioritisation = fixedEntity === ENTITIES.DISEASE;
  const dataRows =
    fixedEntity === ENTITIES.DISEASE
      ? diseaseAssociationsTargetSelector(data)
      : targetAssociationsDiseaseSelector(data);

  return dataRows.map(row => {
    const dataSources = getDataSourcesData(row);
    const { targetSymbol, diseaseName, id } = getDataRowMetadata(data, row, fixedEntity);
    return {
      score: row.score,
      id,
      targetSymbol,
      diseaseName,
      dataSources,
      ...(!withPrioritisation && { disease: row.disease }),
      ...(withPrioritisation && { target: row.target }),
      ...(withPrioritisation && getPrioritisationData(row)),
    };
  });
};

/**
 * Generates an array of empty rows for initial loading.
 * @param {number} [rowCount=10] - The number of empty rows to generate.
 * @returns {Array} Array of empty rows.
 */
export const getInitialLoadingData = (rowCount = 10) => {
  const arr = [];
  for (let i = 0; i < rowCount; i++) {
    arr.push(getEmptyRow(v1()));
  }
  return arr;
};
