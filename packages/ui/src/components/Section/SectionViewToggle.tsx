import { faChartPie, faTableColumns } from "@fortawesome/free-solid-svg-icons";
import { FormControl, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import { ReactElement, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { VIEW } from "../../constants";

type SectionViewToggleProps = {
  defaultValue: string;
  viewChange: (s: string) => void;
};

function SectionViewToggle({
  defaultValue = VIEW.table,
  viewChange,
}: SectionViewToggleProps): ReactElement {
  const [alignment, setAlignment] = useState(defaultValue);

  const handleAlignment = (event: SelectChangeEvent) => {
    if (event.target.value) {
      setAlignment(event.target.value);
      viewChange(event.target.value);
    }
  };

  return (
    <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
      <Select sx={{ typography: "body2" }} value={alignment} onChange={handleAlignment}>
        <MenuItem value={VIEW.table}>
          <FontAwesomeIcon icon={faTableColumns} /> {VIEW.table} View
        </MenuItem>
        <MenuItem value={VIEW.chart}>
          <FontAwesomeIcon icon={faChartPie} /> {VIEW.chart} View
        </MenuItem>
      </Select>
    </FormControl>
  );
}
export default SectionViewToggle;
