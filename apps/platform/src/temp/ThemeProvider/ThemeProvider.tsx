import { CssBaseline } from "@mui/material";
import { createTheme, ThemeOptions } from "@mui/system";
import { ThemeProvider as MuiThemeProvider } from '@mui/system';
import { ReactNode } from "react";

import defaultTheme from "./defaultTheme";

// function ThemeProvider({ children, theme = defaultTheme }: {children : ReactNode, theme: ThemeOptions }) {
function ThemeProvider({ children, theme = defaultTheme }: { children: ReactNode, theme: ThemeOptions }) {
  const uiKitTheme = createTheme(theme);
  // const uiKitTheme = theme;
  return (
    <MuiThemeProvider theme={uiKitTheme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
}

export default ThemeProvider;
