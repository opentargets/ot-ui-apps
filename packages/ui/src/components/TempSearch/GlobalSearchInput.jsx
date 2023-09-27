import { useEffect, useContext, useRef } from "react";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { Box, styled } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { SearchContext } from "../Search/SearchContext";

function GlobalSearchInput({ onInputValueChange, inputValue, setOpen }) {
  const { searchPlaceholder } = useContext(SearchContext);

  console.log("-- input rerender");
  return (
    <Box>
      <Box>
        <FontAwesomeIcon icon={faMagnifyingGlass} size="xs" />
      </Box>
      <Box>
        <input
          placeholder={searchPlaceholder}
          autoFocus
          value={inputValue}
          type="text"
          onChange={(e) => onInputValueChange(e.currentTarget.value)}
          onFocus={(e) => {
            e.currentTarget.select();
          }}
          onKeyDown={(e) => {
            if (e.key === "Escape" && inputValue) {
              e.preventDefault();
              e.stopPropagation();
              onInputValueChange("");
              setOpen(false)
            }
          }}
        />
      </Box>
      <Box>
        <button type="button" onClick={()=> {setOpen(false)}}>esc</button>
      </Box>
    </Box>
  );
}

export default GlobalSearchInput;
