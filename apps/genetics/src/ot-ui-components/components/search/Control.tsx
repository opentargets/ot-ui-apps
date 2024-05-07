import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { ControlProps } from "react-select";
import { Box } from "@material-ui/core";

const useStyles = makeStyles(_theme => ({
  control: {
    display: "flex",
    backgroundColor: "#eee",
    padding: "4px",
  },
}));

const Control = ({ innerProps, children }: ControlProps) => {
  const classes = useStyles();
  return (
    <Box id="control" className={classes.control} {...innerProps}>
      {children}
    </Box>
  );
};

export default Control;
