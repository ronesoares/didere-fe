import { useEffect } from 'react';
import Head from 'next/head';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '../contexts/auth-context';
import { SettingsProvider } from '../contexts/settings-context';
import { createTheme } from '../theme';
import '../styles/fullcalendar.css';
import 'simplebar/dist/simplebar.min.css';

const App = ({ Component, pageProps }) => {
  const theme = createTheme({
    direction: 'ltr',
    responsiveFontSizes: true,
    mode: 'light'
  });

  useEffect(() => {
    // Remove the server-side injected CSS
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  return (
    <>
      <Head>
        <title>Didere - Plataforma de Locação de Espaços</title>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        <meta name="description" content="Encontre o espaço perfeito para seus eventos e projetos" />
      </Head>
      
      <SettingsProvider>
        <AuthProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <Component {...pageProps} />
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: theme.palette.background.paper,
                  color: theme.palette.text.primary,
                  border: `1px solid ${theme.palette.divider}`,
                },
              }}
            />
          </ThemeProvider>
        </AuthProvider>
      </SettingsProvider>
    </>
  );
};

export default App;

