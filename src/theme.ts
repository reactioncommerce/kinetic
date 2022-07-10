import { alpha, createTheme, ThemeOptions } from "@mui/material/styles";


declare module "@mui/material/styles" {
  interface TypeBackground {
    dark: string;
    darkGrey: string
    lightGrey: string
  }

  interface Shape {
    borderRadiusLarge?: number
    borderRadiusSmall?: number
  }

  interface Palette {
    background: TypeBackground;
  }
}

const color = {
  black: "#000",
  white: "#FFF",
  background: "#F8FAFC",
  darkGreen: "#001D28",
  electricGreen: "#00C14E",
  grey: {
    50: "#F7FAFC",
    100: "#EDF2F7",
    200: "#E2E8F0",
    300: "#CBD5E0",
    400: "#A0AEC0",
    500: "#718096",
    600: "#4A5568",
    700: "#2D3748",
    800: "#1A202C",
    900: "#171923"
  }
};

// Create a theme instance.
const baseTheme = createTheme({
  palette: {
    background: {
      dark: color.darkGreen,
      default: color.background,
      paper: color.white,
      lightGrey: color.grey["400"],
      darkGrey: color.grey["700"]
    },
    primary: {
      main: color.electricGreen,
      contrastText: color.white
    },
    secondary: {
      main: color.grey["700"],
      contrastText: color.white
    }
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
    MuiBackdrop: {
      styleOverrides: {
        root: {
          "&:not(.MuiBackdrop-invisible)": {
            backgroundColor: alpha(color.darkGreen, 0.7)
          }
        }
      }
    },
    MuiMenu: {
      defaultProps: {
        PaperProps: {
          elevation: 0
        }
      }
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true
      },
      styleOverrides: {
        sizeLarge: {
          fontSize: 18,
          padding: 10
        },
        sizeSmall: {
          padding: "4px 8px",
          borderRadius: baseTheme.shape.borderRadius
        },
        outlinedSecondary: {
          "backgroundColor": baseTheme.palette.background.paper,
          "border": `1px solid ${baseTheme.palette.grey[400]}`,
          "&:hover": { borderColor: baseTheme.palette.grey[400], backgroundColor: baseTheme.palette.background.paper }
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
          borderColor: baseTheme.palette.background.lightGrey,
          padding: `${baseTheme.spacing(1)} ${baseTheme.spacing(2)}`
        }
      }
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          height: baseTheme.spacing(3),
          fontWeight: 600,
          fontSize: 14
        },
        colorInfo: {
          color: "#317159",
          backgroundColor: "#DCF2EA"
        },
        sizeSmall: {
          fontSize: "11px",
          borderRadius: baseTheme.shape.borderRadius
        }
      }
    },
    MuiTypography: {
      styleOverrides: {
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
        h4: {
          fontWeight: 700,
          fontSize: "2.25rem",
          lineHeight: 1.2,
          [baseTheme.breakpoints.down("md")]: {
            fontSize: "1.875rem",
            lineHeight: 1.33
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
          fontSize: "1rem",
          lineHeight: 1.2,
          [baseTheme.breakpoints.down("md")]: {
            fontSize: "1.25rem",
            lineHeight: 1.2
          }
        },
        body2: { lineHeight: "calc(20/14)" }
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
    },
    MuiPaper: {
      defaultProps: {
        elevation: 0
      }
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          color: baseTheme.palette.grey[700]
        }
      }
    }
  }
} as ThemeOptions);

export default theme;
