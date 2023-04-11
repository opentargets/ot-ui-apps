import { useState, useEffect, useContext, useMemo, useCallback } from "react";
import Autocomplete from "@material-ui/lab/Autocomplete";
import SearchInput from "./Search/SearchInput";
import useSearchQueryData from "./hooks/useSearchQueryData";
import SearchListItem, { SearchResult } from "./Search/SearchListItem";
import SearchListHeader from "./Search/SearchListHeader";
import { createTheme, ThemeProvider } from "@material-ui/core/styles";
import useListOption from "./hooks/useListOption";
import { SearchContext } from "./Search/SearchContext";
import SearchLoadingState from "./Search/SearchLoadingState";
import { containsObject } from "./utils/searchUtils";

const getTheme = (primaryColor: string) =>
  createTheme({
    overrides: {
      // @ts-ignore
      MuiAutocomplete: {
        popper: {
          borderRadius: "0 0 12px 12px !important",
        },
        paper: {
          height: "inherit !important",
          boxShadow: "2px 0 4px -4px #999, -2px 0 4px -4px #999",
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
          borderImage:
            "linear-gradient(to right, white, #00000063, white)0 0 90",
          "&[data-focus='true']": {
            border: `0.3px solid ${primaryColor}`,
            borderRadius: "4px",
            background: "#3489ca29",
          },
        },
      },
    },
    palette: {
      primary: {
        main: primaryColor,
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
  const [searchResult, setSearchResult] = useState<SearchResult[]>([]);
  const [openListItem] = useListOption();
  const [recentItems, setRecentValue] = useState(
    JSON.parse(localStorage.getItem("search-history") || "[]") || []
  );
  const [open, setOpen] = useState(isHomePage ? false : true);

  const {
    searchQuery,
    isQueryLoading,
    inputValueUpdate,
    setLoading,
    inputValue,
    setInputValue,
    primaryColor,
  } = useContext(SearchContext);

  const theme = useMemo(() => getTheme(primaryColor), [primaryColor]);

  const [getSearchData, { data, loading }] = useSearchQueryData(searchQuery);

  const handleKeyPress = useCallback((event) => {
    // open on cmd + k
    if (event.metaKey === true && event.keyCode === 75) {
      event.stopPropagation();
      event.preventDefault();
      setOpen(true);
      return false;
    }
    // close on esc
    if (event.keyCode === 27) {
      event.stopPropagation();
      setOpen(false);
      event.preventDefault();
      inputValueUpdate("");
      // return false;
    }
  }, []);

  useEffect(() => {
    if (inputValue) {
      const RESULT_DATA = JSON.parse(JSON.stringify(data));
      RESULT_DATA.unshift({
        symbol: "Search For: " + inputValue,
        name: inputValue,
        entity: "search",
        type: "",
      });
      setSearchResult(RESULT_DATA);
    } else {
      setSearchResult(recentItems);
    }
    setSearchLoading(loading);
    isQueryLoading(loading);
    if (loading) {
      setSearchResult([]);
    }
  }, [data, loading, recentItems, inputValue]);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyPress);
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [handleKeyPress]);

  const searchQueryInput = (param) => {
    if (!param) {
      setSearchResult(recentItems);
    } else {
      setOpen(true);
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

  const clearAll = () => {
    setRecentValue([]);
    localStorage.removeItem("search-history");
  };

  return (
    <ThemeProvider theme={theme}>
      <Autocomplete
        open={open}
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
            clearAll={clearAll}
          />
        )}
        getOptionLabel={(option) => option.symbol || option.name || option.id}
        renderOption={(option) => (
          <SearchListItem
            item={option}
            isTopHit={option.type === "topHit"}
            clearItem={clearItem}
          />
        )}
        // @ts-ignore
        getOptionSelected={(option, value) => option.name === value}
        filterOptions={(o, s) => searchResult}
        renderInput={(params) => (
          <SearchInput
            params={params}
            debounceValue={searchQueryInput}
            onClose={onClose}
            changeInputValue={changeInputValue}
            isHomePage={isHomePage}
            focus={open}
          />
        )}
      />
    </ThemeProvider>
  );
}
