import { lighten, darken } from "polished";
import config from "./config";
import { grey } from "@mui/material/colors";
import { ThemeOptions } from "@mui/material/styles";

const PRIMARY: string = config.profile.primaryColor;
const SECONDARY: string = config.profile.secondaryColor;

const theme: ThemeOptions = {
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
      fontSize: ".875rem",
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
          border: "none",
          padding: "6px 12px",
          minHeight: "32px",
          textTransform: "none",
          color: "#5A5F5F",
          "&:hover": {
            backgroundColor: "rgba(80, 80, 80, 0.1)",
          },
          "&.Mui-selected": {
            color: darken(0.2, PRIMARY),
            border: "1px solid",
            borderColor: "rgb(196,196,196)",
            backgroundColor: grey[50],
          },
          "&.Mui-selected:hover": {
            backgroundColor: grey[100],
          },
          "&.Mui-selected.MuiToggleButtonGroup-lastButton": {
            borderLeft: "1px solid",
            borderColor: "rgb(196,196,196)",
            borderRadius: "2px",
          },
        },
      },
    },
    MuiToggleButtonGroup: {
      styleOverrides: {
        root: {
          paddingTop: 6,
          paddingBottom: 6,
          paddingLeft: 10,
          paddingRight: 10,
          backgroundColor: grey[200],
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
    MuiAvatar: {
      styleOverrides: {
        root: {
          fontSize: "1.2rem",
          fontWeight: 500,
        },
      },
    },
  },
};

export default theme;
