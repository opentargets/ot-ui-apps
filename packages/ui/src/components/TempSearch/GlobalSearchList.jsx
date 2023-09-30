import { useContext, useEffect, useState, memo, useCallback } from "react";
import { Box, styled } from "@mui/material";
import { useLazyQuery } from "@apollo/client";
import GlobalSearchListHeader from "./GlobalSearchListHeader";
import GlobalSearchListItem from "./GlobalSearchListItem";
import { SearchContext } from "../Search/SearchContext";
import { formatSearchData } from "./utils/searchUtils";
import useDebounce from "../../hooks/useDebounce";
import useListOption from "../../hooks/useListOption";
import { InputValueContext } from "./Context/GlobalSearchSelectContext";
import GlobalSearchLoadingState from "./GlobalSearchLoadingState";

const List = styled("ul")({
  margin: "0",
  padding: "0",
});

const MemoizedListItem = memo(GlobalSearchListItem);

function GlobalSearchList() {
  const [searchResult, setSearchResult] = useState({});
  const [loading, setLoading] = useState(false);
  const [inputValue] = useContext(InputValueContext);
  const { searchQuery, setOpen } = useContext(SearchContext);
  const [getSearchData] = useLazyQuery(searchQuery);
  const debouncedInputValue = useDebounce(inputValue, 500);
  const [openListItem] = useListOption();
  const [recentItems, setRecentItems] = useState(
    JSON.parse(localStorage.getItem("search-history")) || { recent: [] }
  );
  const freeSearchTermObject = {
    symbol: `Search for: ${inputValue}`,
    name: inputValue,
    entity: "search",
    type: "",
  };

  console.log("list rerender");

  function fetchSearchResults() {
    setLoading(true);
    getSearchData({ variables: { queryString: debouncedInputValue } }).then(
      (res) => {
        const formattedData = formatSearchData(res.data.search || res.data);
        setSearchResult({ ...formattedData });
        setLoading(false);
      }
    );
  }

  function isResultEmpty() {
    return Object.keys(searchResult).length === 0;
  }

  const handleItemClick = useCallback((item) => {
    setOpen(false);
    openListItem(item);
  }, []);

  useEffect(() => {
    if (debouncedInputValue) fetchSearchResults();
  }, [debouncedInputValue]);

  return (
    <>
      {/* show free search list item if there is an input value */}
      {inputValue && (
        <Box
          sx={{
            borderBottomWidth: "1px",
            borderStyle: "solid",
            borderImage:
              "linear-gradient(to right, white, #00000037, white)0 0 90",
          }}
        >
          <GlobalSearchListItem
            item={freeSearchTermObject}
            onItemClick={handleItemClick}
          />
        </Box>
      )}

      {inputValue && loading && <GlobalSearchLoadingState />}

      {/* input value is present and there are results available */}
      {inputValue &&
        !loading &&
        !isResultEmpty() &&
        Object.entries(searchResult).map(([key, value]) => (
          <Box
            key={key}
            sx={{
              pt: 1,
              borderBottomWidth: "1px",
              borderStyle: "solid",
              borderImage:
                "linear-gradient(to right, white, #00000037, white)0 0 90",
            }}
          >
            <GlobalSearchListHeader listHeader={key} />
            <List tabIndex={-1}>
              {value.map((item) => (
                <MemoizedListItem
                  key={item.id || item.symbol}
                  item={item}
                  onItemClick={handleItemClick}
                  isTopHit={item.type === "topHit"}
                />
              ))}
            </List>
          </Box>
        ))}

      {/* no search result state  */}
      {inputValue && !loading && isResultEmpty() && (
        <Box>no search result place</Box>
      )}

      {/* input value is not present */}
      {!inputValue && recentItems.recent.length > 0 && (
        <Box sx={{ pt: 1 }}>
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
    </>
  );
}

export default memo(GlobalSearchList);
