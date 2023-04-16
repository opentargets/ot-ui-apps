import React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider as MuiTheme } from "@mui/styles";
import { createTheme } from "@mui/material/styles";

import defaultTheme from "./defaultTheme";

function ThemeProvider({ children, theme = defaultTheme }) {
  return (
    <MuiTheme theme={createTheme(theme)}>
      <CssBaseline />
      {children}
    </MuiTheme>
  );
}

export default ThemeProvider;
