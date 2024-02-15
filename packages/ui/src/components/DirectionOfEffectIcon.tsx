import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { naLabel } from "../constants";
import {
  faArrowTrendDown,
  faArrowTrendUp,
  faCircleExclamation,
  faShieldHalved,
} from "@fortawesome/free-solid-svg-icons";
import { makeStyles } from "@mui/styles";
import { Tooltip } from "@mui/material";

const useStyles = makeStyles(theme => ({
  colorBlue: {
    color: theme.palette.primary.main,
    padding: `0 ${theme.spacing(1)}`,
  },
}));

type DirectionOfEffectIconProp = {
  variantEffect?: string;
  directionOnTrait?: string;
};

function DirectionOfEffectIcon({ variantEffect, directionOnTrait }: DirectionOfEffectIconProp) {
  const classes = useStyles();

  if (!variantEffect && !directionOnTrait) return naLabel;

  return (
    <>
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
    </>
  );
}

export default DirectionOfEffectIcon;
