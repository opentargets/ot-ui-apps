import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormGroup,
  MenuItem,
  Select,
} from "@mui/material";
import React from "react";
import { useGeneEnrichment } from "./Provider";

// Dummy library list for now (can be replaced with actual data/fetch)

export interface GeneEnrichmentAnalysisFormProps {
  onSubmit?: (data: { library: string }) => void;
  defaultLibrary?: string;
}

const GeneEnrichmentAnalysisForm: React.FC<GeneEnrichmentAnalysisFormProps> = ({
  onSubmit,
  defaultLibrary,
}) => {
  const [library, setLibrary] = React.useState(defaultLibrary || "");
  const [state] = useGeneEnrichment();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) onSubmit({ library });
  };

  if (state.librariesLoading) return <Box>Loading libraries...</Box>;

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ display: "flex", flexDirection: "column", gap: 3, mt: 2 }}
    >
      <Box sx={{ display: "flex", gap: 2 }}>
        <FormControl>
          <FormGroup>
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
      </Box>
      <Button type="submit" variant="contained" color="primary" disabled={!library}>
        Run enrichment analysis
      </Button>
    </Box>
  );
};

export default GeneEnrichmentAnalysisForm;
