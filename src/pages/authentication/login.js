import { useEffect } from 'react';
import Head from 'next/head';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { Avatar, Box, Card, CardContent, CardMedia, Container, Divider, Link, Typography } from '@mui/material';
import { JWTLogin } from '../../components/authentication/jwt-login';
import { Logo } from '../../components/logo';
import { withGuestGuard } from '../../hocs/with-guest-guard';
import { useAuth } from '../../hooks/use-auth';
import { gtm } from '../../lib/gtm';

const Login = () => {
  const router = useRouter();
  const { platform } = useAuth();
  const { disableGuard } = router.query;

  useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);

  return (
    <>
      <Head>
        <title>
          Login | Didere
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
          maxWidth="md"
          sx={{
            py: {
              xs: '60px',
              md: '120px'
            }
          }}
        >
          <Card
            elevation={16}
            sx={{
              overflow: 'visible',
              display: 'flex',
              position: 'relative',
              '& > *': {
                flexGrow: 1,
                flexBasis: '50%',
                width: '50%'
              }
            }}
          >
            <CardContent sx={{padding:'8, 4, 3, 4'}}>
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
                  <Logo
                    sx={{
                      height: 40,
                      width: 40
                    }}
                  />
                </NextLink>
                <Typography variant="h4">
                  Log in
                </Typography>
                <Typography
                  color="textSecondary"
                  sx={{ mt: 2 }}
                  variant="body2"
                >
                  Efetue o login para Didere
                </Typography>
              </Box>
              <Box
                sx={{
                  flexGrow: 1,
                  mt: 3
                }}
              >
                {platform === 'JWT' && <JWTLogin />}
              </Box>
              <Divider sx={{ my: 3 }} />
              {(
                <NextLink
                  href={disableGuard
                    ? `/authentication/password-recovery?disableGuard=${disableGuard}`
                    : '/authentication/password-recovery'}
                  passHref
                >
                  <Link
                    color="textSecondary"
                    sx={{ mt: 1 }}
                    variant="body2"
                  >
                    Recuperar senha
                  </Link>
                </NextLink>
              )}
              <br/>
              {(
                <NextLink
                  href='/authentication/lgpd'
                  passHref
                >
                  <Link
                    color="textSecondary"
                    sx={{ mt: 1 }}
                    variant="body2"
                  >
                    Política de privacidade - LGPD
                  </Link>
                </NextLink>
              )}
            </CardContent>
            <CardMedia
              image="/static/auth.jpg"
              title="Chisté Systems"
              sx={{
                borderTopRightRadius:'16px',
                borderBottomRightRadius:'16px',
                padding:'3',
                color:'primary.contrastText',
                display:'flex',
                flexDirection:'column',
                justifyContent:'flex-end',
                '@media (max-width: 960px)': {
                  display: 'none'
                }
              }}
            >
              <Box
                alignItems="center"
                display="flex"
                mt={3}
              >
                <Avatar
                  alt="Person"
                  src="/static/logo-login-page.png"                
                />
                <Box ml={3}>
                  <Typography
                    color="inherit"
                    variant="body1"
                  >
                    Chisté Systems
                  </Typography>
                  <Typography
                    color="inherit"
                    variant="body2"
                  >
                    Desenvolvimento de Software
                  </Typography>
                </Box>
              </Box>
            </CardMedia>
          </Card>
        </Container>
      </Box>
    </>
  );
};

export default withGuestGuard(Login);