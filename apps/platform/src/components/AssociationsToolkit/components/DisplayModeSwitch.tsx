import { MouseEvent } from "react";
import { ToggleButtonGroup, ToggleButton } from "@mui/material";
import useAotfContext from "../hooks/useAotfContext";
import { DISPLAY_MODE } from "../utils"; // Ensure DISPLAY_MODE is properly typed

type DisplayMode = (typeof DISPLAY_MODE)[keyof typeof DISPLAY_MODE];

function getAssocLabel(entity: string): string {
  if (entity === "disease") return "Target-disease association";
  return "Target-disease association";
}

function DisplayModeSwitch() {
  // Type context return values
  const { displayedTable, setDisplayedTable, entity } = useAotfContext();

  // Type the parameters for the event and newAlignment
  const handleChange = (event: MouseEvent<HTMLElement>, newAlignment: DisplayMode | null) => {
    event.preventDefault();
    if (
      newAlignment === DISPLAY_MODE.PRIORITISATION ||
      newAlignment === DISPLAY_MODE.ASSOCIATIONS
    ) {
      setDisplayedTable(newAlignment);
    }
  };

  const associationsLabel = getAssocLabel(entity);

  return (
    <ToggleButtonGroup
      value={displayedTable}
      exclusive
      onChange={handleChange}
      aria-label="Visualization switch"
    >
      <ToggleButton aria-label="Switch to Association view" value={DISPLAY_MODE.ASSOCIATIONS}>
        {associationsLabel}
      </ToggleButton>
      {entity === "disease" && (
        <ToggleButton
          aria-label="Switch to Prioritisation view"
          value={DISPLAY_MODE.PRIORITISATION}
        >
          Target prioritisation factors
        </ToggleButton>
      )}
    </ToggleButtonGroup>
  );
}

export default DisplayModeSwitch;
