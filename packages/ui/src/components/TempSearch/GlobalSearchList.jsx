import { useContext, useEffect, useState } from "react";
import { Box, styled } from "@mui/material";
import { useLazyQuery } from "@apollo/client";
import GlobalSearchListHeader from "./GlobalSearchListHeader";
import GlobalSearchListItem from "./GlobalSearchListItem";
import { SearchContext } from "../Search/SearchContext";
import { formatSearchData } from "./utils/searchUtils";
import useDebounce from "../../hooks/useDebounce";

const List = styled("ul")({
  margin: "0",
  padding: "0",
});

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
  const { searchQuery } = useContext(SearchContext);
  const [getSearchData] = useLazyQuery(searchQuery);
  const debouncedInputValue = useDebounce(inputValue, 500);

  console.log("---list rerender");

  function fetchSearchResults(value) {
    getSearchData({ variables: { queryString: value } }).then((res) => {
      const formattedData = formatSearchData(res.data.search || res.data);
      // add free search object
      setSearchResult({ ...formattedData });
    });
  }

  useEffect(() => {
    if (debouncedInputValue.trim()) fetchSearchResults(debouncedInputValue);
    else {
      // add recentItems
    }
  }, [debouncedInputValue]);

  return (
    <>
      {Object.entries(searchResult).map(([key, value], index) => (
        <Box key={key + index} sx={{ pt: 2 }}>
          <GlobalSearchListHeader listHeader={key} />
          <List tabIndex={-1}>
            {value.map((item) => (
              <GlobalSearchListItem key={item.id || item.symbol} item={item} />
            ))}
          </List>
        </Box>
      ))}
    </>
  );
}

export default GlobalSearchList;
