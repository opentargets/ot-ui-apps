import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { naLabel } from "../constants";
import {
  faArrowTrendDown,
  faArrowTrendUp,
  faCircleExclamation,
  faMinus,
  faShieldHalved,
} from "@fortawesome/free-solid-svg-icons";
import { makeStyles } from "@mui/styles";
import { Box, Tooltip } from "@mui/material";

const useStyles = makeStyles(theme => ({
  colorBlue: {
    color: theme.palette.primary.main,
    padding: `0 ${theme.spacing(1)}`,
  },
  hidden: {
    visibility: "hidden",
  },
  p4: {
    padding: `0 ${theme.spacing(4)}`,
  },
}));

type DirectionOfEffectIconProp = {
  variantEffect?: string;
  directionOnTrait?: string;
};

function DirectionOfEffectIcon({ variantEffect, directionOnTrait }: DirectionOfEffectIconProp) {
  const classes = useStyles();

  if (!variantEffect && !directionOnTrait)
    return (
      <Box sx={{ width: 1, display: "flex", justifyContent: "center" }}>
        <Tooltip title={naLabel}>
          <FontAwesomeIcon className={classes.p4} icon={faMinus} size="sm" />
        </Tooltip>
      </Box>
    );

  return (
    <Box sx={{ width: 1, display: "flex", justifyContent: "center" }}>
      {variantEffect && (
        <Tooltip title={variantEffect === "LoF" ? "Loss of Function" : "Gain of Function"}>
          <FontAwesomeIcon
            className={classes.colorBlue}
            icon={variantEffect === "LoF" ? faArrowTrendDown : faArrowTrendUp}
            size="lg"
          />
        </Tooltip>
      )}

      {directionOnTrait && (
        <Tooltip title={directionOnTrait === "risk" ? "Risk" : "Protect"}>
          <FontAwesomeIcon
            className={classes.colorBlue}
            icon={directionOnTrait === "risk" ? faCircleExclamation : faShieldHalved}
            size="lg"
          />
        </Tooltip>
      )}
    </Box>
  );
}

export default DirectionOfEffectIcon;
