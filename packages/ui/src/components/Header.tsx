import { Grid, Skeleton, Theme, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ReactElement, ReactNode } from "react";
import { IconProp } from "@fortawesome/fontawesome-svg-core";

const useStyles = makeStyles((theme: Theme) => ({
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

type HeaderProps = {
  externalLinks?: ReactNode;
  Icon: IconProp;
  loading: boolean;
  rightContent?: ReactNode;
  subtitle?: string | null;
  title: string;
};

function Header({
  loading,
  Icon,
  title,
  subtitle = null,
  externalLinks,
  rightContent = null,
}: HeaderProps): ReactElement {
  const classes = useStyles();

  return (
    <Grid className={classes.titleContainer} container id="profile-page-header-block">
      <Grid item zeroMinWidth>
        <Grid container wrap="nowrap">
          <Grid item className={classes.mainIconContainer}>
            <FontAwesomeIcon icon={Icon} size="3x" className={classes.mainIcon} />
          </Grid>
          <Grid item zeroMinWidth>
            <Grid container>
              <Typography className={classes.title} variant="h4" noWrap title={title}>
                {loading ? <Skeleton width="10vw" /> : title}
              </Typography>
              <Typography className={classes.subtitle} variant="h5">
                {loading ? <Skeleton width="50vw" /> : subtitle}
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
