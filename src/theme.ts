import { createTheme } from "@mui/material/styles";

declare module "@mui/material/styles" {
  interface Palette {
    background: TypeBackground;
  }

  interface TypeBackground {
    dark: string;
  }
}

// Create a theme instance.
const theme = createTheme({
  palette: {
    background: {
      dark: "#001D28"
    },
    primary: {
      main: "#00C14E",
      contrastText: "#fff"
    }
  }
});

export default theme;
