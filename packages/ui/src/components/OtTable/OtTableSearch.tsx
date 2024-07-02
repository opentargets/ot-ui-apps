import { ReactElement, useEffect, useState } from "react";
import { Input, InputAdornment } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import useDebounce from "../../hooks/useDebounce";
import { OtTableSearchProps } from "./table.types";

/****************************************
 *      OT TABLE SEARCH COMPONENT       *
 * REDUCE RERENDER, ACCEPTS SETSTATE FN *
 *         SET DEBOUNCED VALUE          *
 ****************************************/

function OtTableSearch({ setGlobalSearchTerm }: OtTableSearchProps): ReactElement {
  const [globalFilter, setGlobalFilter] = useState("");

  const debouncedTableSearchValue = useDebounce(globalFilter, 300);

  useEffect(() => {
    setGlobalSearchTerm(debouncedTableSearchValue);
  }, [debouncedTableSearchValue]);

  return (
    <Input
      sx={{ width: 1 }}
      value={globalFilter ?? ""}
      onChange={e => setGlobalFilter(e.target.value)}
      placeholder="Search all columns..."
      startAdornment={
        <InputAdornment position="start">
          <FontAwesomeIcon icon={faMagnifyingGlass} />
        </InputAdornment>
      }
    />
  );
}
export default OtTableSearch;
