import CssBaseline from "@material-ui/core/CssBaseline";
import { MuiThemeProvider, createTheme } from "@material-ui/core/styles";

import defaultTheme from "./defaultTheme";

function ThemeProvider({ children, theme = defaultTheme }) {
  const uiKitTheme = createTheme(theme);
  return (
    <MuiThemeProvider theme={uiKitTheme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
}

export default ThemeProvider;
