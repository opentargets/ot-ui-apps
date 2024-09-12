import { useEffect, useState } from "react";
import client from "../../../../client";
import {
  getAssociationsData,
  getInteractorIds,
  getInitialLoadingData,
  INTERACTORS_SOURCES,
} from "../../utils";

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
    source = INTERACTORS_SOURCES.INTACT,
    aggregationFilters = [],
    enableIndirect = false,
    datasources = [],
    rowsFilter = [],
    entityInteractors = null,
    entity,
    diseaseId,
    sortBy,
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
          rowsFilter: interactorsIds,
          datasources: datasources.map(el => ({
            id: el.id,
            weight: el.weight,
            propagate: el.propagate,
            required: el.required,
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
  }, [source, sortBy]);

  return state;
}

export default useRowInteractors;
