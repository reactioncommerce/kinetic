import { createTheme } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Palette {
    background: TypeBackground;
  }

  interface PaletteOptions {
    green: string;
  }

  interface TypeBackground {
    dark: string;
  }
}

// Create a theme instance.
const theme = createTheme({
  palette: {
    background: {
      dark: '#001D28'
    },
    green: '#00C14E'
  }
});

export default theme;
