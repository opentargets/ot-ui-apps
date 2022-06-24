import React from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import { MuiThemeProvider, createTheme } from "@material-ui/core/styles";

import defaultTheme from "./defaultTheme";

export function ThemeProvider({ children, theme = defaultTheme }) {
  return (
    <MuiThemeProvider theme={createTheme(theme)}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
}
