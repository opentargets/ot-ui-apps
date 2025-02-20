import { useContext, useEffect, useState, memo, useCallback } from "react";
import { Box, styled } from "@mui/material";
import { useLazyQuery } from "@apollo/client";
import GlobalSearchListHeader from "./GlobalSearchListHeader";
import GlobalSearchListItem from "./GlobalSearchListItem";
import { SearchContext } from "./SearchContext";
import { formatSearchData } from "./utils/searchUtils";
import useListOption from "../../hooks/useListOption";
import GlobalSearchLoadingState from "./GlobalSearchLoadingState";
import VariantMessage from "./VariantMessage";

const VARIANT_COMPONENTS = {
  CHROMOSOME: "(?:chr)?(?:[1-9]|1[0-9]|2[0-2]|X|Y|MT)",
  FIRST_SEPARATOR: "[_:]",
  POSITION: "\\d+",
  SECOND_SEPARATOR: "[_:]",
  REF_ALLELE: "[A-Za-z]+",
  THIRD_SEPARATOR: "[_-]",
  ALT_ALLELE: "[A-Za-z]+",
};

const VARIANT_PATTERNS = {
  LOCATION_ID: new RegExp(
    `^${VARIANT_COMPONENTS.CHROMOSOME}` +
      `${VARIANT_COMPONENTS.FIRST_SEPARATOR}` +
      `${VARIANT_COMPONENTS.POSITION}` +
      `${VARIANT_COMPONENTS.SECOND_SEPARATOR}` +
      `${VARIANT_COMPONENTS.REF_ALLELE}` +
      `${VARIANT_COMPONENTS.THIRD_SEPARATOR}` +
      `${VARIANT_COMPONENTS.ALT_ALLELE}$`
  ),
  RS_ID: /^rs\d+$/i,
};

function isValidVariantFormat(input) {
  return VARIANT_PATTERNS.LOCATION_ID.test(input) || VARIANT_PATTERNS.RS_ID.test(input);
}

function validateVariantIdInput(input, searchResult, isResultEmpty) {
  if (!input) return false;
  if (isResultEmpty) return isValidVariantFormat(input);
  const isVariantTopHit = searchResult?.topHit?.[0]?.entity === "variant";
  if (isVariantTopHit) return false;
  return isValidVariantFormat(input);
}

const List = styled("ul")(({ theme }) => ({
  margin: "0",
  padding: "0",
  "& .search-list-item": {
    transition: "background ease-in 50ms",
  },
  "& .search-list-item-active": {
    background: theme.palette.grey["300"],
  },
}));

function GlobalSearchList({ inputValue }) {
  let selected = 0;
  const [searchResult, setSearchResult] = useState({});
  const [loading, setLoading] = useState(false);
  const { searchQuery, setOpen, searchSuggestions } = useContext(SearchContext);
  const [getSearchData] = useLazyQuery(searchQuery);
  const [openListItem] = useListOption();
  const [recentItems, setRecentItems] = useState(
    JSON.parse(localStorage.getItem("search-history")) || []
  );

  const focusOnItem = useCallback((index = 0) => {
    selected = index;
    const items = document.querySelectorAll(".search-list-item");
    if (items.length) {
      items.forEach(el => {
        el.classList.remove("search-list-item-active");
      });
      items[index].classList.add("search-list-item-active");
      items[index].scrollIntoView({
        behavior: "smooth",
        block: index ? "center" : "end",
      });
    }
  }, []);

  const onKeyDownHandler = useCallback(e => {
    if (e.key === "Escape") {
      setOpen(false);
      e.preventDefault();
      e.stopPropagation();
      // onInputValueChange("");
    } else if (e.code === "ArrowDown") {
      handleChangeSelected("down");
      e.preventDefault();
      e.stopPropagation();
    } else if (e.code === "ArrowUp") {
      handleChangeSelected("up");
      e.preventDefault();
      e.stopPropagation();
    } else if (e.key === "Enter") {
      const selectedElement = document.querySelector(".search-list-item-active");
      const item = JSON.parse(selectedElement.dataset.itemDetails);
      handleItemClick(item);
      e.preventDefault();
      e.stopPropagation();
    }
  }, []);

  const handleItemClick = useCallback(item => {
    setOpen(false);
    openListItem(item);
  }, []);

  function fetchSearchResults() {
    setLoading(true);
    getSearchData({ variables: { queryString: inputValue } })
      .then(res => {
        const formattedData = formatSearchData(res.data.search || res.data);
        setSearchResult({ ...formattedData });
        setLoading(false);
      })
      .catch(err => {
        setLoading(false);
      });
  }

  function isResultEmpty() {
    return Object.keys(searchResult).length === 0;
  }

  function handleChangeSelected(direction) {
    const items = document.querySelectorAll(".search-list-item");

    let index = 0;
    let newIndex = 0;

    if (direction === "down") {
      items.forEach((_, i) => {
        if (i === selected) {
          index = i;
        }
      });

      newIndex = index === items.length - 1 ? 0 : index + 1;
    } else if (direction === "up") {
      items.forEach((_, i) => {
        if (i === selected) {
          index = i;
        }
      });

      newIndex = !index ? items.length - 1 : index - 1;
    } else {
      selected = 0;
    }

    const newItem = items[newIndex];

    if (newItem && typeof newIndex === "number") {
      selected = newIndex;
      focusOnItem(newIndex);
    }
  }

  function handleChangeInRecentItems() {
    setRecentItems(JSON.parse(localStorage.getItem("search-history")) || []);
  }

  const SearchSuggestionEl = (
    <Box
      sx={{
        pt: 1,
      }}
    >
      <GlobalSearchListHeader listHeader="Search Suggestions" />
      <List tabIndex={-1}>
        {searchSuggestions.map(item => (
          <GlobalSearchListItem
            key={item.id || item.symbol}
            item={item}
            onItemClick={handleItemClick}
            isTopHit={item.type === "topHit"}
          />
        ))}
      </List>
    </Box>
  );

  useEffect(() => {
    focusOnItem();
    if (inputValue) fetchSearchResults();
    else setSearchResult({});
  }, [inputValue]);

  useEffect(() => {
    document.addEventListener("keydown", onKeyDownHandler);
    window.addEventListener("storage", handleChangeInRecentItems);
    return () => {
      document.removeEventListener("keydown", onKeyDownHandler);
      window.addEventListener("storage", handleChangeInRecentItems);
    };
  }, []);

  const inputMatchVariant = validateVariantIdInput(inputValue, searchResult, isResultEmpty());

  return (
    <>
      {inputValue && loading && <GlobalSearchLoadingState />}

      {inputMatchVariant && !loading && <VariantMessage inputValue={inputValue} />}

      {/* input value is present and there are results available */}
      {inputValue &&
        !loading &&
        !isResultEmpty() &&
        Object.entries(searchResult).map(([key, value]) => (
          <Box
            key={key}
            sx={{
              pt: 1,
              borderBottomWidth: "1px",
              borderStyle: "solid",
              borderImage: "linear-gradient(to right, white, #00000037, white)0 0 90",
            }}
          >
            <GlobalSearchListHeader listHeader={key} />
            <List tabIndex={-1}>
              {value.map(item => (
                <GlobalSearchListItem
                  key={item.id || item.symbol}
                  item={item}
                  onItemClick={handleItemClick}
                  isTopHit={item.type === "topHit"}
                />
              ))}
            </List>
          </Box>
        ))}

      {/* no search result state  */}
      {inputValue && !loading && isResultEmpty() && (
        <>
          <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
            No search result found
          </Box>
          {SearchSuggestionEl}
        </>
      )}

      {/* input value is not present */}
      {!inputValue && recentItems.length > 0 && (
        <Box
          sx={{
            pt: 1,
            borderBottomWidth: "1px",
            borderStyle: "solid",
            borderImage: "linear-gradient(to right, white, #00000037, white)0 0 90",
          }}
        >
          <GlobalSearchListHeader listHeader="recent" />
          <List tabIndex={-1}>
            {recentItems.map(item => (
              <GlobalSearchListItem
                key={item.id || item.symbol}
                item={item}
                onItemClick={handleItemClick}
              />
            ))}
          </List>
        </Box>
      )}

      {/* no input value search suggestions */}
      {!inputValue && SearchSuggestionEl}
    </>
  );
}

export default memo(GlobalSearchList);
