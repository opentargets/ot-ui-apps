import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

import { DISPLAY_MODE } from "../utils";
import useAotfContext from "../hooks/useAotfContext";

function TargetPrioritisationSwitch() {
  const { displayedTable, setDisplayedTable } = useAotfContext();

  const handleChange = (event, newAlignment) => {
    event.preventDefault();
    if (
      newAlignment === DISPLAY_MODE.PRIORITISATION ||
      newAlignment === DISPLAY_MODE.ASSOCIATIONS
    ) {
      setDisplayedTable(newAlignment);
    }
  };

  return (
    <ToggleButtonGroup
      color="primary"
      value={displayedTable}
      exclusive
      onChange={handleChange}
      aria-label="Visualizations"
      size="large"
    >
      <ToggleButton sx={{ height: "auto" }} value="associations">
        Target-disease association
      </ToggleButton>
      <ToggleButton sx={{ height: "auto" }} value="prioritisations">
        Target prioritisation factors
      </ToggleButton>
    </ToggleButtonGroup>
  );
}

export default TargetPrioritisationSwitch;
