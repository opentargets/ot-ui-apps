import { useState, useEffect, useContext } from "react";
import Autocomplete from "@material-ui/lab/Autocomplete";
import SearchInput from "./Search/SearchInput";
import useSearchQueryData from "./hooks/useSearchQueryData";
import SearchListItem from "./Search/SearchListItem";
import SearchListHeader from "./Search/SearchListHeader";
import { createTheme, ThemeProvider } from "@material-ui/core/styles";
import useListOption from "./hooks/useListOption";
import { SearchContext } from "./Search/SearchContext";

const theme = createTheme({
  overrides: {
    MuiAutocomplete: {
      popper: {
        borderRadius: "0 0 12px 12px !important",
        // width: "79vw !important",
        // maxWidth: "680px !important",
        // maxHeight: "80vh !important",
        // left: "1% !important",
      },
      paper: {
        height: "inherit !important",
        // maxHeight: "80vh !important",
        boxShadow: "none",
      },
      listbox: {
        maxHeight: "40% !important",
      },
      option: {
        margin: "0 1rem",
        padding: "11px",
        border: "0.3px solid transparent",
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
  },
});

export default function AutocompleteSearch({
  closeModal = () => {},
  isHomePage,
}) {
  const [open, setOpen] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchResult, setSearchResult] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [openListItem] = useListOption();

  const { searchQuery, isQueryLoading, inputValueUpdate } =
    useContext(SearchContext);

  const [getSearchData, { data, loading }] = useSearchQueryData(searchQuery);

  useEffect(() => {
    setSearchResult([...data]);
    setSearchLoading(loading);
    isQueryLoading(loading);
    if (loading) {
      setOpen(false);
      setSearchResult([]);
    } else setOpen(true);
  }, [data, loading]);

  const searchQueryInput = (param) => {
    if (!param) {
      setOpen(false);
    } else {
      setOpen(true);
      setInputValue(param);
      getSearchData(param);
    }
  };

  const changeInputValue = (param) => {
    inputValueUpdate(param);
  };

  const onClose = (param) => {
    closeModal();
  };

  const handleSelectOption = (e, option) => {
    closeModal();
    openListItem(option);
  };

  return (
    <>
      {/* {searchResult && } */}
      <ThemeProvider theme={theme}>
        <Autocomplete
          disablePortal
          freeSolo
          options={searchResult}
          onChange={handleSelectOption}
          groupBy={(option) => option.type}
          onOpen={() => {
            if (inputValue) setOpen(true);
          }}
          onClose={() => {
            setOpen(false);
          }}
          renderGroup={(group) => (
            <SearchListHeader
              key={group.key}
              listHeader={group.group}
              children={group.children}
            />
          )}
          open={open}
          getOptionLabel={(option) => option.symbol || option.name || option.id}
          renderOption={(option) => (
            <SearchListItem
              item={option}
              isTopHit={option.type === "topHit"}
              loading={searchLoading}
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
          // renderInput={(params) => (
          //   <div ref={params.InputProps.ref}>
          //     <input style={{ width: 500 }} type="text" {...params.inputProps} onChange={searchQueryInput} value={inputValue}/>
          //   </div>
          // )}
        />
      </ThemeProvider>
    </>
  );
}
