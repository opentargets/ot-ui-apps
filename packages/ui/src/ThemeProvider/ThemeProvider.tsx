import { ThemeProvider as MuiThemeProvider, createTheme, ThemeOptions } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

// import defaultTheme from "./defaultTheme";

// type ThemeProviderType = {
//   children: JSX.Element;
//   theme: ThemeOptions;
// };

declare module "@mui/material/styles" {
  interface Theme {
    status: {
      danger: string;
    };
  }
  // allow configuration using `createTheme`
  interface ThemeOptions {
    status?: {
      danger?: string;
    };
  }
}

function ThemeProvider({ children, theme }) {
  const uiKitTheme = createTheme(theme);
  return (
    <MuiThemeProvider theme={uiKitTheme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
}

export default ThemeProvider;
