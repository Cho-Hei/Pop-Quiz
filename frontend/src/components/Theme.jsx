import { createTheme, responsiveFontSizes } from '@mui/material/styles';

// base primary and secondary colours
let theme = createTheme({
  palette: {
    primary: {
      main: '#624CAB',
      light: '#7864B9',
    },
    secondary: {
      main: '#ffffff',
      light: '#ffffff',
    },
    tertiary: {
      main: '#fca41c',
      light: '#FCBD5F',
      contrastText: '#000000',
    }
  },
});

// colours to use for components
theme = createTheme(theme, {
  palette: {
    background: {
      default: theme.palette.secondary.main,
    }
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.secondary.main,
        },
      }
    },
    MuiButton: {
      styleOverrides: {
        root: ({ ownerState }) => ({
          '&:hover': {
            backgroundColor: theme.palette.tertiary.light
            // backgroundColor: theme.palette[ownerState.color].light
            // opacity: 0.8,
          },
        }),
      }
    }
  },
})

theme = responsiveFontSizes(theme);

export default theme;
