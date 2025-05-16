import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, InputAdornment, TextField } from "@mui/material";
import { styled } from "@mui/styles";
import { useContext, useEffect, useState } from "react";
import { useDebounce } from "ui";
import { DownloadsContext } from "./context/DownloadsContext";
import { textSearch } from "./context/downloadsActions";

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

function DownloadsSearchInput() {
  const { state, dispatch } = useContext(DownloadsContext);
  const [inputValue, setInputValue] = useState(state.freeTextQuery);
  const debouncedInputValue = useDebounce(inputValue, 300);

  useEffect(() => {
    dispatch(textSearch(debouncedInputValue));
  }, [debouncedInputValue]);

  return (
    <Box sx={{ mb: 3 }}>
      <NameFilterInput
        value={inputValue}
        onChange={event => {
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
        placeholder={`Search...`}
      />
    </Box>
  );
}
export default DownloadsSearchInput;
