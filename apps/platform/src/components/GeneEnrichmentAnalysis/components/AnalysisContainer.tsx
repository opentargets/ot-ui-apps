import { Box, Button, CircularProgress, Typography } from "@mui/material";
import { useEffect } from "react";
import { useApolloClient } from "ui";
import { setAnalysisInputs } from "../actions";
import { useGseaAnalysis } from "../hooks/useGseaAnalysis";
import { useGeneEnrichment } from "../Provider";
import type { GeneSetSource } from "../types";
import AnalysisForm from "./AnalysisForm";
import AnalysisResults from "./AnalysisResults";

const STEP_MESSAGES: Record<string, string> = {
  fetching_associations: "Fetching associations...",
  running_gsea: "Running enrichment analysis...",
};

function AnalysisContainer() {
  const client = useApolloClient();
  const [state, dispatch] = useGeneEnrichment();
  const { analysisInputs, associationsState, libraries, librariesLoading } = state;

  const { step, results, error, isLoading, runAnalysis, reset } = useGseaAnalysis({
    client,
    state,
    dispatch,
  });

  // Set library to first option when available and not already set
  useEffect(() => {
    if (!analysisInputs.selectedLibrary && libraries.length > 0) {
      dispatch(setAnalysisInputs({ selectedLibrary: libraries[0] }));
    }
  }, [libraries, analysisInputs.selectedLibrary, dispatch]);

  const handleLibraryChange = (value: string) => {
    dispatch(setAnalysisInputs({ selectedLibrary: value }));
  };

  const handleGeneSetSourceChange = (value: GeneSetSource) => {
    dispatch(setAnalysisInputs({ geneSetSource: value }));
  };

  // Loading libraries
  if (librariesLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  // Analysis in progress
  if (isLoading) {
    return (
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, p: 4 }}>
        <CircularProgress />
        <Typography>{STEP_MESSAGES[step]}</Typography>
      </Box>
    );
  }

  // Error state
  if (step === "error") {
    return (
      <Box sx={{ p: 2, textAlign: "center" }}>
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
        <Button variant="outlined" onClick={reset}>
          Try again
        </Button>
      </Box>
    );
  }

  // Analysis complete
  if (step === "complete") {
    return <AnalysisResults results={results} onReset={reset} />;
  }

  // Default: input form
  return (
    <AnalysisForm
      libraries={libraries}
      analysisInputs={analysisInputs}
      associationsState={associationsState}
      onLibraryChange={handleLibraryChange}
      onGeneSetSourceChange={handleGeneSetSourceChange}
      onSubmit={runAnalysis}
    />
  );
}

export default AnalysisContainer;
