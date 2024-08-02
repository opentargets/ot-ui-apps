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
  INCONCLUSIVE_ASSESSMENT: "Inconclusive Assessment",
  getVariantText(variant: string | null) {
    if (variant === "LoF") return "Loss of Function";
    if (variant === "GoF") return "Gain of Function";
    return this.INCONCLUSIVE_ASSESSMENT;
  },
  getVariantIcon(variant: string | null) {
    if (variant === "LoF") return faArrowTrendDown;
    if (variant === "GoF") faArrowTrendUp;
    return faQuestion;
  },
  getDirectionText(direction: string | null) {
    if (direction === "risk") return "Risk";
    if (direction === "protect") return "Protective";
    return this.INCONCLUSIVE_ASSESSMENT;
  },
  getDirectionIcon(direction: string | null) {
    if (direction === "risk") return faCircleExclamation;
    if (direction === "protect") return faShieldHalved;
    return faQuestion;
  },
};

function DirectionOfEffectIcon({
  variantEffect,
  directionOnTrait,
}: DirectionOfEffectIconProp): ReactNode {
  const classes = useStyles();

  function getTooltipText() {
    return `${LABEL.getVariantText(variantEffect)} │ ${LABEL.getDirectionText(directionOnTrait)}`;
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
            <FontAwesomeIcon
              className={classes.colorBlue}
              icon={LABEL.getVariantIcon(variantEffect)}
            />
          </Box>
          <Divider orientation="vertical" variant="middle" />
          <Box sx={{ display: "flex", justifyContent: "center", width: 20 }}>
            <FontAwesomeIcon
              className={classes.colorBlue}
              icon={LABEL.getDirectionIcon(directionOnTrait)}
            />
          </Box>
        </Box>
      </Tooltip>
    </Box>
  );
}

export default DirectionOfEffectIcon;
