import classNames from "classnames";
import { Chip as MUIChip } from "@mui/material";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles({
  chip: {
    height: "20px",
    marginLeft: "4px",
    marginBottom: "4px",
    maxWidth: "100%",
    backgroundColor: "#fafafa",
  },
});

function NewChip({ className }) {
  const classes = useStyles();
  return (
    <MUIChip
      className={classNames(classes.chip, className)}
      label="beta"
      variant="outlined"
      size="small"
    />
  );
}

export default NewChip;
