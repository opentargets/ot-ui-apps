import { ThemeOptions } from "@mui/material";
import {
  ThemeProvider as MuiThemeProvider,
  createTheme,
} from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import defaultTheme from "./defaultTheme";

function ThemeProvider({
  children,
  theme,
}: {
  children: any;
  theme: ThemeOptions;
}) {
  const uiKitTheme = createTheme(theme);
  return (
    <MuiThemeProvider theme={uiKitTheme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
}

export default ThemeProvider;
