import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";

import defaultTheme from "./defaultTheme";

function ThemeProvider({
  children,
  theme = defaultTheme,
  // biome-ignore lint/suspicious/noExplicitAny: Add proper Theme type
}: { children: React.ReactNode; theme: any }) {
  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
}

export default ThemeProvider;
