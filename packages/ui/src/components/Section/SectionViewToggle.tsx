import { faChartPie, faTableColumns } from "@fortawesome/free-solid-svg-icons";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import { MouseEvent, ReactElement, useState } from "react";
import { FontAwesomeIconPadded } from "../OtTable/otTableLayout";
import { VIEW } from "../../constants";
import Tooltip from "../Tooltip";

type SectionViewToggleProps = {
  defaultValue: string;
  viewChange: (s: string) => void;
};

function SectionViewToggle({
  defaultValue = VIEW.table,
  viewChange,
}: SectionViewToggleProps): ReactElement {
  const [alignment, setAlignment] = useState(defaultValue);

  const handleAlignment = (event: MouseEvent, newAlignment: string) => {
    if (newAlignment) {
      setAlignment(newAlignment);
      viewChange(newAlignment);
    }
  };

  return (
    <ToggleButtonGroup value={alignment} exclusive onChange={handleAlignment}>
      <Tooltip title={`${VIEW.table} view`} style="">
        <ToggleButton value={VIEW.table} aria-label="table-view">
          <FontAwesomeIconPadded icon={faTableColumns} />
        </ToggleButton>
      </Tooltip>
      <Tooltip title={`${VIEW.chart} view`} style="">
        <ToggleButton value={VIEW.chart} aria-label="chart-view">
          <FontAwesomeIconPadded icon={faChartPie} />
        </ToggleButton>
      </Tooltip>
    </ToggleButtonGroup>
  );
}
export default SectionViewToggle;
