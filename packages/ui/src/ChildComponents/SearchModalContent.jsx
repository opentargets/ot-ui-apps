import { useEffect, useState, forwardRef, useImperativeHandle } from "react";
import { useLazyQuery } from "@apollo/client";
import {
  makeStyles,
  Dialog,
  DialogContent,
  DialogTitle,
} from "@material-ui/core";

import useDebounce from "../hooks/useDebounce";

import GlobalSearchModalInput from "./GlobalSearchModalInput";
import LoadingBackdrop from "../LoadingBackdrop";
import { formatSearchData } from "../utils/SearchUtil";
import SearchListItem from "./SearchListItem";

const SearchModalContent = forwardRef(({ searchQuery }, ref) => {
  const [open, setOpen] = useState(false);
  const [searchResults, setSearchResults] = useState(null);
  const [inputValue, setInputValue] = useState(null);

  const debouncedInputValue = useDebounce(inputValue, 300);

  useImperativeHandle(ref, () => ({
    handleOpen() {
      setOpen(true);
    },
  }));

  const handleClose = () => setOpen(false);

  const [getData, { loading, data: searchResultData }] = useLazyQuery(
    searchQuery,
    {
      variables: { queryString: debouncedInputValue },
      onCompleted: () => {},
    }
  );

  const searchQueryInput = (searchInput) => {
    if (!searchInput) {
      // TODO: display recent and suggested
    }
    setInputValue(searchInput);
  };

  useEffect(() => {
    debouncedInputValue &&
      getData({ variables: { queryString: debouncedInputValue } });
  }, [debouncedInputValue]);

  useEffect(() => {
    if (searchResultData) {
      searchResultData.search
        ? setSearchResults(formatSearchData(searchResultData.search))
        : setSearchResults(formatSearchData(searchResultData));
    }
  }, [searchResultData, loading]);


  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        scroll={"paper"}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
        <DialogTitle id="scroll-dialog-title">
          <GlobalSearchModalInput
            searchQueryInput={searchQueryInput}
            onClose={handleClose}
          />
        </DialogTitle>
        <DialogContent dividers>
          {loading && <LoadingBackdrop />}

          {searchResults &&
            searchResults.map((section, index) => (
              <SearchListItem key={index} allListItems={section} />
            ))}

          {/* <div className="no-result-found-container">no result found</div> */}
        </DialogContent>
      </Dialog>
    </>
  );
});

export default SearchModalContent;
