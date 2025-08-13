import { useCallback, useEffect, useState } from 'react';
import Head from 'next/head';
import {
  Box,
  Container,
  Grid,
  Typography
} from '@mui/material';
import { OverviewBanner } from '../../components/dashboard/overview/overview-banner';
import { withAuthGuard } from '../../hocs/with-auth-guard';
import { withDashboardLayout } from '../../hocs/with-dashboard-layout';
import { gtm } from '../../lib/gtm';
import { useAuth } from '../../hooks/use-auth';
import DateBR from '../../utils/date-br';

const Overview = () => {
  const [displayBanner, setDisplayBanner] = useState(true);
  const [data, setData] = useState({});
  const { user } = useAuth();

  const setDataDashboard = useCallback(async () => {
    if (user?.idOwner) {
      const data = null;//await dashboardService.listar(user?.idOwner);
      setData(data);
    }    
  }, [user?.idOwner]);

  useEffect(() => {
    gtm.push({ event: 'page_view' });
    setDataDashboard();
  }, [setDataDashboard]);

  useEffect(() => {
    const value = globalThis.localStorage.getItem('dismiss-banner');

    if (value === 'true') {
      setDisplayBanner(false);
    }
  }, []);

  const handleDismissBanner = () => {
    globalThis.localStorage.setItem('dismiss-banner', 'true');
    setDisplayBanner(false);
  };

  const getGreeting = () => {
    const now = new DateBR().toUTC3();
    const hour = now.getHours();
    let greeting = '';
  
    if (hour < 12) {
      greeting = 'Bom dia';
    } else if (hour < 18) {
      greeting = 'Boa tarde';
    } else {
      greeting = 'Boa noite';
    }

    return greeting + ', ' + user?.firstName;
  }

  return (
    <>
      <Head>
        <title>
          Dashboard | Didere
        </title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8
        }}
      >
        <Container maxWidth="xl">
          <Box sx={{ mb: 4 }}>
            <Grid
              container
              justifyContent="space-between"
              spacing={3}
            >
              <Grid item>
                <Typography variant="h4">
                  {getGreeting()}
                </Typography>
              </Grid>
            </Grid>
          </Box>
          <Grid
            container
            spacing={4}
          >
            {displayBanner && (
              <Grid
                item
                xs={12}
              >
                <OverviewBanner 
                  onDismiss={handleDismissBanner}
                  isMainPage={false} 
                />
              </Grid>
            )}
            
          </Grid>
        </Container>
      </Box>
    </>
  );
};

export default withAuthGuard(withDashboardLayout(Overview));
