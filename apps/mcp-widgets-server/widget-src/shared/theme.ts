import { createTheme } from "@mui/material";

/** Shared MUI theme used by all widget IIFE bundles. */
export const theme = createTheme({
  shape: { borderRadius: 0 },
  typography: { fontFamily: '"Inter", sans-serif' },
  palette: {
    primary: { main: "#3489ca" },
    secondary: { main: "#ff6350" },
    text: { primary: "#5A5F5F" },
  },
});
