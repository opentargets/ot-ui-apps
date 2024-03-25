import { lighten, darken } from "polished";
import { Roboto, Inter } from "next/font/google";
import { createTheme } from "@mui/material/styles";

import { Theme } from "@mui/material/styles";

declare module "@mui/styles/defaultTheme" {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface (remove this line if you don't have the rule enabled)
  interface DefaultTheme extends Theme {}
}

const PRIMARY = "#3489ca";
const SECONDARY = "#ff6350";

/* FONTS DEFINITION */
const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
});

const themeOptions = {
  shape: {
    borderRadius: 2,
  },
  typography: {
    fontFamily: inter.style.fontFamily,
    assoc_header: {
      fontSize: ".90rem",
      fontWeight: 700,
    },
    monoText: {
      fontFamily: roboto.style.fontFamily,
      fontWeight: 500,
      fontSize: ".80rem",
    },
  },
  palette: {
    primary: {
      light: lighten(0.2, PRIMARY),
      main: PRIMARY,
      dark: darken(0.2, PRIMARY),
      contrastText: "#fff",
    },
    secondary: {
      light: lighten(0.2, SECONDARY),
      main: SECONDARY,
      dark: darken(0.2, SECONDARY),
      contrastText: "#fff",
    },
    text: {
      primary: "#5A5F5F",
    },
    footer: "#2e2d35",
  },
  props: {
    MuiTab: {
      disableRipple: true,
    },
  },
  components: {
    MuiButton: {
      defaultProps: {
        disableRipple: true,
      },
      styleOverrides: {
        root: {
          border: "1px solid",
          padding: "6px 12px",
          minWidth: "32px",
          minHeight: "32px",
          height: "32px",
          textTransform: "none",
          color: "#5A5F5F",
          borderColor: "rgb(196,196,196)",
        },
      },
    },
    MuiMenuItem: {
      defaultProps: {
        disableRipple: true,
      },
    },
    MuiToggleButton: {
      defaultProps: {
        disableRipple: true,
      },
      styleOverrides: {
        root: {
          border: "1px solid",
          borderColor: "rgb(196,196,196)",
          padding: "6px 12px",
          textTransform: "none",
          height: "32px",
          color: "#5A5F5F",
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          transition: "none",
        },
      },
    },
    MuiTab: {
      defaultProps: {
        disableRipple: true,
      },
      styleOverrides: {
        root: {
          textTransform: "none",
        },
      },
    },
    MuiTooltip: {
      variants: [
        {
          props: { variant: "aotf" },
          style: {
            root: {
              backgroundColor: `red`,
              color: "#fff",
            },
          },
        },
      ],
    },
    MuiSnackbar: {
      defaultProps: {
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "center",
        },
      },
    },
    MuiSnackbarContent: {
      styleOverrides: {
        root: {
          background: PRIMARY,
          color: "white",
          borderRadius: "4px",
        },
      },
    },
  },
};

const theme = createTheme(themeOptions);

export default theme;
