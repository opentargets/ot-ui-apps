import { useContext } from 'react';
import { Button } from '@material-ui/core';
import {
  faCheckDouble,
  faDiagramProject,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { styled } from '@material-ui/styles';

import { AssociationsContext } from '../provider';

const TextContent = styled('div')({
  marginLeft: '5px',
});

function TargetPrioritisationSwitch() {
  const { displayedTable, setDisplayedTable } = useContext(AssociationsContext);

  let isAssociations = displayedTable === 'associations';

  const handleClick = () => {
    if (displayedTable === 'associations') setDisplayedTable('prioritisations');
    if (displayedTable === 'prioritisations') setDisplayedTable('associations');
  };

  const getButtonLabel = () => {
    if (isAssociations) return 'Show targets prioritisations';
    return 'Show disease-target associations';
  };

  const getIcon = () => {
    if (isAssociations) return faCheckDouble;
    return faDiagramProject;
  };

  const buttonLabel = getButtonLabel();

  return (
    <Button
      onClick={handleClick}
      variant="outlined"
      color="primary"
      disableElevation
    >
      <FontAwesomeIcon icon={getIcon()} size="lg" />
      <TextContent>{buttonLabel}</TextContent>
    </Button>
  );
}

export default TargetPrioritisationSwitch;
