import { useEffect, useState } from "react";
import client from "../../../../client";
import { getAssociationsData, getInteractorIds, getInitialLoadingData } from "../../utils";

import InteractionsQuery from "./InteractorsQuery.gql";
import DiseaseAssociationsQuery from "../../../../pages/DiseasePage/DiseaseAssociations/DiseaseAssociationsQuery.gql";

const INITIAL_ROW_COUNT = 8;

const INITIAL_USE_ASSOCIATION_STATE = {
  loading: true,
  error: false,
  data: getInitialLoadingData(INITIAL_ROW_COUNT),
  initialLoading: true,
  count: 0,
  interactorsMetadata: [],
};

/********
 * HOOK *
 ********/
function useRowInteractors({
  query = InteractionsQuery,
  associationsQuery = DiseaseAssociationsQuery,
  options: {
    id = "",
    index = 0,
    size = 50,
    filter = "",
    source = "intac",
    aggregationFilters = [],
    enableIndirect = false,
    datasources = [],
    rowsFilter = [],
    entityInteractors = null,
    entity,
    diseaseId,
    sortBy,
    dataSourcesRequired,
  },
}) {
  const [state, setState] = useState(INITIAL_USE_ASSOCIATION_STATE);

  useEffect(() => {
    let isCurrent = true;
    async function getInteractors() {
      setState({
        ...state,
        loading: true,
      });
      const rowInteractorsId = id;
      const rowInteractorsSource = source;

      const targetRowInteractorsRequest = await client.query({
        query,
        variables: {
          sourceDatabase: rowInteractorsSource,
          ensgId: rowInteractorsId,
          index: 0,
          size: 5000,
        },
      });

      if (!targetRowInteractorsRequest.data) {
        return;
      }

      setState({
        ...state,
        interactorsMetadata: targetRowInteractorsRequest.data.target.interactions,
      });

      const interactorsIds = getInteractorIds(targetRowInteractorsRequest);

      const interactorsAssociationsRequest = await client.query({
        query: associationsQuery,
        variables: {
          id: diseaseId,
          index,
          size: interactorsIds.length,
          filter,
          sortBy,
          enableIndirect,
          datasources,
          rowsFilter: interactorsIds,
          aggregationFilters: dataSourcesRequired.map(el => ({
            name: el.name,
            path: el.path,
          })),
        },
      });

      const interactorsAssociations = getAssociationsData(
        entity,
        interactorsAssociationsRequest.data
      );

      setState({
        interactorsMetadata: targetRowInteractorsRequest.data.target.interactions,
        loading: false,
        initialLoading: false,
        count: interactorsAssociations.length,
        data: interactorsAssociations,
      });
    }
    if (isCurrent) getInteractors();
    return () => (isCurrent = false);
  }, [source, sortBy, dataSourcesRequired]);

  return state;
}

export default useRowInteractors;
