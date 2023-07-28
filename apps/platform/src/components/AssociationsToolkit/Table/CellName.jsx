import { useState } from 'react';
import { styled } from '@material-ui/styles';
import { Typography } from '@material-ui/core';
import {
  faDna,
  faStethoscope,
  faThumbTack,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Tooltip from '../AotFTooltip';
import Link from '../../Link';
import useAotfContext from '../hooks/useAotfContext';

const NameContainer = styled('div')({
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  '& .pinnedIcon': {
    opacity: '0',
    transition: 'opacity ease-in-out 300ms',
    marginLeft: '5px',
  },
  '& .pinnedIcon.active': {
    // opacity: '1',
  },
  '&:hover .pinnedIcon': {
    opacity: '1',
    cursor: 'pointer',
    color: 'ececec',
  },
});

const TextContainer = styled('div')({
  display: 'block',
  overflow: 'hidden',
  textAlign: 'end',
  textOverflow: 'ellipsis',
  maxWidth: '120px',
  '&:hover': {
    cursor: 'pointer',
  },
  '&:hover span': {
    textDecoration: 'underline',
  },
});

const Name = styled('span')({
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
});

const LinksTooltipContent = styled('span')({
  display: 'flex',
  flexDirection: 'column',
  gap: '5px',
});

function TooltipContent({ id, entity, name, icon }) {
  const profileURL = `/${entity}/${id}`;
  const associationsURL = `/${entity}/${id}/associations`;
  return (
    <LinksTooltipContent>
      <Typography variant="subtitle1">
        <FontAwesomeIcon icon={icon} /> {name}
      </Typography>
      <Link to={profileURL}>Go to Profile</Link>
      <Link to={associationsURL}>Go to Associations</Link>
    </LinksTooltipContent>
  );
}

function CellName({ name, rowId, row }) {
  const [open, setOpen] = useState(false);
  const { entityToGet, pinnedEntries, setPinnedData, setPinnedEntries } =
    useAotfContext();

  const rowData = row.original;

  const isPinned = pinnedEntries.find(e => e === rowData.id);

  const handleClickPin = () => {
    if (isPinned) {
      const newPinnedData = pinnedEntries.filter(e => e !== rowData.id);
      setPinnedEntries(newPinnedData);
    } else {
      setPinnedEntries([...pinnedEntries, rowData.id]);
    }
  };

  const rowEntity = entityToGet === 'target' ? 'target' : 'disease';
  const icon = rowEntity === 'target' ? faDna : faStethoscope;

  return (
    <NameContainer>
      <div
        className={`pinnedIcon ${isPinned && 'active'}`}
        onClick={handleClickPin}
      >
        <FontAwesomeIcon icon={faThumbTack} />
      </div>
      <Tooltip
        open={open}
        onClose={() => setOpen(false)}
        content={
          <TooltipContent
            name={name}
            entity={rowEntity}
            id={rowId}
            icon={icon}
          />
        }
      >
        <TextContainer onClick={() => setOpen(true)}>
          <Name>{name}</Name>
        </TextContainer>
      </Tooltip>
    </NameContainer>
  );
}

export default CellName;
