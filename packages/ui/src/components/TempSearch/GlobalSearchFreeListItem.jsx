import { useCallback, useContext } from "react";
import { Box, Typography, styled } from "@mui/material";

import { SearchContext, SearchInputContext } from "./SearchContext";
import ArrowTurnDownLeft from "../../components/icons/ArrowTurnDownLeft";
import useListOption from "../../hooks/useListOption";

const FreeSearchListItem = styled("li")(({ theme }) => ({
  cursor: "pointer",
  width: "100%",
  listStyle: "none",
  padding: `${theme.spacing(1.5)}`,
  borderRadius: theme.spacing(0.5),
  color: theme.palette.grey["900"],
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  wordBreak: "break-word",
  "&:hover": {
    background: theme.palette.grey["200"],
  },
}));

const SearchListItemText = styled("span")({
  maxWidth: "90%",
});

function GlobalSearchFreeListItem() {
  const { inputValue } = useContext(SearchInputContext);

  const { setOpen } = useContext(SearchContext);
  const [openListItem] = useListOption();

  const freeSearchTermObject = {
    symbol: `Search for: ${inputValue}`,
    name: inputValue,
    entity: "search",
    type: "",
  };

  const handleItemClick = useCallback((item) => {
    setOpen(false);
    openListItem(item);
  }, []);

  if (!inputValue) return null;
  return (
    <FreeSearchListItem
      className="search-list-item search-list-item-active"
      role="menuitem"
      tabIndex="0"
      onClick={() => handleItemClick(freeSearchTermObject)}
    >
      <SearchListItemText>
        <Typography variant="subtitle1">
          <Box sx={{ fontStyle: "oblique" }}>{freeSearchTermObject.symbol}</Box>
        </Typography>
      </SearchListItemText>
      <ArrowTurnDownLeft />
    </FreeSearchListItem>
  );
}
export default GlobalSearchFreeListItem;
