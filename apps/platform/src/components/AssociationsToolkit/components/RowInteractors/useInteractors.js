import { useQuery, useLazyQuery } from "@apollo/client";
import { useState, useEffect } from "react";
import INTERACTIONS_QUERY from "./InteractionsQuery.gql";
import DISEASE_ASSOCIATIONS_QUERY from "../../../../pages/DiseasePage/DiseaseAssociations/DiseaseAssociationsQuery.gql";
import { ENTITIES, getInteractorIdsPLS, getTargetRowInteractorsPLS } from "../../utils";

import useAotfContext from "../../hooks/useAotfContext";

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
      break;
    default:
      return { targetSymbol, diseaseName };
  }
  return { targetSymbol, diseaseName, id };
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

const INTERACTORS_REQUEST_SIZE = 50;
const INTERACTORS_VIEW_SIZE = 5;
const INTERACTORS_CUT = 0.6;

const useInteractor = (ensgId, sourceDatabase) => {
  const [pageIndex, setPageIndex] = useState(0);
  const [allRows, setAllRows] = useState([]);
  const [mergedData, setMergedData] = useState([]);
  const [visibleData, setVisibleData] = useState([]);
  const [visibleLoading, setVisibleLoading] = useState(true);

  const {
    id: diseaseId,
    sorting,
    enableIndirect,
    dataSourcesWeights,
    dataSourcesRequired,
  } = useAotfContext();

  useEffect(() => {
    setVisibleLoading(true);
    setPageIndex(0);
  }, [sourceDatabase]);

  const { loading, error, fetchMore } = useQuery(INTERACTIONS_QUERY, {
    variables: { ensgId, sourceDatabase, index: 0, size: INTERACTORS_REQUEST_SIZE },
    notifyOnNetworkStatusChange: true,
    onCompleted: data => {
      const rows = data.target.interactions.rows;
      const interactorsIds = getInteractorIdsPLS(rows);
      const targetRowInteractors = getTargetRowInteractorsPLS(rows, interactorsIds);
      console.log("inte", targetRowInteractors, rows);
      setAllRows(targetRowInteractors);
      fetchDiseaseAssociations({
        variables: {
          id: diseaseId,
          rowsFilter: interactorsIds,
          index: 0,
          size: interactorsIds.length,
          filter: "",
          sortBy: sorting[0].id,
          enableIndirect,
          dataSourcesWeights,
          aggregationFilters: dataSourcesRequired.map(el => ({
            name: el.name,
            path: el.path,
          })),
        },
      });
    },
  });

  const [fetchDiseaseAssociations, { loading: assocLoading, error: assocError }] = useLazyQuery(
    DISEASE_ASSOCIATIONS_QUERY,
    {
      onCompleted: associationsData => {
        console.log("assoc");
        const interactorsAssociations = getAssociationsData(ENTITIES.DISEASE, associationsData);
        const targetRowInteractorsAssociations = allRows.map(interactor => {
          const assoc = interactorsAssociations.find(e => e.id === interactor.id);
          if (!assoc) return interactor;
          return { ...interactor, ...assoc };
        });

        setMergedData(targetRowInteractorsAssociations);
        const startIndex = pageIndex * INTERACTORS_VIEW_SIZE;
        const endIndex = startIndex + INTERACTORS_VIEW_SIZE;
        setVisibleData(targetRowInteractorsAssociations.slice(startIndex, endIndex));
        setVisibleLoading(false);
      },
    }
  );

  const loadMore = () => {
    fetchMore({
      variables: {
        ensgId,
        sourceDatabase,
        index: Math.floor(allRows.length / INTERACTORS_REQUEST_SIZE),
        size: INTERACTORS_REQUEST_SIZE,
      },
      updateQuery: (previousResult, { fetchMoreResult }) => {
        if (!fetchMoreResult) return previousResult;
        const newRows = [
          ...previousResult.target.interactions.rows,
          ...fetchMoreResult.target.interactions.rows,
        ];
        const allInteractorsIds = getInteractorIdsPLS(newRows);
        const newInteractorsIds = getInteractorIdsPLS(fetchMoreResult.target.interactions.rows);
        const targetRowInteractors = getTargetRowInteractorsPLS(newRows, newInteractorsIds);
        setAllRows(targetRowInteractors);

        fetchDiseaseAssociations({
          variables: {
            id: diseaseId,
            rowsFilter: newInteractorsIds,
            index: 0,
            size: newInteractorsIds.length,
            filter: "",
            sortBy: sorting[0].id,
            enableIndirect,
            dataSourcesWeights,
            aggregationFilters: dataSourcesRequired.map(el => ({
              name: el.name,
              path: el.path,
            })),
          },
        });

        return {
          ...previousResult,
          target: {
            ...previousResult.target,
            interactions: {
              ...previousResult.target.interactions,
              rows: newRows,
            },
          },
        };
      },
    });
  };

  const nextPage = () => {
    console.log({ mergedData });
    setPageIndex(prevIndex => {
      const newIndex = prevIndex + 1;
      const startIndex = newIndex * INTERACTORS_VIEW_SIZE;
      const endIndex = startIndex + INTERACTORS_VIEW_SIZE;
      if (endIndex > mergedData.length) {
        loadMore();
      } else {
        setVisibleData(mergedData.slice(startIndex, endIndex));
      }
      return newIndex;
    });
  };

  const prevPage = () => {
    setPageIndex(prevIndex => {
      const newIndex = Math.max(prevIndex - 1, 0);
      const startIndex = newIndex * INTERACTORS_VIEW_SIZE;
      const endIndex = startIndex + INTERACTORS_VIEW_SIZE;
      setVisibleData(mergedData.slice(startIndex, endIndex));
      return newIndex;
    });
  };

  return {
    loading,
    error,
    nextPage,
    prevPage,
    pageIndex,
    allRows,
    mergedData,
    assocLoading,
    assocError,
    visibleData,
    visibleLoading,
  };
};

export default useInteractor;
