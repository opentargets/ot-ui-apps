import {
  faArrowAltCircleDown,
  faArrowAltCircleUp,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, ButtonBase, Divider, Drawer, IconButton, Paper, Typography } from "@mui/material";
import { useState } from "react";
import { makeStyles } from "@mui/styles";
import { naLabel } from "@ot/constants";
import { v1 } from "uuid";
import Link from "./Link";
import OtTable from "./OtTable/OtTable";
import Tooltip from "./Tooltip";

const sourceDrawerStyles = makeStyles(theme => ({
  drawerLink: {
    color: `${theme.palette.primary.main} !important`,
  },
  drawerBody: {
    overflowY: "overlay",
  },
  drawerModal: {
    "& .MuiBackdrop-root": {
      opacity: "0 !important",
    },
  },
  drawerPaper: {
    backgroundColor: theme.palette.grey[300],
    maxWidth: "100%",
  },
  drawerTitle: {
    borderBottom: "1px solid #ccc",
    padding: "1rem",
  },
  drawerTitleCaption: {
    color: theme.palette.grey[700],
    fontSize: "1.2rem",
    fontWeight: "bold",
  },
  AccordionExpanded: {
    margin: "1rem !important",
  },
  AccordionRoot: {
    border: "1px solid #ccc",
    margin: "1rem 1rem 0 1rem",
    padding: "1rem",
    "&::before": {
      backgroundColor: "transparent",
    },
  },
  AccordionSubtitle: {
    color: theme.palette.grey[400],
    fontSize: "0.8rem",
    fontStyle: "italic",
  },
  AccordionTitle: {
    color: theme.palette.grey[700],
    fontSize: "1rem",
    fontWeight: "bold",
  },
  summaryBoxRoot: {
    marginRight: "2rem",
  },
  blue: {
    color: theme.palette.primary.dark,
  },
  grey: {
    color: theme.palette.grey[400],
  },
}));

const LABEL = {
  increased: {
    title: "Directionality: Increased",
    icon: faArrowAltCircleUp,
  },
  decreased: {
    title: "Directionality: Decreased",
    icon: faArrowAltCircleDown,
  },
  default: {
    title: naLabel,
  },
};

export function DirectionalityList({ variantAnnotation }) {
  const classes = sourceDrawerStyles();

  function getTooltipTitle(directionality) {
    if (!directionality) return LABEL.default.title;
    return LABEL[directionality].title;
  }

  const columns = [
    {
      id: "publications",
      label: " ",
      renderCell: ({ directionality, effectDescription, literature }) => (
        <Box key={v1()} sx={{ whiteSpace: "normal", display: "flex" }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              padding: 1,
              mr: 1,
              mt: "2px",
              alignItems: "center",
              background: theme => theme.palette.grey[200],
              borderRadius: 4,
              // minWidth: "40px",
              maxWidth: "40px",
              height: "min-content",
            }}
          >
            <Tooltip title={getTooltipTitle(directionality)} style={{ background: `red` }}>
              <FontAwesomeIcon
                className={directionality === "increased" ? classes.blue : classes.grey}
                icon={LABEL.increased.icon}
                size="lg"
              />
              <Box sx={{ mt: 1 }}>
                <FontAwesomeIcon
                  className={directionality === "decreased" ? classes.blue : classes.grey}
                  icon={LABEL.decreased.icon}
                  size="lg"
                />
              </Box>
            </Tooltip>
          </Box>
          <Box>
            <Box>
              <Box>
                <Box sx={{ typography: "subtitle2", fontWeight: "bold" }} component="span">
                  Description:{" "}
                </Box>

                {effectDescription}
              </Box>
              <Box sx={{ typography: "subtitle2", fontWeight: "bold" }} component="span">
                Publication:{" "}
              </Box>
              <Link external to={literature}>
                {literature}{" "}
              </Link>{" "}
            </Box>
          </Box>
        </Box>
      ),
      filterValue: ({ directionality, effectDescription, literature }) =>
        `${directionality} ${effectDescription} ${literature}`,
    },
  ];

  return <OtTable columns={columns} rows={variantAnnotation} showColumnVisibilityControl={false} />;
}

function DirectionalityDrawer({ variantAnnotation, customLabel, caption }) {
  const [open, setOpen] = useState(false);
  const classes = sourceDrawerStyles();

  if (!variantAnnotation || !variantAnnotation.length) {
    return naLabel;
  }

  function toggleDrawer(event) {
    if (event.type === "keydown" && (event.key === "Tab" || event.key === "Shift")) {
      return;
    }
    setOpen(true);
  }

  function closeDrawer() {
    setOpen(false);
  }

  return (
    <>
      <ButtonBase disableRipple onClick={toggleDrawer} className={classes.drawerLink}>
        <Typography variant="body2">
          {" "}
          {customLabel ||
            `${variantAnnotation.length} ${
              variantAnnotation.length === 1 ? "entry" : "entries"
            }`}{" "}
        </Typography>
      </ButtonBase>

      <Drawer
        anchor="right"
        classes={{ modal: classes.drawerModal, paper: classes.drawerPaper }}
        open={open}
        onClose={closeDrawer}
      >
        <Paper classes={{ root: classes.drawerTitle }} elevation={0}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography className={classes.drawerTitleCaption}>{caption}</Typography>
            <IconButton onClick={closeDrawer}>
              <FontAwesomeIcon icon={faXmark} />
            </IconButton>
          </Box>
        </Paper>

        <Box width={600} maxWidth="100%" className={classes.drawerBody}>
          {open && (
            <Box my={3} mx={3} p={3} pb={6} bgcolor="white">
              <DirectionalityList variantAnnotation={variantAnnotation} />
            </Box>
          )}
        </Box>
      </Drawer>
    </>
  );
}
export default DirectionalityDrawer;
