import { createTheme } from '@mui/material/styles';

const Dark = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#ff2faa',
    },
    secondary: {
      main: '#8D3B72',
    },
    background: { 
      paper: '#121212',
    }
  },

});

export default Dark;