/* eslint-disable */
import { useEffect, useState } from "react";
import client from "../../../../client";
import { ENTITIES } from "../../utils";
import { v1 } from "uuid";

import InteractionsQuery from "./InteractionsQuery.gql";
import DiseaseAssociationsQuery from "../../../../pages/DiseasePage/DiseaseAssociations/DiseaseAssociationsQuery.gql";

const INITIAL_ROW_COUNT = 8;

const getEmptyRow = () => ({
  dataSources: {},
  score: 0,
  disease: { id: v1() },
  target: { id: v1() },
});

/***********
 * HELPERS *
 ***********/
const diseaseAssociationsTargetSelector = data => data[ENTITIES.DISEASE].associatedTargets.rows;
const targetAssociationsDiseaseSelector = data => data[ENTITIES.TARGET].associatedDiseases.rows;

const diseasePrioritisationTargetsSelector = data => data[ENTITIES.TARGET].prioritisation.items;

const getPrioritisationData = data => {
  const dataRows = diseasePrioritisationTargetsSelector(data);
  const prioritisations = dataRows.reduce(
    (acc, curr) => ((acc[curr.key] = parseFloat(curr.value)), acc),
    {}
  );
  return { prioritisations };
};

const getDataSourcesData = data => {
  const sources = data.datasourceScores.reduce(
    (acc, curr) => ((acc[curr.componentId] = curr.score), acc),
    {}
  );
  return sources;
};

const getDataRowMetadata = (parentEntity, row, fixedEntity) => {
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
    default:
      return { targetSymbol, diseaseName };
  }
  return { targetSymbol, diseaseName, id };
};

const getAllDataCount = (fixedEntity, data) => {
  switch (fixedEntity) {
    case ENTITIES.TARGET:
      return data[ENTITIES.TARGET].associatedDiseases.count;
    case ENTITIES.DISEASE:
      return data[ENTITIES.DISEASE].associatedTargets.count;
    default:
      return 0;
  }
};

const getAssociationsData = (fixedEntity, data) => {
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

//TODO: review
const getInitialLoadingData = () => {
  const arr = [];
  for (let i = 0; i < INITIAL_ROW_COUNT; i++) {
    arr.push(getEmptyRow());
  }
  return arr;
};

const INITIAL_USE_ASSOCIATION_STATE = {
  loading: true,
  error: false,
  data: getInitialLoadingData(),
  initialLoading: true,
  count: 0,
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
      const currentData = [...state.data];
      const rowInteractorsId = id;
      const rowInteractorsSource = source;

      const targetRowInteractorsRequest = await client.query({
        query,
        variables: {
          sourceDatabase: rowInteractorsSource,
          ensgId: rowInteractorsId,
          index: 0,
          size: 10,
        },
      });

      if (!targetRowInteractorsRequest.data) {
        return;
      }

      const interactorsCount = targetRowInteractorsRequest.data.target.interactions.count;
      const interactorsIds = [
        ...new Set(
          targetRowInteractorsRequest.data.target.interactions.rows.map(int => int.targetB?.id)
        ),
      ];
      console.log({ interactorsIds, targetRowInteractorsRequest });
      /**
       * TODO: REVIEW - move to util func
       */
      const targetRowInteractors = [
        ...new Set(
          targetRowInteractorsRequest.data.target.interactions.rows.map(item => ({
            id: item.targetB?.id || v1(),
            targetSymbol: item.targetB.approvedSymbol,
            dataSources: {},
            prioritisations: {},
            diseaseName: "",
            score: 0,
            target: {
              id: item.targetB.id,
              approvedSymbol: item.targetB.approvedSymbol,
            },
          }))
        ),
      ];

      const interactorsAssociationsRequest = await client.query({
        query: associationsQuery,
        variables: {
          id: diseaseId,
          index,
          size,
          filter,
          sortBy,
          enableIndirect,
          datasources,
          rowsFilter: targetRowInteractors.map(int => int.id),
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

      // merge interactors and associations response
      const targetRowInteractorsAssociations = targetRowInteractors.map(interactor => {
        const assoc = interactorsAssociations.find(e => e.id === interactor.id);
        if (!assoc) return interactor;
        return { ...interactor, ...assoc };
      });

      setState({
        loading: false,
        initialLoading: false,
        count: interactorsCount,
        data: targetRowInteractorsAssociations,
      });
    }
    if (isCurrent) getInteractors();
    return () => (isCurrent = false);
  }, [source]);

  return state;
}

export default useRowInteractors;
