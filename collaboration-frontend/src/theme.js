import { createTheme } from '@mui/material/styles';

// Light pastel color palette
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#8B7EC8', // Soft lavender
      light: '#B5A9D6',
      dark: '#6B5FA3',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#A8D5BA', // Soft mint
      light: '#C4E4D1',
      dark: '#7FB896',
      contrastText: '#2C3E2D',
    },
    error: {
      main: '#F4A5A5', // Soft coral
      light: '#F8C4C4',
      dark: '#E87D7D',
    },
    warning: {
      main: '#FFD89B', // Soft peach
      light: '#FFE5C2',
      dark: '#FFC567',
    },
    info: {
      main: '#A8D8EA', // Soft sky blue
      light: '#C4E6F2',
      dark: '#7BB8D1',
    },
    success: {
      main: '#A8D5BA', // Soft mint (same as secondary)
      light: '#C4E4D1',
      dark: '#7FB896',
    },
    background: {
      default: '#F7F5FB', // Very light lavender
      paper: '#FFFFFF',
    },
    text: {
      primary: '#4A4A4A',
      secondary: '#6B6B6B',
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    h4: {
      fontWeight: 600,
      letterSpacing: '-0.02em',
    },
    h5: {
      fontWeight: 600,
      letterSpacing: '-0.01em',
    },
    h6: {
      fontWeight: 600,
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 12,
  },
  shadows: [
    'none',
    '0px 2px 4px rgba(139, 126, 200, 0.08)',
    '0px 4px 8px rgba(139, 126, 200, 0.1)',
    '0px 8px 16px rgba(139, 126, 200, 0.12)',
    '0px 12px 24px rgba(139, 126, 200, 0.15)',
    ...Array(20).fill('0px 16px 32px rgba(139, 126, 200, 0.18)'),
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          padding: '10px 24px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0px 4px 8px rgba(139, 126, 200, 0.2)',
          },
        },
        contained: {
          '&:hover': {
            boxShadow: '0px 4px 12px rgba(139, 126, 200, 0.3)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0px 2px 8px rgba(139, 126, 200, 0.08)',
        },
        elevation1: {
          boxShadow: '0px 2px 8px rgba(139, 126, 200, 0.08)',
        },
        elevation2: {
          boxShadow: '0px 4px 12px rgba(139, 126, 200, 0.12)',
        },
        elevation3: {
          boxShadow: '0px 8px 16px rgba(139, 126, 200, 0.15)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 10,
            '&:hover fieldset': {
              borderColor: '#B5A9D6',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#8B7EC8',
              borderWidth: '2px',
            },
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0px 8px 16px rgba(139, 126, 200, 0.15)',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0px 2px 8px rgba(139, 126, 200, 0.1)',
          backgroundColor: '#FFFFFF',
          color: '#4A4A4A',
        },
      },
    },
  },
});

export default theme;

