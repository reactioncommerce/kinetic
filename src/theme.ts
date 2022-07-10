import { createTheme } from "@mui/material/styles";


declare module "@mui/material/styles" {
  interface TypeBackground {
    dark: string;
    darkGrey: string
  }

  interface Palette {
    background: TypeBackground;
  }
}

const color = {
  black: "#000",
  white: "#FFF",
  lightGrey: "#A0AEC0",
  background: "#F8FAFC",
  darkGreen: "#001D28",
  electricGreen: "#00C14E",
  darkGrey: "#2D3748"
};

// Create a theme instance.
const baseTheme = createTheme({
  palette: {
    background: {
      dark: color.darkGreen,
      default: color.background,
      paper: color.white,
      darkGrey: color.darkGrey
    },
    primary: {
      main: color.electricGreen,
      contrastText: color.white
    },
    secondary: {
      main: color.darkGrey,
      contrastText: color.white
    }
  },
  shape: {
    borderRadius: 6
  },
  typography: {
    fontFamily: [
      "Inter",
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"'
    ].join(","),
    button: {
      fontWeight: 600,
      textTransform: "none"
    }
  }
});

const theme = createTheme(baseTheme, {
  components: {
    MuiButton: {
      defaultProps: {
        disableElevation: true
      },
      styleOverrides: {
        sizeLarge: {
          fontSize: 18,
          padding: 10
        }
      }
    },
    MuiFormControl: {
      styleOverrides: {
        marginNormal: {
          marginTop: baseTheme.spacing(1)
        }
      }
    },
    MuiFormLabel: {
      styleOverrides: {
        root: {
          fontWeight: 500,
          marginBottom: baseTheme.spacing(1),
          color: baseTheme.palette.grey["900"]
        }
      }
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: baseTheme.palette.background.paper
        },
        input: {
          borderColor: color.lightGrey,
          padding: `${baseTheme.spacing(1)} ${baseTheme.spacing(2)}`
        }
      }
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: baseTheme.shape.borderRadius,
          height: baseTheme.spacing(3),
          fontWeight: 600,
          fontSize: 14
        }
      }
    },
    MuiTypography: {
      styleOverrides: {
        h4: {
          fontWeight: 700,
          fontSize: "2.25rem",
          lineHeight: 1.2,
          [baseTheme.breakpoints.down("md")]: {
            fontSize: "1.875rem",
            lineHeight: 1.33
          }
        },
        h1: {
          fontSize: "4.5rem",
          fontWeight: 700,
          lineHeight: 1,
          [baseTheme.breakpoints.down("md")]: {
            fontSize: "3.75rem"
          }
        },
        h2: {
          fontWeight: 700,
          fontSize: "3.75rem",
          lineHeight: 1,
          [baseTheme.breakpoints.down("md")]: {
            fontSize: "3rem"
          }
        },
        h3: {
          fontWeight: 700,
          fontSize: "3rem",
          lineHeight: 1,
          [baseTheme.breakpoints.down("md")]: {
            fontSize: "2.25rem",
            lineHeight: 1.2
          }
        },
        h5: {
          fontWeight: 700,
          fontSize: "1.875rem",
          lineHeight: 1.2,
          [baseTheme.breakpoints.down("md")]: {
            fontSize: "1.5rem",
            lineHeight: 1.33
          }
        },
        h6: {
          fontWeight: 600,
          fontSize: "1.25rem",
          lineHeight: 1.2,
          [baseTheme.breakpoints.down("md")]: {
            fontSize: "1.25rem",
            lineHeight: 1.2
          }
        }
      }
    },
    MuiLink: {
      styleOverrides: {
        root: {
          fontSize: 16
        }
      }
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: baseTheme.palette.background.paper,
          color: baseTheme.palette.grey["800"]
        }
      }
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          minWidth: 0
        }
      }
    }
  }
});

export default theme;
