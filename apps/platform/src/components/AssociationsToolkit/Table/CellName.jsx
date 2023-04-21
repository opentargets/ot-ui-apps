import { styled } from '@material-ui/styles';
import { useState } from 'react';
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

function TooltipContent({ id, entity }) {
  const profileURL = `/${entity}/${id}`;
  const associationsURL = `/${entity}/${id}/associations`;
  return (
    <LinksTooltipContent>
      <Link to={profileURL}>Profile</Link>
      <Link to={associationsURL}>Associations</Link>
    </LinksTooltipContent>
  );
}

function CellName({ name, rowId }) {
  const [open, setOpen] = useState(false);
  const { entityToGet } = useAotfContext();

  const rowEntity = entityToGet === 'target' ? 'target' : 'disease';

  return (
    <NameContainer>
      <Tooltip
        open={open}
        onClose={() => setOpen(false)}
        content={<TooltipContent name={name} entity={rowEntity} id={rowId} />}
      >
        <TextContainer onClick={() => setOpen(true)}>
          <Name>{name}</Name>
        </TextContainer>
      </Tooltip>
    </NameContainer>
  );
}

export default CellName;
