import React from "react";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import { ControlProps } from "react-select";

const useStyles = makeStyles(_theme => ({
  input: {
    display: "flex",
    backgroundColor: "#eee",
  },
}));

// const InputComponent = ({ inputRef, ...rest }) => <input ref={inputRef} {...rest} />;

const Control = ({ innerRef, innerProps, children }: ControlProps) => {
  const classes = useStyles();
  return (
    <TextField
      fullWidth
      InputProps={{
        inputComponent: "input",
        inputProps: {
          className: classes.input,
          inputRef: innerRef as React.RefObject<HTMLInputElement>,
          children,
          ...(innerProps as React.InputHTMLAttributes<HTMLInputElement>),
        },
      }}
    />
  );
};

export default Control;
