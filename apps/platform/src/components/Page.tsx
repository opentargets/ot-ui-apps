import { ReactNode } from 'react';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  page: {
    background: theme.palette.grey['50'],
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    margin: 0,
    width: '100%',
  },
  gridContainer: {
    margin: 0,
    padding: '24px',
    width: '100%',
    flex: '1 0 auto',
  },
}));

type PageProps = {
  /** The header component */
  header?: ReactNode;
  /** The footer component */
  footer?: ReactNode;
  /** The children (page content) */
  children?: ReactNode | ReactNode[];
};
function Page({ header, footer, children }: PageProps) {
  const classes = useStyles();
  return (
    <div className={classes.page}>
      {header}
      <Grid
        container
        justifyContent={'center'}
        spacing={3}
        className={classes.gridContainer}
      >
        <Grid item xs={12} md={11}>
          {children}
        </Grid>
      </Grid>
      {footer}
    </div>
  );
}

export { Page };

export default Page;
