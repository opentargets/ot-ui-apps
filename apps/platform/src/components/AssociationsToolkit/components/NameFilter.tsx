import { useState, useEffect } from "react";
import { styled, Box, InputAdornment, Input, useTheme } from "@mui/material";
import useAotfContext from "../hooks/useAotfContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { useDebounce } from "ui";
import { setEntitySearch } from "../context/aotfActions";
import { grey } from "@mui/material/colors";

const NameFilterInput = styled(Input)(({ theme }) => ({
  // marginTop: theme.spacing(2),
  width: "200px",
  "&::before": {
    // borderWidth: "1.5px",
    // marginBottom: "-4px",
    // borderBottomColor: theme.palette.primary.dark,
  },
  "& input::placeholder": {
    color: grey[900],
    // borderBottomColor: theme.palette.primary.dark,
  },
}));

const NameFilter = () => {
  const { entityToGet, dispatch } = useAotfContext();
  const theme = useTheme();
  const placeHolderEntity = entityToGet === "target" ? "target" : "disease";

  const [inputValue, setInputValue] = useState("");
  const debouncedInputValue = useDebounce(inputValue, 300);

  useEffect(() => {
    dispatch(setEntitySearch(debouncedInputValue));
  }, [debouncedInputValue]);

  return (
    <Box>
      <NameFilterInput
        onChange={event => {
          setInputValue(event.target.value);
        }}
        // sx={{ fontSize: "14px" }}
        placeholder={`Search ${placeHolderEntity}...`}
        startAdornment={
          <InputAdornment position="start">
            <FontAwesomeIcon style={{ color: theme.palette.primary.dark }} icon={faSearch} />
          </InputAdornment>
        }
      />
    </Box>
  );
};

export default NameFilter;
