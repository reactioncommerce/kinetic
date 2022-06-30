import { createTheme } from "@mui/material/styles";

declare module "@mui/material/styles" {
  interface TypeBackground {
    dark: string
    darkGrey: string
    light: string
  }

  interface Palette {
    background: TypeBackground
  }
}

// Create a theme instance.
const theme = createTheme({
  palette: {
    background: {
      dark: "#001D28",
      darkGrey: "#2D3748",
      light: "#F8FAFC"
    },
    primary: {
      main: "#00C14E",
      contrastText: "#fff"
    },
    text: {
      primary: "#001D28"
    }
  }
});

export default theme;
