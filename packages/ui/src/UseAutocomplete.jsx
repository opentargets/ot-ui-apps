import { useState, useEffect } from "react";
import Autocomplete from "@material-ui/lab/Autocomplete";
import SearchInput from "./ChildComponents/SearchInput";
import useSearchQueryData from "./hooks/useSearchQueryData";
import SearchListItem from "./ChildComponents/SearchListItem";
import SearchListHeader from "./ChildComponents/SearchListHeader";

export default function UseAutocomplete({ searchQuery }) {
  const [open, setOpen] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchResult, setSearchResult] = useState([]);
  const [inputValue, setInputValue] = useState("");

  const [getSearchData, { data, loading }] = useSearchQueryData(searchQuery);

  const searchQueryInput = (param) => {
    // if (!param) {
    //   setOpen(false);
    // } else {
    //   setOpen(true);
    // }
    // setInputValue(param);
    // getSearchData(param);
    if (!param.target.value) {
      setOpen(false);
    } else {
      setOpen(true);
    }
    setInputValue(param.target.value);
    getSearchData(param.target.value);
  };

  useEffect(() => {
    setSearchResult([...data]);
    setSearchLoading(loading);
  }, [data]);

  const onClose = (param) => {
    console.log(`close`);
  };

  return (
    <>
      {/* {searchResult && } */}
      <Autocomplete
        id="grouped-demo"
        options={searchResult}
        groupBy={(option) => option.entity}
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
        getOptionLabel={(option) => option.id || ""}
        renderOption={(option) => <SearchListItem item={option} />}
        getOptionSelected={(option, value) => option.id === value}
        filterOptions={(o, s) => searchResult}
        // renderInput={(params) => (
        //   <SearchInput
        //     params={params}
        //     searchQueryInput={searchQueryInput}
        //     onClose={onClose}
        //   />
        // )}
        renderInput={(params) => (
          <div ref={params.InputProps.ref}>
            <input style={{ width: 600 }} type="text" {...params.inputProps} onChange={searchQueryInput} value={inputValue}/>
          </div>
        )}
      />
    </>
  );
}
