import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormGroup,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
} from "@mui/material";
import React, { useEffect } from "react";
import { useGeneEnrichment } from "./Provider";

// Dummy library list for now (can be replaced with actual data/fetch)

export type GeneSetSource = "uploaded" | "pinning" | "all";

export interface GeneEnrichmentAnalysisFormProps {
  onSubmit?: (data: { library: string; geneSetSource: GeneSetSource }) => void;
  defaultLibrary?: string;
  defaultGeneSetSource?: GeneSetSource;
}

const GeneEnrichmentAnalysisForm: React.FC<GeneEnrichmentAnalysisFormProps> = ({
  onSubmit,
  defaultLibrary,
  defaultGeneSetSource = "all",
}) => {
  const [library, setLibrary] = React.useState(defaultLibrary || "");
  const [geneSetSource, setGeneSetSource] = React.useState<GeneSetSource>(defaultGeneSetSource);
  const [state] = useGeneEnrichment();

  // Set library to first option when available and not already set, unless defaultLibrary exists
  useEffect(() => {
    if (!defaultLibrary && !library && state.libraries.length > 0) {
      setLibrary(state.libraries[0]);
    }
  }, [state.libraries, library, defaultLibrary]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) onSubmit({ library, geneSetSource });
  };

  if (state.librariesLoading) return <Box>Loading libraries...</Box>;

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ p: 2 }}>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 4 }}>
          <FormControl>
            <FormGroup sx={{ ".MuiFormControlLabel-labelPlacementStart": { ml: "0 !important" } }}>
              <FormControlLabel
                labelPlacement="start"
                control={
                  <Select
                    sx={{ ml: 2 }}
                    value={library}
                    onChange={(e) => setLibrary(e.target.value as string)}
                  >
                    {state.libraries.map((opt) => (
                      <MenuItem value={opt} key={opt}>
                        {opt}
                      </MenuItem>
                    ))}
                  </Select>
                }
                label="Library"
              />
            </FormGroup>
          </FormControl>
          <FormControl component="fieldset">
            <RadioGroup
              row
              name="gene-set-source"
              value={geneSetSource}
              onChange={(e) => setGeneSetSource(e.target.value as typeof geneSetSource)}
            >
              <FormControlLabel
                value="all"
                control={<Radio />}
                label="All results from associations"
              />
              {state.associationsState.uploadedEntities.length > 0 && (
                <FormControlLabel
                  value="uploaded"
                  disabled={state.associationsState.uploadedEntities.length === 0}
                  control={<Radio />}
                  label="Uploaded set"
                />
              )}
              {state.associationsState.pinnedEntities.length > 0 && (
                <FormControlLabel
                  value="pinning"
                  disabled={state.associationsState.pinnedEntities.length === 0}
                  control={<Radio />}
                  label="Pinning set"
                />
              )}
            </RadioGroup>
          </FormControl>
        </Box>
      </Box>
      <Box display="flex" sx={{ mt: 12, justifyContent: "center" }}>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={!library}
          sx={{ width: "50%" }}
        >
          Run enrichment analysis
        </Button>
      </Box>
    </Box>
  );
};

export default GeneEnrichmentAnalysisForm;
