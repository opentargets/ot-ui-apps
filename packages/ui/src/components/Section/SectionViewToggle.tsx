import { faChartPie, faTableColumns } from "@fortawesome/free-solid-svg-icons";
import { Box, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { ReactElement, useState } from "react";
import { FontAwesomeIconPadded } from "../OtTable/otTableLayout";
import { VIEW } from "../../constants";

function SectionViewToggle({ defaultValue = VIEW.table, viewChange }): ReactElement {
  const [alignment, setAlignment] = useState(defaultValue);

  const handleAlignment = (event, newAlignment) => {
    if (newAlignment) {
      setAlignment(newAlignment);
      viewChange(newAlignment);
    }
  };

  return (
    <ToggleButtonGroup value={alignment} exclusive onChange={handleAlignment}>
      <ToggleButton value={VIEW.table} aria-label="table-view">
        <FontAwesomeIconPadded icon={faTableColumns} />
        <Box>Table View</Box>
      </ToggleButton>
      <ToggleButton value={VIEW.chart} aria-label="chart-view">
        <FontAwesomeIconPadded icon={faChartPie} />
        <Box>Chart View</Box>
      </ToggleButton>
    </ToggleButtonGroup>
  );
}
export default SectionViewToggle;
