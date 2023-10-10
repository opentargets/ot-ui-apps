import { Grid, Skeleton, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const useStyles = makeStyles((theme) => ({
  externalLinks: {
    "& > :not(:first-child):before": {
      content: '" | "',
    },
  },
  mainIconContainer: {
    width: "56px",
    marginRight: "4px !important",
    justifyContent: "center",
    display: "flex",
    alignItems: "center",
  },
  mainIcon: {
    color: theme.palette.primary.main,
  },
  subtitle: {
    display: "flex",
    paddingLeft: "5px",
    alignItems: "center",
  },
  title: {
    color: theme.palette.primary.main,
    fontWeight: "500 !important",
  },
  titleContainer: {
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "10px",
  },
}));

function Header({
  loading,
  Icon,
  title,
  subtitle = null,
  externalLinks,
  rightContent = null,
}) {
  const classes = useStyles();

  return (
    <Grid
      className={classes.titleContainer}
      container
      id="profile-page-header-block"
    >
      <Grid item zeroMinWidth>
        <Grid container wrap="nowrap">
          <Grid item className={classes.mainIconContainer}>
            <FontAwesomeIcon
              icon={Icon}
              size="3x"
              className={classes.mainIcon}
            />
          </Grid>
          <Grid item zeroMinWidth>
            <Grid container>
              <Typography
                className={classes.title}
                variant="h4"
                noWrap
                title={title}
              >
                {loading ? <Skeleton width="10vw" height="3.3rem" /> : title}
              </Typography>
              <Typography className={classes.subtitle} variant="subtitle2">
                {loading ? <Skeleton width="25vw" /> : subtitle}
              </Typography>
            </Grid>
            <Grid container>
              <Typography variant="body2" className={classes.externalLinks}>
                {loading ? <Skeleton width="50vw" /> : externalLinks}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid item>{rightContent}</Grid>
    </Grid>
  );
}

export default Header;
