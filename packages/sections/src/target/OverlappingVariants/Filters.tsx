import { useStateValue, useActions } from "./Context";
import { Autocomplete, Box, TextField, Chip } from "@mui/material";
import { VARIANT_CONSEQUENCES, DATASOURCES } from "@ot/constants";

function VariantFilter() {
  const { state } = useStateValue();
  const { setVariant } = useActions();

  function handleChange(event) {
    setVariant(event.target.value);
  }

  return (
    <TextField
      label="Variant ID"
      variant="outlined"
      value={state.variant}
      onChange={handleChange}
      size="small"
    />
  );
}

function ConsequenceFilter() {
  const { setConsequence } = useActions();

  function handleChange(event, value) {
    setConsequence(value);
  }

  return (
    <Autocomplete
      multiple
      onChange={handleChange}
      options={VARIANT_CONSEQUENCES.filter(c => c.proteinCoding)}
      getOptionLabel={option => option.label}
      sx={{ width: 200 }}
      renderInput={params => <TextField {...params} label="Variant consequences" />}
      size="small"
      isOptionEqualToValue={(option, value) => option.id === value.id}
      // renderValue={(value, getItemProps) => <Chip label={value} {...getItemProps()} />}
    />
  );
}

function EvidenceFilter() {
  const { setEvidence } = useActions();

  function handleChange(event, value) {
    setEvidence(value);
  }

  return (
    <Autocomplete
      multiple
      onChange={handleChange}
      options={DATASOURCES}
      getOptionLabel={option => option.datasourceNiceName}
      sx={{ width: 200 }}
      renderInput={params => <TextField {...params} label="Evidence" />}
      size="small"
      isOptionEqualToValue={(option, value) => option.datasourceId === value.datasourceId}
      // renderValue={(value, getItemProps) => <Chip label={value} {...getItemProps()} />}
    />
  );
}

function Filters() {
  return (
    <Box display="flex" gap={2}>
      <VariantFilter />
      <ConsequenceFilter />
      <EvidenceFilter />
    </Box>
  );
}
export default Filters;
