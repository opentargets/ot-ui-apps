import { useState, useEffect, useContext, SyntheticEvent } from "react";
import { Autocomplete } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { v1 } from "uuid";
import { useLazyQuery } from "@apollo/client";
import SearchInput from "./Search/SearchInput";
import SearchListItem, { SearchResult } from "./Search/SearchListItem";
import SearchListHeader from "./Search/SearchListHeader";
import useListOption from "../hooks/useListOption";
import { SearchContext } from "./Search/SearchContext";
import SearchLoadingState from "./Search/SearchLoadingState";
import { containsObject, formatSearchData } from "./Search/utils/searchUtils";
import useDebounce from "../hooks/useDebounce";

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
  const [searchResult, setSearchResult] = useState<any[]>([]);
  const [openListItem] = useListOption();
  const [recentItems, setRecentValue] = useState(
    JSON.parse(localStorage.getItem("search-history") || "[]") || []
  );
  const [open, setOpen] = useState(isHomePage ? false : true);
  const [searchInputValue, setSearchInputValue] = useState("");
  const [loading, setLoading] = useState(false);

  const classes = useStyles();

  const { searchQuery } = useContext(SearchContext);
  const debouncedInputValue = useDebounce(searchInputValue, 500);

  const [getSearchData] = useLazyQuery(searchQuery);

  const handleKeyPress = (event: KeyboardEvent): void => {
    // open on cmd + k
    if (event.metaKey === true && event.code === "KeyK") {
      event.stopPropagation();
      event.preventDefault();
      setOpen(true);
    }
  };

  console.log("inside autocomplete");

  useEffect(() => {
    document.addEventListener("keydown", handleKeyPress);
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  useEffect(() => {
    searchQueryInput(debouncedInputValue);
  }, [debouncedInputValue]);

  useEffect(() => {
    let searchForTermObject;
    setSearchResult(recentItems);
    if (searchInputValue && showSearchResultPage) {
      searchForTermObject = {
        symbol: "Search For: " + searchInputValue,
        name: searchInputValue,
        entity: "search",
        type: "",
      };
      setSearchResult([searchForTermObject, ...recentItems]);
    }
  }, [searchInputValue, recentItems]);

  const searchQueryInput = (param: string) => {
    if (!param) {
      setSearchResult(recentItems);
    } else {
      setOpen(true);
      fetchSearchResults(param);
    }
  };

  const fetchSearchResults = (value: string) => {
    getSearchData({ variables: { queryString: value } }).then((res) => {
      const formattedData = formatSearchData(res.data.search || res.data);
      let searchForTermObject;
      if (showSearchResultPage) {
        searchForTermObject = {
          symbol: "Search For: " + searchInputValue,
          name: searchInputValue,
          entity: "search",
          type: "",
        };
        setSearchResult([searchForTermObject, ...formattedData]);
      } else setSearchResult(formattedData);
    });
  };

  const onClose = () => {
    setSearchInputValue("");
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
      inputValue={searchInputValue}
      onInputChange={(e, v) => setSearchInputValue(v)}
      groupBy={(option) => option.type}
      loading={loading}
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
        <li {...props}>
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
          onClose={onClose}
          isHomePage={isHomePage}
          focus={open}
          setOpen={setOpen}
        />
      )}
    />
  );
}
