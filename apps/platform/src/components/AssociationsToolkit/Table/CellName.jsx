import { useState } from 'react';
import { styled } from '@mui/material/styles';
import { Typography } from '@mui/material';
import {
  faDna,
  faStethoscope,
  faThumbTack,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'ui';

import Tooltip from '../AotFTooltip';
import useAotfContext from '../hooks/useAotfContext';

const NameContainer = styled('div')({
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  '&:hover > .PinnedContainer': {
    opacity: 1,
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

const LinksTooltipContent = styled('span')({
  display: 'flex',
  flexDirection: 'column',
  gap: '5px',
});

const PinnedContainer = styled('div', {
  shouldForwardProp: prop => prop !== 'active',
})(({ active }) => ({
  opacity: active ? '1' : '0',
  cursor: 'pointer',
  marginLeft: '5px',
}));

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

function CellName({ name, rowId, row, tablePrefix }) {
  const [open, setOpen] = useState(false);
  const { entityToGet, pinnedEntries, setPinnedEntries } = useAotfContext();

  const rowData = row.original;

  const isPinned = pinnedEntries.find(e => e === rowData.id);
  const rowEntity = entityToGet === 'target' ? 'target' : 'disease';
  const icon = rowEntity === 'target' ? faDna : faStethoscope;

  const pinnedIcon = tablePrefix === 'body' ? faThumbTack : faXmark;

  const handleClickPin = () => {
    if (isPinned) {
      const newPinnedData = pinnedEntries.filter(e => e !== rowData.id);
      setPinnedEntries(newPinnedData);
    } else {
      setPinnedEntries([...pinnedEntries, rowData.id]);
    }
  };

  return (
    <NameContainer>
      <PinnedContainer
        className="pinnedIcon"
        onClick={handleClickPin}
        active={isPinned}
      >
        <FontAwesomeIcon icon={pinnedIcon} size="sm" />
      </PinnedContainer>
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
          <Typography>{name}</Typography>
        </TextContainer>
      </Tooltip>
    </NameContainer>
  );
}

export default CellName;
