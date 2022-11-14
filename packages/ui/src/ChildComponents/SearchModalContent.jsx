import { useEffect, useState, forwardRef, useImperativeHandle } from "react";
import { useLazyQuery } from "@apollo/client";
import {
  makeStyles,
  Dialog,
  DialogContent,
  DialogTitle,
} from "@material-ui/core";

import useDebounce from "../hooks/useDebounce";

import SearchInput from "./SearchInput";
import LoadingBackdrop from "../LoadingBackdrop";
import { formatSearchData } from "../utils/SearchUtil";
import SearchListItem from "./SearchListItem";

const useStyles = makeStyles((theme) => ({
  modal: {
    "& .MuiDialog-scrollPaper": {
      justifyContent: "end",
      alignItems: "start",
      "& .MuiDialog-paperWidthSm": {
        width: "40vw",
        maxWidth: "700px",
        margin: " 0.5rem 0.968rem",
        borderRadius: "12px",
      },
    },
  },
}));

const SearchModalContent = forwardRef(({ searchQuery }, ref) => {
  const classes = useStyles();

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
    console.log(`👻 ~ file: SearchModalContent.jsx ~ line 58 ~ searchQueryInput ~ searchInput`, searchInput);
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

  useEffect(() => {
    if (!open) {
      setSearchResults([]);
    }
  }, [open]);

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        scroll={"paper"}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
        className={classes.modal}
      >
        <DialogTitle id="scroll-dialog-title">
          <SearchInput
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
