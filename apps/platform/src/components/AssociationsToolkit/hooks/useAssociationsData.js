/* eslint-disable */
import { useEffect, useState } from 'react';
import client from '../../../client';

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

const getParsedData = (entity, apiResponse) => {
  if (entity === 'target') return getAssociatedDiseasesData(apiResponse);
  if (entity === 'disease') return getAssociatedTargetsData(apiResponse);
};

const getAllDataCount = (entity, apiResponse) => {
  if (entity === 'target') return apiResponse.target.associatedDiseases.count;
  if (entity === 'disease') return apiResponse.disease.associatedTargets.count;
};

const initialState = {
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
  const [state, setState] = useState(initialState);

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
