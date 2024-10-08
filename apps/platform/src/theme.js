import { lighten, darken } from "polished";
import config from "./config";
import { grey } from "@mui/material/colors";

const PRIMARY = config.profile.primaryColor;
const SECONDARY = "#ff6350";

const theme = {
  shape: {
    borderRadius: 2,
  },
  typography: {
    fontFamily: '"Inter", sans-serif',
    assoc_header: {
      fontSize: ".90rem",
      fontWeight: 700,
    },
    monoText: {
      fontFamily: "'Roboto Mono', monospace",
      fontWeight: 500,
      fontSize: ".80rem",
    },
    controlHeader: {
      fontSize: "1rem",
      fontWeight: 700,
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
    plain: {
      main: grey[700],
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
    MuiMenu: {
      styleOverrides: {
        paper: {
          boxShadow: "none",
          border: `1px solid ${grey[400]}`,
          marginTop: -1,
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

export default theme;
