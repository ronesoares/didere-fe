import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import {
  Box,
  Container,
  Typography,
  Grid,
  useTheme,
  useMediaQuery,
  Alert,
  Divider,
} from '@mui/material';
import {
  Email as EmailIcon,
  Lock as LockIcon,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { Card, Button, TextField } from '../../components/ui';
import { GuestGuard } from '../../components/guards/GuestGuard';
import { useAuth } from '../../contexts/auth-context';
import toast from 'react-hot-toast';

const LoginContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  background: theme.palette.mode === 'dark'
    ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)'
    : 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2),
}));

const LoginCard = styled(Card)(({ theme }) => ({
  background: theme.palette.mode === 'dark'
    ? 'rgba(30, 41, 59, 0.95)'
    : 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(20px)',
  border: `1px solid ${theme.palette.divider}`,
  boxShadow: theme.shadows[12],
  maxWidth: 480,
  width: '100%',
  margin: '0 auto',
}));

const BrandSection = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  marginBottom: theme.spacing(4),
}));

const LoginPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const router = useRouter();
  const { login, loading } = useAuth();
  
  const [formData, setFormData] = useState({
    login: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (field) => (event) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value,
    }));
    if (error) setError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!formData.login || !formData.password) {
      setError('Por favor, preencha todos os campos');
      return;
    }

    try {
      await login(formData.login, formData.password);
      toast.success('Login realizado com sucesso!');
      router.push('/dashboard');
    } catch (err) {
      setError(err.message || 'Erro ao fazer login');
      toast.error(err.message || 'Erro ao fazer login');
    }
  };

  return (
    <GuestGuard>
      <LoginContainer>
        <Container maxWidth="sm">
          <LoginCard>
            <Box sx={{ p: { xs: 3, sm: 4 } }}>
              <BrandSection>
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 700,
                    mb: 1,
                    background: theme.palette.mode === 'dark'
                      ? 'linear-gradient(135deg, #60a5fa, #a78bfa)'
                      : 'linear-gradient(135deg, #2563eb, #7c3aed)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Didere
                </Typography>
                <Typography variant="h6" color="text.secondary">
                  Faça login em sua conta
                </Typography>
              </BrandSection>

              {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {error}
                </Alert>
              )}

              <Box component="form" onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      label="Email"
                      type="email"
                      value={formData.login}
                      onChange={handleChange('login')}
                      startIcon={<EmailIcon />}
                      variant="glass"
                      required
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      label="Senha"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={handleChange('password')}
                      startIcon={<LockIcon />}
                      endIcon={
                        <Box
                          component="button"
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          sx={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            color: 'text.secondary',
                          }}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </Box>
                      }
                      variant="glass"
                      required
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="gradient"
                      size="large"
                      fullWidth
                      loading={loading}
                    >
                      Entrar
                    </Button>
                  </Grid>
                </Grid>
              </Box>

              <Divider sx={{ my: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  ou
                </Typography>
              </Divider>

              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Não tem uma conta?{' '}
                  <Link href="/auth/register" passHref>
                    <Typography
                      component="a"
                      variant="body2"
                      sx={{
                        color: 'primary.main',
                        textDecoration: 'none',
                        fontWeight: 600,
                        '&:hover': {
                          textDecoration: 'underline',
                        },
                      }}
                    >
                      Criar conta
                    </Typography>
                  </Link>
                </Typography>
              </Box>

              <Box sx={{ textAlign: 'center', mt: 2 }}>
                <Link href="/auth/forgot-password" passHref>
                  <Typography
                    component="a"
                    variant="body2"
                    sx={{
                      color: 'text.secondary',
                      textDecoration: 'none',
                      '&:hover': {
                        color: 'primary.main',
                        textDecoration: 'underline',
                      },
                    }}
                  >
                    Esqueceu sua senha?
                  </Typography>
                </Link>
              </Box>
            </Box>
          </LoginCard>
        </Container>
      </LoginContainer>
    </GuestGuard>
  );
};

export default LoginPage;

