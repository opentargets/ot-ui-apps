import { useState, useEffect } from "react";
import Autocomplete from "@material-ui/lab/Autocomplete";
import SearchInput from "./ChildComponents/SearchInput";
import useSearchQueryData from "./hooks/useSearchQueryData";
import SearchListItem from "./ChildComponents/SearchListItem";
import SearchListHeader from "./ChildComponents/SearchListHeader";
import { useHistory } from 'react-router-dom';

import {
  makeStyles,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    "MuiAutocomplete-popper": {
      background: "red",
    },
}));

export default function UseAutocomplete({ searchQuery }) {
  const [open, setOpen] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchResult, setSearchResult] = useState([]);
  const [inputValue, setInputValue] = useState("");
  let history = useHistory();
  const classes = useStyles();

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
    console.log(searchResult);
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
        renderOption={(option) => <SearchListItem item={option} isTopHit={option.type === 'topHit'}/>}
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
    </>
  );
}
