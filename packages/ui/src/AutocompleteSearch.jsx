import { useState, useEffect, useContext } from "react";
import Autocomplete from "@material-ui/lab/Autocomplete";
import SearchInput from "./Search/SearchInput";
import useSearchQueryData from "./hooks/useSearchQueryData";
import SearchListItem from "./Search/SearchListItem";
import SearchListHeader from "./Search/SearchListHeader";
import { createTheme, ThemeProvider } from "@material-ui/core/styles";
import useListOption from "./hooks/useListOption";
import { SearchContext } from "./Search/SearchContext";
import SearchLoadingState from "./Search/SearchLoadingState";
import { containsObject } from "./utils/searchUtils";

const theme = createTheme({
  overrides: {
    MuiAutocomplete: {
      popper: {
        borderRadius: "0 0 12px 12px !important",
      },
      paper: {
        height: "inherit !important",
        boxShadow: "2px 0 4px -4px #999, -2px 0 4px -4px #999"
      },
      listbox: {
        maxHeight: "47vh !important",
      },
      option: {
        margin: "0 1rem",
        padding: "11px",
        border: "0.3px solid transparent",
        borderBottomWidth: "0.3px",
        borderStyle: "solid",
        borderImage: "linear-gradient(to right, white, #00000063, white)0 0 90",
        "&[data-focus='true']": {
          border: "0.3px solid #3489ca",
          borderRadius: "4px",
          background: "#3489ca29",
        },
      },
    },
  },
  palette: {
    primary: {
      main: "#3489ca",
    },
    text: {
      primary: "#5A5F5F",
    },
  },
});

export default function AutocompleteSearch({
  closeModal = () => {},
  isHomePage,
}) {
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchResult, setSearchResult] = useState([]);
  const [openListItem] = useListOption();
  const [recentItems, setRecentValue] = useState(
    JSON.parse(localStorage.getItem("search-history")) || []
  );

  const {
    searchQuery,
    isQueryLoading,
    inputValueUpdate,
    setLoading,
    inputValue,
    setInputValue,
  } = useContext(SearchContext);

  const [getSearchData, { data, loading }] = useSearchQueryData(searchQuery);

  useEffect(() => {
    data.length > 0 && inputValue
      ? (data.unshift({
          symbol: "Search For: "+inputValue,
          name: inputValue,
          entity: "search",
          type: "",
        }),
        setSearchResult(data))
      : setSearchResult(recentItems);
    setSearchLoading(loading);
    isQueryLoading(loading);
    if (loading) {
      setSearchResult([]);
    }
  }, [data, loading, recentItems]);

  const searchQueryInput = (param) => {
    if (!param) {
      setSearchResult(recentItems);
    } else {
      setInputValue(param);
      getSearchData(param);
    }
  };

  const changeInputValue = (param) => {
    if (!param) {
      setSearchResult(recentItems);
    }
    setInputValue(param);
    inputValueUpdate(param);
  };

  const onClose = () => {
    setLoading(false);
    setInputValue("");
    closeModal();
  };

  const handleSelectOption = (e, option) => {
    if (typeof option === "object") {
      onClose();
      openListItem(option);
    }
  };

  const clearItem = (item) => {
    const removedItems = [...recentItems];
    const existingIndex = containsObject(item, removedItems);
    removedItems.splice(existingIndex, 1);
    setRecentValue(removedItems);
    localStorage.setItem("search-history", JSON.stringify(removedItems));
  };

  return (
    <>
      {/* {searchResult && } */}
      <ThemeProvider theme={theme}>
        {searchLoading}
        <Autocomplete
          disablePortal
          openOnFocus
          autoHighlight
          clearOnEscape
          freeSolo
          options={searchResult}
          onChange={handleSelectOption}
          groupBy={(option) => option.type}
          loading={searchLoading}
          loadingText={<SearchLoadingState />}
          renderGroup={(group) => (
            <SearchListHeader
              key={group.key}
              listHeader={group.group}
              children={group.children}
            />
          )}
          getOptionLabel={(option) => option.symbol || option.name || option.id}
          renderOption={(option) => (
            <SearchListItem
              item={option}
              isTopHit={option.type === "topHit"}
              loading={searchLoading}
              clearItem={clearItem}
            />
          )}
          getOptionSelected={(option, value) => option.name === value}
          filterOptions={(o, s) => searchResult}
          renderInput={(params) => (
            <SearchInput
              params={params}
              debounceValue={searchQueryInput}
              onClose={onClose}
              changeInputValue={changeInputValue}
              isHomePage={isHomePage}
            />
          )}
        />
      </ThemeProvider>
    </>
  );
}
