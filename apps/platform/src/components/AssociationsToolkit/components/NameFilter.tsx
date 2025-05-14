import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, InputAdornment, TextField, styled, useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import { useDebounce } from "ui";
import { setEntitySearch } from "../context/aotfActions";
import useAotfContext from "../hooks/useAotfContext";

const NameFilterInput = styled(TextField)(() => ({
  borderRadius: "2px",
  margin: 0,
  "& .MuiInputBase-input": {
    fontSize: "0.875rem",
  },
  "& input::placeholder": {
    color: "#000",
  },
}));

const NameFilter = () => {
  const { entityToGet, dispatch, entitySearch } = useAotfContext();
  const placeHolderEntity = entityToGet === "target" ? "target" : "disease";

  const [inputValue, setInputValue] = useState("");
  const debouncedInputValue = useDebounce(inputValue, 300);

  useEffect(() => {
    dispatch(setEntitySearch(debouncedInputValue));
  }, [debouncedInputValue]);

  useEffect(() => {
    if (entitySearch !== inputValue) setInputValue(entitySearch);
  }, [entitySearch]);

  return (
    <Box sx={{ width: { md: 220 } }}>
      <NameFilterInput
        value={inputValue}
        onChange={(event) => {
          setInputValue(event.target.value);
        }}
        size="small"
        fullWidth
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <FontAwesomeIcon icon={faSearch} />
            </InputAdornment>
          ),
        }}
        placeholder={`Search ${placeHolderEntity}...`}
      />
    </Box>
  );
};

export default NameFilter;
