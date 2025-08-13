import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import { Box, CircularProgress } from '@mui/material';
import { useAuth } from '../../contexts/auth-context';

export const GuestGuard = ({ children }) => {
  const { isAuthenticated, isInitialized } = useAuth();
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!router.isReady) {
      return;
    }

    if (isInitialized) {
      if (isAuthenticated) {
        router.replace('/dashboard');
      } else {
        setChecked(true);
      }
    }
  }, [router.isReady, router, isAuthenticated, isInitialized]);

  if (!checked || !isInitialized) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return children;
};

GuestGuard.propTypes = {
  children: PropTypes.node.isRequired,
};

