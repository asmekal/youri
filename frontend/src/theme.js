// src/theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        mode: 'dark', // Keeping dark mode
        primary: {
            main: '#3f51b5', // Updated to a slightly lighter blue
        },
        secondary: {
            main: '#f50057', // Updated to a brighter red
        },
        background: {
            default: '#1e1e1e', // Lighter than '#121212'
            paper: '#2c2c2c',   // Lighter than '#1e1e1e'
        },
        text: {
            primary: '#ffffff',
            secondary: '#b0bec5',
        },
    },
    typography: {
        fontFamily: 'Roboto, sans-serif',
        h1: {
            fontWeight: 700,
            fontSize: '3rem',
        },
        h2: {
            fontWeight: 700,
            fontSize: '2.5rem',
        },
        h3: {
            fontWeight: 700,
            fontSize: '2rem',
        },
        button: {
            textTransform: 'none',
            fontWeight: 600,
        },
    },
    components: {
        MuiAppBar: {
            styleOverrides: {
                colorPrimary: {
                    backgroundColor: '#3f51b5', // Match updated primary.main
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundColor: '#2c2c2c', // Match updated background.paper
                },
            },
        },
        MuiTypography: {
            styleOverrides: {
                root: {
                    color: '#ffffff',
                },
            },
        },
        MuiSnackbar: {
            styleOverrides: {
                root: {
                    backgroundColor: '#333333',
                    color: '#ffffff',
                },
            },
        },
    },
});

export default theme;
