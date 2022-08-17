import { alpha, createTheme, ThemeOptions } from "@mui/material/styles";


declare module "@mui/material/styles" {
  interface TypeBackground {
    dark: string;
    darkGrey: string
    lightGrey: string
    lightGreen: string
  }

  interface Palette {
    background: TypeBackground;
  }
}

const color = {
  black: "#000",
  white: "#FFF",
  background: "#F8FAFC",
  dark: "#001D28",
  electricGreen: "#00C14E",
  darkGreen: "#146343",
  lightGreen: "#DCF2EA",
  lightYellow: "#FFEFD2",
  darkYellow: "#66460D",
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
  },
  darkRed: "#B7386F",
  red: {
    100: "#F9DADA",
    900: "#7D2828"
  }
};

// Create a theme instance.
const baseTheme = createTheme({
  palette: {
    background: {
      dark: color.dark,
      default: color.background,
      paper: color.white,
      lightGrey: color.grey["400"],
      darkGrey: color.grey["700"],
      lightGreen: alpha(color.electricGreen, 0.03)
    },
    primary: {
      main: color.electricGreen,
      contrastText: color.white
    },
    secondary: {
      main: color.grey["700"],
      contrastText: color.white
    },
    success: {
      main: color.electricGreen,
      light: alpha(color.electricGreen, 0.1),
      dark: color.darkGreen,
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
            backgroundColor: alpha(baseTheme.palette.background.dark, 0.7)
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
          "borderColor": baseTheme.palette.grey[400],
          "&:hover": { borderColor: baseTheme.palette.grey[400], backgroundColor: baseTheme.palette.background.paper }
        },
        outlinedError: {
          "color": color.darkRed,
          "backgroundColor": baseTheme.palette.background.paper,
          "borderColor": baseTheme.palette.grey[400],
          "&:hover": { borderColor: baseTheme.palette.grey[400], backgroundColor: baseTheme.palette.background.paper }
        }
      }
    },
    MuiFormControlLabel: {
      styleOverrides: {
        root: {
          marginLeft: 0
        },
        label: {
          color: baseTheme.palette.grey["900"]
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
          borderColor: baseTheme.palette.background.lightGrey
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
        colorSuccess: {
          color: color.darkGreen,
          backgroundColor: color.lightGreen
        },
        colorWarning: {
          backgroundColor: color.lightYellow,
          color: color.darkYellow
        },
        colorError: {
          backgroundColor: color.red[100],
          color: color.red[900]
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
            fontSize: "1rem",
            lineHeight: 1.2
          }
        },
        body2: { lineHeight: "calc(20/14)" },
        subtitle1: {
          fontWeight: 500
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
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          color: baseTheme.palette.grey[700]
        }
      }
    },
    MuiPaper: {
      defaultProps: {
        elevation: 0
      }
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          "&.MuiTableRow-hover": {
            "&:hover": { cursor: "pointer" }
          }
        }
      }
    },
    MuiTablePagination: {
      styleOverrides: {
        root: {
          backgroundColor: baseTheme.palette.background.default
        }
      }
    },
    MuiSwitch: {
      styleOverrides: {
        root: {
          width: 48,
          height: 24,
          padding: 0,
          marginRight: baseTheme.spacing(1)
        },
        switchBase: {
          "padding": 0,
          "margin": 3,
          "&.Mui-checked": {
            "transform": "translateX(23px)",
            "backgroundColor": baseTheme.palette.common.white,
            "color": color.dark,
            "&:hover": {
              backgroundColor: baseTheme.palette.common.white
            },
            "& + .MuiSwitch-track": {
              backgroundColor: baseTheme.palette.background.dark,
              opacity: 1
            },
            "&.Mui-disabled + .MuiSwitch-track": {
              opacity: 0.5
            }
          }
        },
        thumb: {
          boxSizing: "border-box",
          width: 18,
          height: 18
        },
        track: {
          borderRadius: 24 / 2,
          backgroundColor: baseTheme.palette.background.dark
        }
      }
    },
    MuiAutocomplete: {
      styleOverrides: {
        tag: {
          color: color.grey[600],
          fontWeight: 400,
          borderRadius: baseTheme.shape.borderRadius,
          svg: {
            fontSize: 12,
            fill: color.grey[600]
          }
        }
      }
    },
    MuiAlert: {
      styleOverrides: {
        standardSuccess: {
          "backgroundColor": baseTheme.palette.success.light,
          "color": baseTheme.palette.success.dark,
          ".MuiAlert-icon": {
            color: baseTheme.palette.success.dark
          }
        }

      }
    }
  }
} as ThemeOptions);

export default theme;
