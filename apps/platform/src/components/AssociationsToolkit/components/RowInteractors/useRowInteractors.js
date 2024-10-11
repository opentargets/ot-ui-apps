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
    enableIndirect = false,
    datasources = [],
    rowsFilter = [],
    entityInteractors = null,
    scoreThreshold = null,
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
          scoreThreshold,
          sourceDatabase: rowInteractorsSource,
          ensgId: rowInteractorsId,
          index: 0,
          size: 5000,
        },
      });

      if (!targetRowInteractorsRequest?.data?.target?.interactions?.rows) {
        setState({
          interactorsMetadata: { count: 0 },
          loading: false,
          initialLoading: false,
          count: 0,
          data: [],
        });
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

      const interactorsAssociationsWithScore = addInteractorScore(
        interactorsAssociations,
        targetRowInteractorsRequest.data.target.interactions.rows
      );

      setState({
        interactorsMetadata: targetRowInteractorsRequest.data.target.interactions,
        loading: false,
        initialLoading: false,
        count: interactorsAssociationsWithScore.length,
        data: interactorsAssociationsWithScore,
      });
    }
    if (isCurrent) getInteractors();
    return () => (isCurrent = false);
  }, [source, sortBy, scoreThreshold]);

  return state;
}

function addInteractorScore(associationsData, interactorsMetaData) {
  return associationsData.map(element => {
    const foundInteractor = interactorsMetaData.find(x => x.targetB?.id === element.id);
    if (!foundInteractor) return { ...element, interactorScore: 0 };
    return { ...element, interactorScore: foundInteractor.score };
  });
}

export default useRowInteractors;
