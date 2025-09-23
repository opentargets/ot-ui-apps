import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import type { ReactNode } from "react";

import defaultTheme from "./defaultTheme";

function ThemeProvider({
  children,
  theme = defaultTheme,
}: {
  children: ReactNode;
  theme: typeof defaultTheme;
}) {
  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
}

export default ThemeProvider;
