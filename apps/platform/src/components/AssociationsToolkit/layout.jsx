import { styled } from '@material-ui/core';

const baseGridContainerStyles = {
  display: 'grid',
  gridTemplateRows: '1fr',
  gridColumnGap: '2px',
  gridRowGap: '0px',
  justifyItems: 'center',
  width: '100%',
};

export const GridContainer = styled('div', {
  shouldForwardProp: prop => prop !== 'columnsCount',
})(({ columnsCount }) => ({
  ...baseGridContainerStyles,
  gridTemplateColumns: `repeat(${columnsCount}, 1fr)`,
}));

export const TableBodyContent = styled('div')({
  display: 'flex',
  flexDirection: 'column',
});

export const RowsContainer = styled('div')({
  display: 'flex',
  flexDirection: 'column',
});

export const RowContainer = styled('div', {
  shouldForwardProp: prop => prop !== 'rowExpanded',
})(({ rowExpanded }) => ({
  top: '145px',
  position: rowExpanded ? 'sticky' : 'initial',
  padding: rowExpanded ? '0.5em 0 0.5em 0' : 'initial',
  zIndex: rowExpanded ? '90 !important' : 'initial',
  backgroundColor: rowExpanded ? 'var(--row-hover-color)' : 'initial',
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  '&:hover': {
    backgroundColor: 'var(--row-hover-color)',
  },
  '&:hover .pinnedIcon': {
    opacity: 1,
    cursor: 'pointer',
  },
}));
