import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

import useAotfContext from './hooks/useAotfContext';

function TargetPrioritisationSwitch() {
  const { displayedTable, setDisplayedTable } = useAotfContext();

  const handleChange = (event, newAlignment) => {
    setDisplayedTable(newAlignment);
  };

  return (
    <ToggleButtonGroup
      color="primary"
      value={displayedTable}
      exclusive
      onChange={handleChange}
      aria-label="Visualizations"
      size="small"
    >
      <ToggleButton disableRipple value="associations">
        Target-disease association
      </ToggleButton>
      <ToggleButton disableRipple value="prioritisations">
        Target prioritisation factors
      </ToggleButton>
    </ToggleButtonGroup>
  );
}

export default TargetPrioritisationSwitch;
