import { useState, useEffect, useContext, SyntheticEvent } from "react";
import { Autocomplete } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { v1 } from "uuid";
import SearchInput from "./Search/SearchInput";
import useSearchQueryData from "../hooks/useSearchQueryData";
import SearchListItem, { SearchResult } from "./Search/SearchListItem";
import SearchListHeader from "./Search/SearchListHeader";
import useListOption from "../hooks/useListOption";
import { SearchContext } from "./Search/SearchContext";
import SearchLoadingState from "./Search/SearchLoadingState";
import { containsObject } from "./Search/utils/searchUtils";

const useStyles = makeStyles((theme) => ({
  popper: {
    height: "94% !important",
    minHeight: "94% !important",
    overflowY: "auto",
  },
  paper: {
    height: "max-content !important",
    boxShadow:
      "-19px 0px 22px -16px rgba(0,0,0,0.1), 22px 0px 22px -16px rgba(0,0,0,0.1) !important",
  },
  listbox: {
    maxHeight: "100% !important",
  },
  option: {
    margin: "0 1rem",
    padding: "11px",
    border: "0.3px solid transparent",
    borderBottomWidth: "0.3px",
    borderStyle: "solid",
    borderImage: "linear-gradient(to right, white, #00000017, white)0 0 90",
    "&.Mui-focused": {
      border: `0.3px solid ${theme.palette.primary.main}`,
      borderRadius: "4px",
      background: "#3489ca29",
    },
  },
}));

export default function AutocompleteSearch({
  closeModal = () => undefined,
  isHomePage,
  showSearchResultPage,
}: {
  closeModal?: () => void;
  isHomePage?: boolean;
  showSearchResultPage?: boolean;
}) {
  const [searchResult, setSearchResult] = useState<any[]>(
    JSON.parse(localStorage.getItem("search-history") || "[]") || []
  );
  const [openListItem] = useListOption();
  const [recentItems, setRecentValue] = useState(
    JSON.parse(localStorage.getItem("search-history") || "[]") || []
  );
  const [open, setOpen] = useState(isHomePage ? false : true);

  const classes = useStyles();

  const { searchQuery, setLoading, inputValue, setInputValue, loading } =
    useContext(SearchContext);

  const [getSearchData, { data, loading: searchQueryLoading }] =
    useSearchQueryData(searchQuery);

  const handleKeyPress = (event: KeyboardEvent): void => {
    // open on cmd + k
    if (event.metaKey === true && event.code === "KeyK") {
      event.stopPropagation();
      event.preventDefault();
      setOpen(true);
    }
  };

  useEffect(() => {
    setLoading(searchQueryLoading);
    if (searchQueryLoading) setSearchResult([]);
  }, [searchQueryLoading]);

  useEffect(() => {
    let searchForTermObject;
    // setSearchResult(recentItems);
    setLoading(searchQueryLoading);
    if (inputValue && showSearchResultPage) {
      searchForTermObject = {
        symbol: "Search For: " + inputValue,
        name: inputValue,
        entity: "search",
        type: "",
      };
      setSearchResult([
        searchForTermObject,
        ...JSON.parse(localStorage.getItem("search-history") || "[]"),
      ]);
    }
    if (!loading && inputValue && data.length) {
      const RESULT_DATA = JSON.parse(JSON.stringify(data));
      showSearchResultPage && RESULT_DATA.unshift(searchForTermObject);
      setSearchResult(RESULT_DATA);
      setLoading(false);
    }
  }, [data, inputValue]);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyPress);
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  useEffect(() => {
    console.log({
      props: { isHomePage, showSearchResultPage },
      state: { searchResult, recentItems, open },
      context: { searchQuery, inputValue, loading, searchQueryLoading },
    });
  });

  const searchQueryInput = (param: string) => {
    if (!param) {
      setSearchResult(recentItems);
    } else {
      setOpen(true);
      setInputValue(param);
      getSearchData(param);
    }
  };

  const onClose = () => {
    setLoading(false);
    setInputValue("");
    setOpen(false);
    closeModal();
  };

  const handleSelectOption = (
    event: SyntheticEvent<object>,
    option: string | SearchResult | null
  ) => {
    if (typeof option === "object") {
      onClose();
      openListItem(option);
    }
  };

  const clearItem = (item: SearchResult) => {
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

  console.log("fiop3ne4io");

  return (
    <Autocomplete
      classes={{
        popper: classes.popper,
        listbox: classes.listbox,
        option: classes.option,
        paper: classes.paper,
      }}
      disablePortal
      openOnFocus
      autoHighlight
      clearOnEscape
      freeSolo
      options={searchResult}
      onChange={handleSelectOption}
      groupBy={(option) => option.type}
      loading={searchQueryLoading}
      loadingText={<SearchLoadingState />}
      renderGroup={(group) => (
        <SearchListHeader
          key={v1()}
          listHeader={group.group}
          clearAll={clearAll}
        >
          {group.children}
        </SearchListHeader>
      )}
      getOptionLabel={(option) => option.symbol || option.name || option.id}
      renderOption={(props, option) => (
        <li key={v1()} {...props}>
          <SearchListItem
            item={option}
            isTopHit={option.type === "topHit"}
            clearItem={clearItem}
          />
        </li>
      )}
      isOptionEqualToValue={(option, value) => option.name === value.name}
      filterOptions={() => searchResult}
      renderInput={(params) => (
        <SearchInput
          params={params}
          debounceValue={searchQueryInput}
          onClose={onClose}
          isHomePage={isHomePage}
          focus={open}
          setOpen={setOpen}
        />
      )}
    />
  );
}
