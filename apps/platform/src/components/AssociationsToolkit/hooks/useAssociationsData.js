/* eslint-disable */
import { useEffect, useState } from 'react';
import client from '../../../client';
import { ENTITIES } from '../utils';

const diseaseAssociationsTargetSelector = data =>
  data[ENTITIES.DISEASE].associatedTargets.rows;
const targetAssociationsDiseaseSelector = data =>
  data[ENTITIES.TARGET].associatedDiseases.rows;

const diseasePrioritisationTargetsSelector = data =>
  data[ENTITIES.TARGET].prioritisation.items;

// const targetSymbolSelector = (data, ass) => entity === ENTITIES
// const diseaseNameSelector = (data, ass) => entity === ENTITIES

const getPrioritisationData = data => {
  const dataRows = diseasePrioritisationTargetsSelector(data);
  return dataRows.reduce(
    (acc, curr) => ((acc[curr.key] = parseFloat(curr.value)), acc),
    {}
  );
};

const getAssociationsData = (data, entity) => {
  if (!data) return [];
  const withPrioririsation = entity === ENTITIES.DISEASE;
  let prioritisations;
  const dataRows =
    entity === ENTITIES.DISEASE
      ? diseaseAssociationsTargetSelector(data)
      : targetAssociationsDiseaseSelector(data);

  return dataRows.map(d => {
    const sources = d.datasourceScores.reduce(
      (acc, curr) => ((acc[curr.componentId] = curr.score), acc),
      {}
    );
    if (withPrioririsation) {
      const prioritisationRows = diseasePrioritisationTargetsSelector(d);
      prioritisations = prioritisationRows.reduce(
        (acc, curr) => ((acc[curr.key] = parseFloat(curr.value)), acc),
        {}
      );
    }
    return {
      id: d.target.id,
      score: d.score,
      target: d.target,
      targetSymbol: d.target.approvedSymbol,
      diseaseName: data.disease.name,
      dataSources: sources,
      ...(withPrioririsation && prioritisations),
    };
  });
};

// Select and parsed data from API response from fixed Target
const getAssociatedDiseasesData = data => {
  if (!data) return [];
  return data.target.associatedDiseases.rows.map(d => {
    const sources = d.datasourceScores.reduce(
      (acc, curr) => ((acc[curr.componentId] = curr.score), acc),
      {}
    );
    return {
      id: d.disease.id,
      score: d.score,
      disease: d.disease,
      targetSymbol: data.target.approvedSymbol,
      diseaseName: d.disease.name,
      dataSources: sources,
    };
  });
};

// Select and parsed data from API response from fixed Disease
const getAssociatedTargetsData = data => {
  if (!data) return [];
  return data.disease.associatedTargets.rows.map(d => {
    const sources = d.datasourceScores.reduce(
      (acc, curr) => ((acc[curr.componentId] = curr.score), acc),
      {}
    );
    const targetPrioritisation = d.target.prioritisation?.items
      ? d.target.prioritisation.items.reduce(
          (acc, curr) => ((acc[curr.key] = parseFloat(curr.value)), acc),
          {}
        )
      : [];
    return {
      id: d.target.id,
      score: d.score,
      target: d.target,
      targetSymbol: d.target.approvedSymbol,
      diseaseName: data.disease.name,
      dataSources: sources,
      prioritisations: targetPrioritisation,
    };
  });
};

const getParsedData = (entity, data) => {
  if (entity === ENTITIES.TARGET) return getAssociatedDiseasesData(data);
  if (entity === ENTITIES.DISEASE) return getAssociatedTargetsData(data);
};

const getAllDataCount = (entity, data) => {
  if (entity === ENTITIES.TARGET) return data.target.associatedDiseases.count;
  if (entity === ENTITIES.DISEASE) return data.disease.associatedTargets.count;
};

const INITIAL_USE_ASSOCIATION_STATE = {
  loading: false,
  error: false,
  data: [],
  initialLoading: true,
  count: 0,
};

function useAssociationsData({
  query,
  options: {
    id = '',
    index = 0,
    size = 50,
    filter = '',
    sortBy = 'score',
    aggregationFilters = [],
    enableIndirect = false,
    datasources = null,
    rowsFilter = [],
    entity,
  },
}) {
  const [state, setState] = useState(INITIAL_USE_ASSOCIATION_STATE);

  useEffect(() => {
    let isCurrent = true;
    setState({ ...state, loading: true });
    const fetchData = async () => {
      const resData = await client.query({
        query,
        variables: {
          id,
          index,
          size,
          filter,
          sortBy,
          enableIndirect,
          datasources,
          rowsFilter,
          aggregationFilters: aggregationFilters.map(el => ({
            name: el.name,
            path: el.path,
          })),
        },
      });
      const parsedData = getParsedData(entity, resData.data);
      const dataCount = getAllDataCount(entity, resData.data);
      setState({
        count: dataCount,
        data: parsedData,
        loading: false,
        initialLoading: false,
      });
    };
    if (isCurrent) fetchData();
    return () => (isCurrent = false);
  }, [
    id,
    index,
    size,
    filter,
    sortBy,
    enableIndirect,
    datasources,
    query,
    entity,
    aggregationFilters,
  ]);

  return state;
}

export default useAssociationsData;
