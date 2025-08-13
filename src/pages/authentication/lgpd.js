import { useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Box } from '@mui/material';
import { withGuestGuard } from '../../hocs/with-guest-guard';
import { gtm } from '../../lib/gtm';
import { ModalLGPD } from '../../components/authentication/terms/modal-lgpd';

const LGPD = () => {
  const router = useRouter();

  useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);

  const handleCloseModalLGPD = () => {
    router.push('/search/property');
  };

  return (
    <>
      <Head>
        <title>
          Política de privacidade - LGPD | Didere
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
        <ModalLGPD
          open={true} 
          onClose={handleCloseModalLGPD} 
        />
      </Box>
    </>
  );
};

export default withGuestGuard(LGPD);