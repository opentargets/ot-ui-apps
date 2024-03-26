import React from "react";
import { TextField } from "@material-ui/core";
import { InputProps } from "react-select";

const Input = ({ innerRef, ...innerProps }: InputProps) => {
  return <TextField fullWidth inputProps={{ ref: innerRef, ...innerProps }} />;
};

export default Input;
