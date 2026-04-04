import type { ApolloClient } from "@apollo/client";
import type { Dispatch } from "react";
import { addRun, setActiveRun, updateRun } from "../actions";
import DISEASE_ASSOCIATIONS_QUERY from "../api/DiaseaseAssociationsQuery.gql";
import { analyzeGsea } from "../api/gseaApi";
import type { Action, AnalysisInputs, AnalysisRun, AssociationsState, Gene, State } from "../types";

function generateRunId(): string {
  return `run_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

interface UseGseaAnalysisParams {
  client: ApolloClient<object>;
  state: State;
  dispatch: Dispatch<Action>;
}

export function useGseaAnalysis({ client, state, dispatch }: UseGseaAnalysisParams) {
  const { associationsState, analysisInputs, runs, activeRunId } = state;

  const activeRun = activeRunId ? runs.find((run) => run.id === activeRunId) : null;

  const runAnalysis = async () => {
    const runId = generateRunId();

    // Create new run with pending status
    const newRun: AnalysisRun = {
      id: runId,
      timestamp: Date.now(),
      status: "pending",
      inputs: { ...analysisInputs },
      efoId: associationsState.efoId,
      genes: [],
      results: [],
      inputOverlap: null,
      error: null,
    };

    dispatch(addRun(newRun));

    // Update to fetching_associations
    dispatch(updateRun(runId, { status: "fetching_associations" }));

    try {
      // Step 1: Fetch associations from GraphQL
      const { data } = await client.query({
        query: DISEASE_ASSOCIATIONS_QUERY,
        variables: {
          efoId: associationsState.efoId,
          index: 0,
          size: 3000,
          sortBy: associationsState.sortBy,
          enableIndirect: associationsState.enableIndirect,
          datasources: associationsState.datasources,
          rowsFilter: associationsState.rowsFilter,
          facetFilters: associationsState.facetFilters,
          entitySearch: associationsState.entitySearch,
        },
      });

      const rows = data?.disease?.associatedTargets?.rows || [];

      // Filter based on geneSetSource
      let filteredRows = rows;
      if (analysisInputs.geneSetSource === "uploaded") {
        filteredRows = rows.filter((row: any) =>
          associationsState.uploadedEntities.includes(row.target.id)
        );
      } else if (analysisInputs.geneSetSource === "pinned") {
        filteredRows = rows.filter((row: any) =>
          associationsState.pinnedEntities.includes(row.target.id)
        );
      }

      // Transform to Gene format for GSEA API
      const genes: Gene[] = filteredRows.map((row: any) => ({
        symbol: row.target.approvedSymbol,
        globalScore: row.score,
      }));

      if (genes.length === 0) {
        throw new Error("No genes found for the selected criteria");
      }

      // Update with genes and move to running_gsea
      dispatch(updateRun(runId, { genes, status: "running_gsea" }));

      // Step 2: Call GSEA API
      const { results, input_overlap: inputOverlap } = await analyzeGsea({
        genes,
        library: analysisInputs.selectedLibrary,
        analysisDirection: analysisInputs.analysisDirection,
      });

      // Update with results and mark complete
      dispatch(updateRun(runId, { results, inputOverlap, status: "complete" }));
    } catch (error) {
      dispatch(
        updateRun(runId, {
          status: "error",
          error: error instanceof Error ? error.message : "Analysis failed",
        })
      );
    }
  };

  const reset = () => {
    dispatch(setActiveRun(null));
  };

  const isLoading =
    activeRun?.status === "fetching_associations" || activeRun?.status === "running_gsea";

  return {
    step: activeRun?.status ?? "idle",
    genes: activeRun?.genes ?? [],
    results: activeRun?.results ?? [],
    inputOverlap: activeRun?.inputOverlap ?? null,
    error: activeRun?.error ?? null,
    activeRun,
    runs,
    isLoading,
    runAnalysis,
    reset,
  };
}
