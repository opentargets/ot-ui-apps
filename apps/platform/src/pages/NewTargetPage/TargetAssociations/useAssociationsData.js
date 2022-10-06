import { useEffect, useState } from 'react';
import client from '../../../client';
import TARGET_ASSOCIATIONS_QUERY from './TargetAssociationsQuery.gql';

// Select and parsed data from API response
const getAssociatedDiseasesData = data => {
  if (!data) return [];
  return data.target.associatedDiseases.rows.map(d => {
    const sources = d.datasourceScores.reduce(
      (acc, curr) => ((acc[curr.componentId] = curr.score), acc),
      {}
    );
    return { ...d, ...sources };
  });
};

function useTargetAssociations({
  ensemblId = '',
  index = 0,
  size = 50,
  filter = '',
  sortBy = 'score',
  aggregationFilters = [],
  enableIndirect = false,
  datasources = null,
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    let isCurrent = true;
    setLoading(true);
    client
      .query({
        query: TARGET_ASSOCIATIONS_QUERY,
        variables: {
          ensemblId,
          index,
          size,
          filter,
          sortBy,
          enableIndirect,
          datasources,
        },
      })
      .then(({ data: resData, error }) => {
        if (error) {
          return;
        }
        if (isCurrent) {
          let parsedData = getAssociatedDiseasesData(resData);
          setData(parsedData);
          setInitialLoading(false);
          setLoading(false);
        }
      });
    return () => (isCurrent = false);
  }, [ensemblId, index, size, filter, sortBy, enableIndirect, datasources]);

  return { loading, error, data, initialLoading };
}

export default useTargetAssociations;
