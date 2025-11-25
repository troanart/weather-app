/**
 * Конфиг MUI
 */

'use client';

import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#f59e0b', 
      light: '#fbbf24', 
      dark: '#d97706', 
    },
    secondary: {
      main: '#6b7280', 
      light: '#9ca3af', 
      dark: '#4b5563', 
    },
    background: {
      default: '#1e1b4b', 
      paper: 'rgba(139, 92, 246, 0.3)', 
    },
  },
  typography: {
    fontFamily: 'var(--font-geist-sans), sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '0.5rem',
          textTransform: 'none',
          fontWeight: 500,
          padding: '0.75rem 1.5rem',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '0.75rem',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(8px)',
            '& fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.2)',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.3)',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#f59e0b',
            },
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '1rem',
          backgroundImage: 'linear-gradient(to bottom right, rgba(139, 92, 246, 0.5), rgba(59, 130, 246, 0.5))',
          backdropFilter: 'blur(12px)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        },
      },
    },
  },
});

