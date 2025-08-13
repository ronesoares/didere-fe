import { useState, useCallback, useEffect } from 'react';
import NextLink from 'next/link';
import Head from 'next/head';
import { Avatar, Box, Chip, Container, Link, Typography } from '@mui/material';
import { ArrowBack as ArrowBackIcon, Description } from '@mui/icons-material';
import { PropertyEditForm } from '../../../../components/dashboard/registrations/property/property-edit-form';
import { withAuthGuard } from '../../../../hocs/with-auth-guard';
import { withDashboardLayout } from '../../../../hocs/with-dashboard-layout';
import { useMounted } from '../../../../hooks/use-mounted';
import { gtm } from '../../../../lib/gtm';
import { getInitials } from '../../../../utils/get-initials';
import propertyService from '../../../../services/registrations/property-service';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';

const PropertyEdit = () => {
  const isMounted = useMounted();
  const router = useRouter();
  const { propertyId } = router.query;
  const [property, setProperty] = useState(null);
  const { t } = useTranslation();
  

  useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);

  const getProperty = useCallback(async () => {
    try {
      const data = propertyId > 0 ? await propertyService.getById(propertyId) : {
        id: 0,
        title: '',
        description: '',
        urlMaps: '',
        height: 0,
        width: 0,
        depth: 0,
        periodicity: 'M',
        value: 0,
        addressId: 0,
        locatorId: 0,
        features: null,
        typeActivities: null,
        rentalPeriods: null,
      };

      if (isMounted()) {
        setProperty(data);
      }
    } catch (err) {
      console.error(err);
    }
  }, [isMounted]);

  useEffect(() => {
      getProperty();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []);

  if (!property) {
    return null;
  }

  return (
    <>
      <Head>
        <title>
          {propertyId == 0 ? 'Inserir' : 'Alterar'} Imóveis | Didere
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
              href="/dashboard/registrations/property"
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
                  {t('Imóveis')}
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
              src={property.mainPhoto}
              sx={{
                height: 64,
                mr: 2,
                width: 64
              }}
            >
              {getInitials(property.title)}
            </Avatar>
            <div>
              <Typography
                noWrap
                variant="h4"
              >
                {property.title}
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
                  label={property.id}
                  size="small"
                  sx={{ ml: 1 }}
                />
              </Box>
            </div>
          </Box>
          <Box mt={3}>
            <PropertyEditForm property={property} />
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default withAuthGuard(withDashboardLayout(PropertyEdit));