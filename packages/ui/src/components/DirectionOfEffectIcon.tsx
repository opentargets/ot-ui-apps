import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowTrendDown,
  faArrowTrendUp,
  faCircleExclamation,
  faQuestion,
  faShieldHalved,
} from "@fortawesome/free-solid-svg-icons";
import { makeStyles } from "@mui/styles";
import { Box, Divider, Tooltip } from "@mui/material";
import { ReactNode } from "react";

const useStyles = makeStyles(theme => ({
  colorBlue: {
    color: theme.palette.primary.main,
  },
  tooltip: {
    backgroundColor: `${theme.palette.background.paper} !important`,
    border: `1px solid ${theme.palette.grey[300]}`,
    color: `${theme.palette.text.primary} !important`,
  },
}));

type DirectionOfEffectIconProp = {
  variantEffect: string | null;
  directionOnTrait: string | null;
};

const LABEL = {
  LoF: {
    label: "Loss of Function",
    icon: faArrowTrendDown,
  },
  GoF: {
    label: "Gain of Function",
    icon: faArrowTrendUp,
  },
  risk: {
    label: "Risk",
    icon: faCircleExclamation,
  },
  protect: {
    label: "Protective",
    icon: faShieldHalved,
  },
  default: {
    label: "Inconclusive Assessment",
    icon: faQuestion,
  },
};

function DirectionOfEffectIcon({
  variantEffect = "default",
  directionOnTrait = "default",
}: DirectionOfEffectIconProp): ReactNode {
  const classes = useStyles();
  function getTooltipText() {
    return `${LABEL[variantEffect].label} │ ${LABEL[directionOnTrait].label}`;
  }

  const tooltipText = getTooltipText();

  return (
    <Box sx={{ display: "flex" }}>
      <Tooltip classes={{ tooltip: classes.tooltip }} placement="top" title={tooltipText}>
        <Box
          sx={{
            width: 0.7,
            padding: 1,
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
            background: theme => theme.palette.grey[200],
            borderRadius: 4,
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "center", width: 20 }}>
            <FontAwesomeIcon className={classes.colorBlue} icon={LABEL[variantEffect].icon} />
          </Box>
          <Divider orientation="vertical" variant="middle" />
          <Box sx={{ display: "flex", justifyContent: "center", width: 20 }}>
            <FontAwesomeIcon className={classes.colorBlue} icon={LABEL[directionOnTrait].icon} />
          </Box>
        </Box>
      </Tooltip>
    </Box>
  );
}

export default DirectionOfEffectIcon;
