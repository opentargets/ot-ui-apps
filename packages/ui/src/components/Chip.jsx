import classNames from "classnames";
import { makeStyles } from "@mui/styles";
import { Chip as MUIChip } from "@mui/material";

const useStyles = makeStyles({
  chip: {
    height: "20px",
    marginRight: "4px",
    marginBottom: "4px",
    maxWidth: "100%",
  },
});

function Chip({ className, label, title, disabled }) {
  const classes = useStyles();
  return (
    <MUIChip
      className={classNames(classes.chip, className)}
      label={label}
      title={title}
      variant="outlined"
      size="small"
      disabled={disabled}
    />
  );
}

export default Chip;
