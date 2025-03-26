import { Box, Grid, Skeleton, SxProps, Theme, Typography } from "@mui/material";
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
    color: theme.palette.primary.dark,
  },
  subtitle: {
    display: "flex",
    paddingLeft: "5px",
    alignItems: "center",
  },
  title: {
    color: theme.palette.primary.dark,
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

const iconHeaderStyles: SxProps = {
  width: "56px",
  marginRight: "4px !important",
  justifyContent: "center",
  alignItems: "center",
  display: {
    xs: "none",
    md: "flex",
  },
};

const iconTextStyles: SxProps = {
  marginRight: "4px !important",
  display: {
    xs: "inline-block",
    md: "none",
  },
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
          <Box sx={iconHeaderStyles}>
            <FontAwesomeIcon icon={Icon} size="3x" className={classes.mainIcon} />
          </Box>
          <Grid item zeroMinWidth>
            <Grid container sx={{ mb: { xs: 2, md: 0 } }}>
              <Typography className={classes.title} variant="h4" noWrap title={title}>
                <Box component="span" sx={iconTextStyles}>
                  <FontAwesomeIcon icon={Icon} size="sm" className={classes.mainIcon} />
                </Box>
                {loading ? <Skeleton width="10vw" /> : title}
              </Typography>
              <Typography className={classes.subtitle} variant="h5">
                {loading ? <Skeleton width="50vw" /> : subtitle}
              </Typography>
            </Grid>
            <Grid container sx={{ mb: { xs: 2, md: 0 } }}>
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
