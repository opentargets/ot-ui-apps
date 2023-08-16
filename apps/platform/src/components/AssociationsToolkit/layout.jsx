import { styled } from '@material-ui/core';

const baseGridContainerStyles = {
  display: 'grid',
  gridTemplateRows: '1fr',
  gridColumnGap: '2px',
  gridRowGap: '0px',
  justifyItems: 'center',
  width: '100%',
};

const boxShadow = '0px 3px 15px -3px rgba(0,0,0,0.1)';

export const GridContainer = styled('div', {
  shouldForwardProp: prop => prop !== 'columnsCount',
})(({ columnsCount }) => ({
  ...baseGridContainerStyles,
  gridTemplateColumns: `repeat(${columnsCount}, 1fr)`,
}));

export const TableBodyContent = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  margin: '6px 0',
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
  padding: rowExpanded ? '0.1em 0 0.1em 0' : '0.1em 0 0.1em 0',
  zIndex: rowExpanded ? '90 !important' : 'initial',
  backgroundColor: rowExpanded ? 'initial' : 'initial',
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  boxShadow: rowExpanded ? boxShadow : 'none',
  border: rowExpanded ? '0.7px solid #666' : '0.7px solid #fafafa',
  '&:hover': {
    backgroundColor: 'var(--row-hover-color)',
    border: '0.7px solid #666',
  },
  '&:hover .pinnedIcon': {
    opacity: 1,
    cursor: 'pointer',
  },
}));
