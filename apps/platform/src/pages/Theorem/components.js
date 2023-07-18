import { styled, Drawer as MuiDrawer } from '@material-ui/core';

export const BlockWrapper = styled('div')({
  margin: '20px 0',
  display: 'flex',
  flexDirection: 'column',
  gap: '20px',
  padding: '20px',
  borderTop: '1px solid #e0e0e0',
});

export const Drawer = styled(MuiDrawer)({
  '& .MuiPaper-root': {
    width: '500px',
  },
});
