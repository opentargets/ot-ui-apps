import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { naLabel } from "../constants";
import {
  faArrowTrendDown,
  faArrowTrendUp,
  faCircleExclamation,
  faMinus,
  faQuestion,
  faShieldHalved,
} from "@fortawesome/free-solid-svg-icons";
import { makeStyles } from "@mui/styles";
import { Box, Divider, Tooltip } from "@mui/material";

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
  variantEffect?: string;
  directionOnTrait?: string;
};

const LoF = "LoF";
const RISK = "risk";

function DirectionOfEffectIcon({ variantEffect, directionOnTrait }: DirectionOfEffectIconProp) {
  const classes = useStyles();

  let tooltipText = "";
  if (variantEffect === LoF) tooltipText += "Loss of Function │ ";
  else if (variantEffect) tooltipText += "Gain of Function │ ";
  else tooltipText += naLabel + " │ ";

  if (directionOnTrait === RISK) tooltipText += "Risk";
  else if (directionOnTrait) tooltipText += "Protective";
  else tooltipText += naLabel;

  return (
    <Box sx={{ display: "flex", justifyContent: "center" }}>
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
            {variantEffect ? (
              <FontAwesomeIcon
                className={classes.colorBlue}
                icon={variantEffect === LoF ? faArrowTrendDown : faArrowTrendUp}
                size="lg"
              />
            ) : (
              <FontAwesomeIcon className={classes.colorBlue} icon={faQuestion} />
            )}
          </Box>
          <Divider orientation="vertical" variant="middle" />
          <Box sx={{ display: "flex", justifyContent: "center", width: 20 }}>
            {directionOnTrait ? (
              <FontAwesomeIcon
                className={classes.colorBlue}
                icon={directionOnTrait === "risk" ? faCircleExclamation : faShieldHalved}
                size="lg"
              />
            ) : (
              <FontAwesomeIcon className={classes.colorBlue} icon={faQuestion} size="sm" />
            )}
          </Box>
        </Box>
      </Tooltip>
    </Box>
  );
}

export default DirectionOfEffectIcon;
