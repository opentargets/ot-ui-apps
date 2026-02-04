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
import type { AnalysisInputs, AssociationsState, GeneSetSource } from "../types";

interface AnalysisFormProps {
  libraries: string[];
  analysisInputs: AnalysisInputs;
  associationsState: AssociationsState;
  onLibraryChange: (value: string) => void;
  onGeneSetSourceChange: (value: GeneSetSource) => void;
  onSubmit: () => void;
}

function AnalysisForm({
  libraries,
  analysisInputs,
  associationsState,
  onLibraryChange,
  onGeneSetSourceChange,
  onSubmit,
}: AnalysisFormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

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
                    value={analysisInputs.selectedLibrary}
                    onChange={(e) => onLibraryChange(e.target.value as string)}
                  >
                    {libraries.map((opt) => (
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
              value={analysisInputs.geneSetSource}
              onChange={(e) => onGeneSetSourceChange(e.target.value as GeneSetSource)}
            >
              <FormControlLabel
                value="all"
                control={<Radio />}
                label="All results from associations"
              />
              {associationsState.uploadedEntities.length > 0 && (
                <FormControlLabel value="uploaded" control={<Radio />} label="Uploaded set" />
              )}
              {associationsState.pinnedEntities.length > 0 && (
                <FormControlLabel value="pinned" control={<Radio />} label="Pinned set" />
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
          disabled={!analysisInputs.selectedLibrary}
          sx={{ width: "50%" }}
        >
          Run enrichment analysis
        </Button>
      </Box>
    </Box>
  );
}

export default AnalysisForm;
