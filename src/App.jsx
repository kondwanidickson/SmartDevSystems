import * as React from 'react';
import './App.css';
import Router from './routes';
import { HelmetProvider } from'react-helmet-async';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import GlobalStyles from '@mui/material/GlobalStyles';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <HelmetProvider>
      <ThemeProvider 
        theme={createTheme({
          palette: {
            mode: "dark",
            primary: {
              main: "#00b7c3"
            }
          },
          typography: {
            fontFamily: [
              '-apple-system',
              'BlinkMacSystemFont',
              'Segoe UI',
              'Roboto',
              'Helvetica Neue',
              'Arial',
              'sans-serif',
              'Apple Color Emoji',
              'Segoe UI Emoji',
              'Segoe UI Symbol',
            ].join(','),
          }
        })}
      >
        <GlobalStyles styles={{ ul: { margin: 0, padding: 0, listStyle: 'none' } }} />
        <Router />
      </ThemeProvider>
    </HelmetProvider>
  );
}

export default App;
