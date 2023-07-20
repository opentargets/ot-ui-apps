import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStethoscope } from '@fortawesome/free-solid-svg-icons';
import { faPrescriptionBottleAlt } from '@fortawesome/free-solid-svg-icons';
import { faDna } from '@fortawesome/free-solid-svg-icons';

import { Typography, Grid, makeStyles, Box } from '@material-ui/core';
import { ENTITIES } from './utils';

const useStyles = makeStyles(theme => ({
  mainIconContainer: {
    width: '35px',
    justifyContent: 'start',
    display: 'flex',
    alignItems: 'center',
  },
  mainIcon: {
    color: theme.palette.primary.main,
  },

  divider: {
    color: theme.palette.primary.main,
    fontWeight: 500,
    margin: '0 12px',
  },

  title: {
    color: theme.palette.primary.main,
    fontWeight: 500,
  },
}));

function BlockHeader({ entity, data }) {
  const classes = useStyles();
  let Icon = null;
  let name;
  switch (entity) {
    case ENTITIES.TARGET:
      Icon = faDna;
      name = data.target.approvedSymbol;
      break;
    case ENTITIES.DISEASE:
      Icon = faStethoscope;
      name = data.disease.name;
      break;
    case ENTITIES.DRUG:
      Icon = faPrescriptionBottleAlt;
      name = data.drug.name;
      break;
    default:
      Icon = faDna;
      name = data.target.approvedSymbol;
      break;
  }
  return (
    <Grid container direction="row" wrap="nowrap">
      <Box>
        <Grid item container>
          <Grid item className={classes.mainIconContainer}>
            <FontAwesomeIcon
              icon={Icon}
              size="2x"
              className={classes.mainIcon}
            />
          </Grid>
          <Grid item zeroMinWidth>
            <Grid container>
              <Typography
                className={classes.title}
                variant="h5"
                noWrap
                title={name}
              >
                {name}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Box>
      {entity === ENTITIES.EVIDENCE && (
        <>
          <Typography className={classes.divider} variant="h5" noWrap>
            -
          </Typography>
          <Box>
            <Grid container wrap="nowrap">
              <Grid item className={classes.mainIconContainer}>
                <FontAwesomeIcon
                  icon={faStethoscope}
                  size="2x"
                  className={classes.mainIcon}
                />
              </Grid>
              <Grid item zeroMinWidth>
                <Grid container>
                  <Typography
                    className={classes.title}
                    variant="h5"
                    noWrap
                    title={data.disease.name}
                  >
                    {data.disease.name}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </>
      )}
    </Grid>
  );
}

export default BlockHeader;
