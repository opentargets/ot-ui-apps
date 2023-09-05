import { CssBaseline, createTheme, ThemeOptions } from "@mui/material";
import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";

import defaultTheme from "./defaultTheme";

function ThemeProvider({
  children,
  theme = defaultTheme,
}: {
  children: ReactNode;
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
