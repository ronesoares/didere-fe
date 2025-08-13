import { useState, useCallback, useEffect } from 'react';
import NextLink from 'next/link';
import Head from 'next/head';
import { Avatar, Box, Chip, Container, Link, Typography } from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { FeatureEditForm } from '../../../../components/dashboard/registrations/feature/feature-edit-form';
import { withAuthGuard } from '../../../../hocs/with-auth-guard';
import { withDashboardLayout } from '../../../../hocs/with-dashboard-layout';
import { useMounted } from '../../../../hooks/use-mounted';
import { gtm } from '../../../../lib/gtm';
import { getInitials } from '../../../../utils/get-initials';
import featureService from '../../../../services/registrations/feature-service';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';

const FeatureEdit = () => {
  const isMounted = useMounted();
  const router = useRouter();
  const { featureId } = router.query;
  const [feature, setFeature] = useState(null);
  const { t } = useTranslation();
  

  useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);

  const getFeature = useCallback(async () => {
    try {
      const data = featureId > 0 ? await featureService.getById(featureId) : {
        id: 0,
        name: '',
        description: '',
      };

      if (isMounted()) {
        setFeature(data);
      }
    } catch (err) {
      console.error(err);
    }
  }, [isMounted]);

  useEffect(() => {
      getFeature();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []);

  if (!feature) {
    return null;
  }

  return (
    <>
      <Head>
        <title>
          {featureId == 0 ? 'Inserir' : 'Alterar'} Características | Didere
        </title>
      </Head>
      <Box
        component="main"
        sx={{
          backgroundColor: 'background.default',
          flexGrow: 1,
          py: 8
        }}
      >
        <Container maxWidth="md">
          <Box sx={{ mb: 4 }}>
            <NextLink
              href="/dashboard/registrations/feature"
              passHref
            >
              <Link
                color="textPrimary"
                component="a"
                sx={{
                  alignItems: 'center',
                  display: 'flex'
                }}
              >
                <ArrowBackIcon
                  fontSize="small"
                  sx={{ mr: 1 }}
                />
                <Typography variant="subtitle2">
                  {t('Características')}
                </Typography>
              </Link>
            </NextLink>
          </Box>
          <Box
            sx={{
              alignItems: 'center',
              display: 'flex',
              overflow: 'hidden'
            }}
          >
            <Avatar
              src={feature.avatar}
              sx={{
                height: 64,
                mr: 2,
                width: 64
              }}
            >
              {getInitials(feature.name)}
            </Avatar>
            <div>
              <Typography
                noWrap
                variant="h4"
              >
                {feature.name}
              </Typography>
              <Box
                sx={{
                  alignItems: 'center',
                  display: 'flex',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}
              >
                <Typography variant="subtitle2">
                  {t('Código:')}
                </Typography>
                <Chip
                  label={feature.id}
                  size="small"
                  sx={{ ml: 1 }}
                />
              </Box>
            </div>
          </Box>
          <Box mt={3}>
            <FeatureEditForm feature={feature} />
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default withAuthGuard(withDashboardLayout(FeatureEdit));