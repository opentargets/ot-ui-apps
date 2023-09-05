import { Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
  groupHeading: {
    paddingBottom: ".25rem",
  },
  groupHeadingText: {
    padding: "0 .25rem",
    fontSize: ".75rem",
    color: theme.palette.secondary.main,
    borderBottom: `1px solid ${theme.palette.secondary.main}`,
  },
}));

const groupName = {
  topHit: "Top Hit",
  disease: "Disease or phenotype",
  drug: "Drug (Generic name)",
  target: "Target",
};

function Group({ children, name }) {
  const classes = useStyles();

  return (
    <div className={classes.groupHeading}>
      {name !== "any" && (
        <Typography className={classes.groupHeadingText} variant="body1">
          {groupName[name]}
        </Typography>
      )}
      {children}
    </div>
  );
}

export default Group;
