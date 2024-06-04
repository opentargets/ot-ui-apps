/* eslint-disable */
import { useEffect, useState } from "react";
import client from "../../../client";
import { ENTITIES } from "../utils";
import { v1 } from "uuid";

import InteractionsQuery from "../query/InteractionsQuery.gql";

const INITIAL_ROW_COUNT = 30;

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

//TODO: review
const getInitialLoadingData = () => {
  const arr = [];
  for (let i = 0; i < INITIAL_ROW_COUNT; i++) {
    arr.push(getEmptyRow());
  }
  return arr;
};

const INITIAL_USE_ASSOCIATION_STATE = {
  loading: false,
  error: false,
  data: getInitialLoadingData(),
  initialLoading: true,
  count: 0,
};

/********
 * HOOK *
 ********/
function useAssociationsData({
  query,
  options: {
    id = "",
    index = 0,
    size = 50,
    filter = "",
    sortBy = "score",
    aggregationFilters = [],
    enableIndirect = false,
    datasources = [],
    rowsFilter = [],
    entityInteractors = null,
    entity,
  },
}) {
  const [state, setState] = useState(INITIAL_USE_ASSOCIATION_STATE);

  useEffect(() => {
    async function getInteractors() {
      if (entityInteractors.lenght < 1) return;

      const currentData = [...state.data];
      const rowInteractorsId = entityInteractors[0][0];
      const rowInteractorsSource = entityInteractors[0][1];
      const elIndex = currentData.findIndex(e => e.id === rowInteractorsId);

      if (elIndex === -1) return;
      const element = currentData[elIndex];

      const targetRowInteractorsRequest = await client.query({
        query: InteractionsQuery,
        variables: {
          sourceDatabase: rowInteractorsSource,
          ensgId: element.id,
          index: 0,
          size: 10,
        },
      });

      if (!targetRowInteractorsRequest.data) {
        return;
      }

      /**
       * TODO: REVIEW - move to util func
       */
      const targetRowInteractors = [
        ...new Set(
          targetRowInteractorsRequest.data.target.interactions.rows.map(item => ({
            id: item.targetB.id,
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
        query,
        variables: {
          id,
          index,
          size,
          filter,
          sortBy,
          enableIndirect,
          datasources,
          rowsFilter: targetRowInteractors.map(int => int.id),
          aggregationFilters: aggregationFilters.map(el => ({
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

      element.interactors = targetRowInteractorsAssociations;

      setState({
        ...state,
        data: currentData,
      });
    }
    if (entityInteractors !== null) getInteractors();
  }, [entityInteractors]);

  useEffect(() => {
    let isCurrent = true;
    if (!state.loading) setState({ ...state, loading: true });
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
      const parsedData = getAssociationsData(entity, resData.data);
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
