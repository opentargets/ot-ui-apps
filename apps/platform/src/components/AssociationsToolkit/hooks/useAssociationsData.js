import { useEffect, useState } from 'react';
import client from '../../../client';
import targetPropritisation from '../static_datasets/prototype20230217.json';

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
    return {
      id: d.target.id,
      score: d.score,
      target: d.target,
      dataSources: sources,
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

const ADD_PRIORITIZATION = async data => {
  const dataWithPrioritization = await data.map(targetRow => {
    let { prioritisations } = targetPropritisation.find(
      el => el.targetid === targetRow.target.id
    );
    const objectPrioritization = prioritisations.reduce(
      (acc, curr) => ((acc[curr.id] = curr.value), acc),
      {}
    );
    return { ...targetRow, prioritisations: objectPrioritization };
  });
  return dataWithPrioritization;
};

function useTargetAssociations({
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
    entity,
  },
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);
  const [count, setCount] = useState(0);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    let isCurrent = true;
    setLoading(true);
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
        },
      });
      let parsedData = getParsedData(entity, resData.data);
      //  THIS SHOULD BE REMOVED WHEN ADDED PRIORITIZATION API
      if (entity === 'disease') {
        let withPrioritization = await ADD_PRIORITIZATION(parsedData);
        parsedData = withPrioritization;
      }
      let dataCount = getAllDataCount(entity, resData.data);
      console.log('TRIGGERED REQUEST', { resData });
      setCount(dataCount);
      setData(parsedData);
      setInitialLoading(false);
      setLoading(false);
    };
    fetchData();
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
  ]);

  return { loading, error, data, initialLoading, count };
}

export default useTargetAssociations;
