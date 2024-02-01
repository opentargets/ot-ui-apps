import { ThemeProvider as MuiThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import defaultTheme from "./defaultTheme";

function ThemeProvider({ children, theme = defaultTheme }: { children: any; theme: any }) {
  const uiKitTheme = createTheme(theme);
  return (
    <MuiThemeProvider theme={uiKitTheme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
}

export default ThemeProvider;
