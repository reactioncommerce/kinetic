import { createTheme } from '@mui/material/styles'

declare module '@mui/material/styles' {
  interface Palette {
    background: TypeBackground
  }

  interface TypeBackground {
    dark: string
    darkGrey: string
  }
}

// Create a theme instance.
const theme = createTheme({
  palette: {
    background: {
      dark: '#001D28',
      darkGrey: '#2D3748',
    },
    primary: {
      main: '#00C14E',
      contrastText: '#fff',
    },
    text: {
      primary: '#001D28',
    },
  },
})

export default theme
