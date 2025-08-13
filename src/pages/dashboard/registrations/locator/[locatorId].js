import { useState, useCallback, useEffect } from 'react';
import NextLink from 'next/link';
import Head from 'next/head';
import { Avatar, Box, Chip, Container, Link, Typography } from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { LocatorEditForm } from '../../../../components/dashboard/registrations/locator/locator-edit-form';
import { withAuthGuard } from '../../../../hocs/with-auth-guard';
import { withDashboardLayout } from '../../../../hocs/with-dashboard-layout';
import { useMounted } from '../../../../hooks/use-mounted';
import { gtm } from '../../../../lib/gtm';
import { getInitials } from '../../../../utils/get-initials';
import locatorService from '../../../../services/registrations/locator-service';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';

const LocatorEdit = () => {
  const isMounted = useMounted();
  const router = useRouter();
  const { locatorId } = router.query;
  const [locator, setLocator] = useState(null);
  const { t } = useTranslation();
  

  useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);

  const getLocator = useCallback(async () => {
    try {
      const data = locatorId > 0 ? await locatorService.getById(locatorId) : {
        id: 0,
        name: '',
        nickname: '',
        phoneOption1: '',
        phoneOption2: '',
        email: '',
        document: '',
        birthday: '',
        addressId: 0,
      };

      if (isMounted()) {
        setLocator(data);
      }
    } catch (err) {
      console.error(err);
    }
  }, [isMounted]);

  useEffect(() => {
      getLocator();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []);

  if (!locator) {
    return null;
  }

  return (
    <>
      <Head>
        <title>
          {locatorId == 0 ? 'Inserir' : 'Alterar'} Locadores | Didere
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
              href="/dashboard/registrations/locator"
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
                  {t('Locadores')}
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
              src={locator.avatar}
              sx={{
                height: 64,
                mr: 2,
                width: 64
              }}
            >
              {getInitials(locator.name)}
            </Avatar>
            <div>
              <Typography
                noWrap
                variant="h4"
              >
                {locator.name}
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
                  label={locator.id}
                  size="small"
                  sx={{ ml: 1 }}
                />
              </Box>
            </div>
          </Box>
          <Box mt={3}>
            <LocatorEditForm locator={locator} />
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default withAuthGuard(withDashboardLayout(LocatorEdit));