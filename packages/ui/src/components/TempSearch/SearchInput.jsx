import { useEffect, useContext, useRef } from "react";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { Box, styled } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function SearchInput({
  placeholder = "Search...",
  onInputValueChange,
  inputValue,
}) {
  return (
    <Box>
      <Box>
        <FontAwesomeIcon icon={faMagnifyingGlass} size="xs" />
      </Box>
      <Box>
        <input
          placeholder={placeholder}
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
            }
          }}
        />
      </Box>
      <Box>
        <button type="button">esc</button>
      </Box>
    </Box>
  );
}

export default SearchInput;
