import { useContext, useEffect, useState, memo } from "react";
import { styled } from "@mui/material";

import { SearchContext } from "../Search/SearchContext";
import useDebounce from "../../hooks/useDebounce";

const SearchInput = styled("input")(({ theme }) => ({
  borderColor: "transparent",
  padding: `0 ${theme.spacing(1)}`,
  fontSize: theme.spacing(3),
  color: theme.palette.grey[700],
  width: "100%",
  "&:focus": {
    outline: "none",
  },
  "&::placeholder": {
    color: theme.palette.grey[400],
  },
}));

function GlobalSearchInput({ setValue }) {
  const [inputValue, setInputValue] = useState("");
  const { searchPlaceholder } = useContext(SearchContext);

  const debouncedInputValue = useDebounce(inputValue, 300);

  useEffect(() => {
    setValue(debouncedInputValue);
  }, [debouncedInputValue]);

  return (
    <SearchInput
      placeholder={searchPlaceholder}
      autoFocus
      value={inputValue}
      type="text"
      onChange={(e) => setInputValue(e.currentTarget.value)}
      onFocus={(e) => {
        e.currentTarget.select();
      }}
    />
  );
}
export default memo(GlobalSearchInput);
