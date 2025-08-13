import { useEffect } from 'react';
import Head from 'next/head';
import NextLink from 'next/link';
import { Box, Card, Container, Typography } from '@mui/material';
import { Logo } from '../../components/logo';
import { withGuestGuard } from '../../hocs/with-guest-guard';
import { gtm } from '../../lib/gtm';
import { JWTRecoveryPassword } from '../../components/authentication/jwt-recovery-password';

const PasswordRecovery = () => {
  useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);

  return (
    <>
      <Head>
        <title>
          Recuperar Senha | Didere
        </title>
      </Head>
      <Box
        component="main"
        sx={{
          backgroundColor: 'background.default',
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh'
        }}
      >
        <Container
          maxWidth="sm"
          sx={{
            py: {
              xs: '60px',
              md: '120px'
            }
          }}
        >
          <Card
            elevation={16}
            sx={{ p: 4 }}
          >
            <Box
              sx={{
                alignItems: 'center',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}
            >
              <NextLink
                href="/"
                passHref
              >
                <a>
                  <Logo
                    sx={{
                      height: 40,
                      width: 40
                    }}
                  />
                </a>
              </NextLink>
              <Typography variant="h4">
                Recuperar Senha
              </Typography>
              <Typography
                color="textSecondary"
                sx={{ mt: 2 }}
                variant="body2"
              >
                Diga-nos seu e-mail para que possamos enviar um link de redefinição
              </Typography>
            </Box>
            <Box
              sx={{
                flexGrow: 1,
                mt: 3
              }}
            >
              <JWTRecoveryPassword />
            </Box>
          </Card>
        </Container>
      </Box>
    </>
  );
};

export default withGuestGuard(PasswordRecovery);
