import { useState } from 'react';
import { styled } from '@material-ui/styles';
import { Typography } from '@material-ui/core';
import { faDna } from '@fortawesome/free-solid-svg-icons';
import { faStethoscope } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Tooltip from '../AotFTooltip';
import Link from '../../Link';
import useAotfContext from '../hooks/useAotfContext';

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

function CellName({ name, rowId }) {
  const [open, setOpen] = useState(false);
  const { entityToGet } = useAotfContext();

  const rowEntity = entityToGet === 'target' ? 'target' : 'disease';
  const icon = rowEntity === 'target' ? faDna : faStethoscope;

  return (
    <NameContainer>
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
