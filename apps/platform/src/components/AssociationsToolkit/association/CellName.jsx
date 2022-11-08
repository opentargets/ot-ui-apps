import { useContext } from 'react';
import { faStar as faStartSolid } from '@fortawesome/free-solid-svg-icons';
import { faStar as faStartRegular } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { styled } from '@material-ui/styles';

import { AssociationsContext } from '../provider';

const NameContainer = styled('div')({
  position: 'relative',
  '& .pinnedIcon': {
    display: 'none',
  },
  '&:hover .pinnedIcon': {
    display: 'block',
  },
});

const TextContainer = styled('div')({
  display: 'block',
  overflow: 'hidden',
  textAlign: 'end',
  textOverflow: 'ellipsis',
  maxWidth: '300px',
});

const Name = styled('span')({
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
});

const IconContainer = styled('div')({
  position: 'absolute',
  left: '-20px',
});

function CellName({ name, rowId }) {
  // const { pinnedData, setPinnedData } = useContext(AssociationsContext);

  // const isPinned = pinnedData.indexOf(rowId) > -1;
  // const icon = isPinned ? faStartSolid : faStartRegular;

  // const handleClickPin = () => {
  //   setPinnedData([...pinnedData, rowId]);
  // };

  return (
    <NameContainer>
      {/* <IconContainer className="pinnedIcon" onClick={handleClickPin}>
        <FontAwesomeIcon icon={icon} size="lg" />
      </IconContainer> */}
      <TextContainer>
        <Name>{name}</Name>
      </TextContainer>
    </NameContainer>
  );
}

export default CellName;
