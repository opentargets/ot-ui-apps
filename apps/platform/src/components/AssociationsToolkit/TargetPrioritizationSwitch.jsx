import { useContext } from 'react';
import { Button } from '@material-ui/core';
import { faCheckDouble } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { styled } from '@material-ui/styles';

import { AssociationsContext } from './AssociationsProvider';

const TextContent = styled('div')({
  marginLeft: '5px',
});

function TargetPrioritizationSwitch() {
  const { displayedTable, setDisplayedTable } = useContext(AssociationsContext);

  const handleClick = () => {
    if (displayedTable === 'associations') setDisplayedTable('prioritizations');
    if (displayedTable === 'prioritizations') setDisplayedTable('associations');
  };

  const getButtonLabel = () => {
    if (displayedTable === 'associations')
      return 'Show targets prioritizations';
    if (displayedTable === 'prioritizations')
      return 'Show disease-target associations';
  };

  const buttonLabel = getButtonLabel();

  return (
    <Button
      onClick={handleClick}
      variant="outlined"
      color="primary"
      disableElevation
    >
      <FontAwesomeIcon icon={faCheckDouble} size="lg" />
      <TextContent>{buttonLabel}</TextContent>
    </Button>
  );
}

export default TargetPrioritizationSwitch;
