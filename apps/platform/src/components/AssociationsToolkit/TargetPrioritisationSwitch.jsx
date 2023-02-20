import { ButtonGroup, Button } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import useAotfContext from './hooks/useAotfContext';

import { colors } from '@material-ui/core';

const { grey } = colors;

const StyledButton = withStyles({
  root: {
    boxShadow: 'none',
    textTransform: 'none',
    padding: '6px 12px',
    border: '0.8px solid',
    lineHeight: 1.5,
    backgroundColor: grey[50],
    borderColor: `${grey[500]} !important`,
    color: '#5A5F5F',
    '&:hover': {
      backgroundColor: grey[200],
      boxShadow: 'none',
    },
    '&.active': {
      boxShadow: 'none',
      backgroundColor: grey[300],
    },
    '&:focus': {
      boxShadow: 'none',
    },
    '& .MuiTouchRipple-root': {
      display: 'none !important',
    },
    '&.MuiButtonGroup-groupedContainedHorizontal:not(:last-child)': {
      borderRight: 'none',
    },
  },
})(Button);

const StyledButtonGroup = withStyles({
  root: {
    '&:nth-child(0)': {
      borderColor: 'red',
    },
  },
})(ButtonGroup);

function TargetPrioritisationSwitch() {
  const { displayedTable, setDisplayedTable } = useAotfContext();

  const handleClickAssoc = () => {
    setDisplayedTable('associations');
  };

  const handleClickPrior = () => {
    setDisplayedTable('prioritisations');
  };

  return (
    <StyledButtonGroup disableElevation color="primary" variant="contained">
      <StyledButton
        className={displayedTable === 'associations' ? 'active' : ''}
        onClick={() => handleClickAssoc()}
        disableRipple
      >
        Target-disease association
      </StyledButton>
      <StyledButton
        className={displayedTable === 'prioritisations' ? 'active' : ''}
        onClick={() => handleClickPrior()}
        disableRipple
      >
        Targets prioritisation
      </StyledButton>
    </StyledButtonGroup>
  );
}

export default TargetPrioritisationSwitch;
