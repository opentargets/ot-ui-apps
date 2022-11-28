import { useState, useEffect } from "react";
import Autocomplete from "@material-ui/lab/Autocomplete";
import SearchInput from "./Search/SearchInput";
import useSearchQueryData from "./hooks/useSearchQueryData";
import SearchListItem from "./Search/SearchListItem";
import SearchListHeader from "./Search/SearchListHeader";
import { useHistory } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@material-ui/core/styles';

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
        maxHeight: "80vh !important",
        boxShadow: "none",
      },
      listbox: {
        maxHeight: "80vh !important"
      },
      option: {
        margin: "0 1rem",
        padding: "11px",
        border: "0.3px solid transparent",
        "&[data-focus='true']": {
          border: "0.3px solid #3489ca",
          borderRadius: "4px",
          background: "#3489ca29",
        }
      }
    },
  },
  palette: {
    primary: {
      main: '#3489ca',

    },
  },
});

export default function AutocompleteSearch({ searchQuery }) {
  const [open, setOpen] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchResult, setSearchResult] = useState([]);
  const [inputValue, setInputValue] = useState("");
  let history = useHistory();

  const [getSearchData, { data, loading }] = useSearchQueryData(searchQuery);

  const searchQueryInput = (param) => {
    if (!param) {
      setOpen(false);
    } else {
      setOpen(true);
    }
    setInputValue(param);
    getSearchData(param);
    // if (!param.target.value) {
    //   setOpen(false);
    // } else {
    //   setOpen(true);
    // }
    // setInputValue(param.target.value);
    // getSearchData(param.target.value);
  };

  useEffect(() => {
    setSearchResult([...data]);
    setSearchLoading(loading);
  }, [data]);

  const onClose = (param) => {
    console.log(`close`);
  };

  const setLocalStorageItems = (item) => {
    const recentItems = JSON.parse(localStorage.getItem('search-history')) || [];
    item && recentItems.unshift(item)
    item && localStorage.setItem("search-history", JSON.stringify(recentItems));
  };

  const handleSelectOption = (e, option) => {
    setLocalStorageItems(option)

    if (!option) return;

    if (option.entity === 'study') {
      history.push(`/${option.entity}/${option.studyId}`);
    }  else {
      history.push(
        `/${option.entity}/${option.id}${
          option.entity !== 'drug' ? '/associations' : ''
        }`
      );
    }
    
  };

  return (
    <>
      {/* {searchResult && } */}
      <ThemeProvider theme={theme}>
      <Autocomplete
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
        renderOption={(option) => <SearchListItem item={option} isTopHit={option.type === 'topHit'} loading={searchLoading}/>}
        getOptionSelected={(option, value) => option.name === value}
        filterOptions={(o, s) => searchResult}
        renderInput={(params) => (
          <SearchInput
            params={params}
            searchQueryInput={searchQueryInput}
            onClose={onClose}
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
