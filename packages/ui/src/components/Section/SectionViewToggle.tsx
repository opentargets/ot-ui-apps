import { faChartPie, faTableColumns } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { ReactElement, useState } from "react";
import { FontAwesomeIconPadded } from "../OtTable/otTableLayout";

export const VIEW = {
  table: "table",
  chart: "chart",
};

function SectionViewToggle({ viewChange }): ReactElement {
  const [alignment, setAlignment] = useState(VIEW.table);

  const handleAlignment = (event, newAlignment) => {
    setAlignment(newAlignment);
    viewChange(newAlignment);
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
