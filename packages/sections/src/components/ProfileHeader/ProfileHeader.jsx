import { Children } from 'react';
import { Grid } from '@mui/material';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
  profileHeaderContainer: {
    marginTop: '.5rem',
  },
  profileHeaderSection: {
    marginBottom: '5px',
  },
});

function ProfileHeader({ children }) {
  const classes = useStyles();

  return (
    <Grid className={classes.profileHeaderContainer} container spacing={2}>
      {Children.map(children, child => (
        <Grid className={classes.profileHeaderSection} item xs={12} md={6}>
          {child}
        </Grid>
      ))}
    </Grid>
  );
}

export default ProfileHeader;
