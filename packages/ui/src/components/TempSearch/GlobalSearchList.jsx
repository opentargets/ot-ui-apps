import { useContext, useEffect, useState, memo, useCallback } from "react";
import { Box, styled } from "@mui/material";
import { useLazyQuery } from "@apollo/client";
import GlobalSearchListHeader from "./GlobalSearchListHeader";
import GlobalSearchListItem from "./GlobalSearchListItem";
import { SearchContext } from "../Search/SearchContext";
import { formatSearchData } from "./utils/searchUtils";
import useListOption from "../../hooks/useListOption";
import GlobalSearchLoadingState from "./GlobalSearchLoadingState";

const List = styled("ul")({
  margin: "0",
  padding: "0",
});

function GlobalSearchList({ inputValue }) {
  const [searchResult, setSearchResult] = useState({});
  const [loading, setLoading] = useState(false);
  const { searchQuery, setOpen } = useContext(SearchContext);
  const [getSearchData] = useLazyQuery(searchQuery);
  const [openListItem] = useListOption();
  const [recentItems, setRecentItems] = useState(
    JSON.parse(localStorage.getItem("search-history")) || { recent: [] }
  );

  function fetchSearchResults() {
    setLoading(true);
    getSearchData({ variables: { queryString: inputValue } }).then((res) => {
      const formattedData = formatSearchData(res.data.search || res.data);
      setSearchResult({ ...formattedData });
      setLoading(false);
    });
  }

  console.log('list rerender ')

  function isResultEmpty() {
    return Object.keys(searchResult).length === 0;
  }

  const handleItemClick = useCallback((item) => {
    setOpen(false);
    openListItem(item);
  }, []);

  useEffect(() => {
    if (inputValue) fetchSearchResults();
    else setSearchResult({});
  }, [inputValue]);

  return (
    <>
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
                <GlobalSearchListItem
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
              <GlobalSearchListItem
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
