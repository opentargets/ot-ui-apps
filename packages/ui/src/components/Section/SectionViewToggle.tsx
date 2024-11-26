import { faChartPie, faTableColumns } from "@fortawesome/free-solid-svg-icons";
import { FormControl, MenuItem, Select, SelectChangeEvent, Box } from "@mui/material";
import { ReactElement, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { VIEW } from "../../constants";

const menuItemStyles = { display: "flex", gap: 1 };
const menuActiveStyles = { display: "flex", gap: 1, alignItems: "center" };

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
    <FormControl size="small">
      <Select
        sx={{ typography: "body2" }}
        value={alignment}
        onChange={handleAlignment}
        renderValue={view => {
          const iconView = VIEW.table ? faTableColumns : faChartPie;
          return (
            <Box sx={menuActiveStyles}>
              <FontAwesomeIcon icon={iconView} /> {view} view
            </Box>
          );
        }}
      >
        <MenuItem value={VIEW.table} sx={menuItemStyles}>
          <FontAwesomeIcon icon={faTableColumns} />
          {VIEW.table}
        </MenuItem>
        <MenuItem value={VIEW.chart} sx={menuItemStyles}>
          <FontAwesomeIcon icon={faChartPie} /> {VIEW.chart}
        </MenuItem>
      </Select>
    </FormControl>
  );
}
export default SectionViewToggle;
