import { useContext, memo } from "react";
import { styled } from "@mui/material";

import { SearchContext, SearchInputContext } from "./SearchContext";

const SearchInput = styled("input")(({ theme }) => ({
  borderColor: "transparent",
  padding: `0 ${theme.spacing(1)}`,
  fontSize: theme.spacing(2.5),
  color: theme.palette.grey[700],
  width: "100%",
  "&:focus": {
    outline: "none",
  },
  "&::placeholder": {
    color: theme.palette.grey[400],
  },
}));

function GlobalSearchInput() {
  const { searchPlaceholder } = useContext(SearchContext);
  const { inputValue, setInputValue } = useContext(SearchInputContext);

  return (
    <SearchInput
      placeholder={searchPlaceholder}
      autoFocus
      value={inputValue}
      type="text"
      onChange={e => setInputValue(e.currentTarget.value)}
      onFocus={e => {
        e.currentTarget.select();
      }}
    />
  );
}
export default memo(GlobalSearchInput);
