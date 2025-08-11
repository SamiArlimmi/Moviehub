import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: { main: '#ff9800' },
        secondary: { main: '#f44336' },
    },
    typography: {
        fontFamily: 'Roboto, Arial',
    },
});

export default theme;
