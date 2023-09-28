import { useContext, useEffect, useState, memo, useCallback } from "react";
import { Box, styled } from "@mui/material";
import { useLazyQuery } from "@apollo/client";
import GlobalSearchListHeader from "./GlobalSearchListHeader";
import GlobalSearchListItem from "./GlobalSearchListItem";
import { SearchContext } from "../Search/SearchContext";
import { formatSearchData } from "./utils/searchUtils";
import useDebounce from "../../hooks/useDebounce";
import useListOption from "../../hooks/useListOption";

const List = styled("ul")({
  margin: "0",
  padding: "0",
});

const MemoizedListItem = memo(GlobalSearchListItem);

function FreeSearchItem({ label = "Search for: ", inputValue }) {
  const freeSearchTermObject = {
    symbol: label + inputValue,
    name: inputValue,
    entity: "search",
    type: "",
  };
  return <GlobalSearchListItem item={freeSearchTermObject} />;
}

function GlobalSearchList({ inputValue }) {
  const [searchResult, setSearchResult] = useState({});
  const { searchQuery, setOpen } = useContext(SearchContext);
  const [getSearchData] = useLazyQuery(searchQuery);
  const debouncedInputValue = useDebounce(inputValue, 500);
  const [recentItems, setRecentValue] = useState(
    JSON.parse(localStorage.getItem("search-history")) || { recent: [] }
  );
  const [openListItem] = useListOption();

  console.log("---list rerender");

  function fetchSearchResults(value) {
    getSearchData({ variables: { queryString: value } }).then((res) => {
      const formattedData = formatSearchData(res.data.search || res.data);
      // add free search object
      setSearchResult({ ...formattedData });
    });
  }

  function isResultEmpty() {
    if (
      Object.entries(searchResult).every(([key, value]) => value.length === 0)
    )
      return true;
    return false;
  }

  const handleItemClick = useCallback((item) => {
    setOpen(false);
    openListItem(item);
  }, []);

  useEffect(() => {
    if (debouncedInputValue.trim()) fetchSearchResults(debouncedInputValue);
    else {
      // add recentItems
    }
  }, [debouncedInputValue]);

  return (
    <>
      {/* input value is present and there are results available */}
      {inputValue &&
        (!isResultEmpty() ? (
          Object.entries(searchResult).map(([key, value], index) => (
            <Box key={key} sx={{ pt: 2 }}>
              <GlobalSearchListHeader listHeader={key} />
              <List tabIndex={-1}>
                {value.map((item) => (
                  <MemoizedListItem key={item.id || item.symbol} item={item} onItemClick={handleItemClick}/>
                ))}
              </List>
            </Box>
          ))
        ) : (
          <Box>no search result place</Box>
        ))}

      {/* input value is not present */}
      {!inputValue && recentItems.recent.length > 0 && (
        <Box sx={{ pt: 2 }}>
          <GlobalSearchListHeader listHeader="recent" />
          <List tabIndex={-1}>
            {recentItems.recent.map((item) => (
              <MemoizedListItem
                key={item.id || item.symbol}
                item={item}
                onItemClick={handleItemClick}
              />
            ))}
          </List>
        </Box>
      )}

      {/* input value is present and no results available */}
    </>
  );
}

export default GlobalSearchList;
