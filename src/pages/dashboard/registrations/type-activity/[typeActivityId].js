import { useState, useCallback, useEffect } from 'react';
import NextLink from 'next/link';
import Head from 'next/head';
import { Avatar, Box, Chip, Container, Link, Typography } from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { TypeActivityEditForm } from '../../../../components/dashboard/registrations/type-activity/type-activity-edit-form';
import { withAuthGuard } from '../../../../hocs/with-auth-guard';
import { withDashboardLayout } from '../../../../hocs/with-dashboard-layout';
import { useMounted } from '../../../../hooks/use-mounted';
import { gtm } from '../../../../lib/gtm';
import { getInitials } from '../../../../utils/get-initials';
import typeActivityService from '../../../../services/registrations/type-activity-service';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';

const TypeActivityEdit = () => {
  const isMounted = useMounted();
  const router = useRouter();
  const { typeActivityId } = router.query;
  const [typeActivity, setTypeActivity] = useState(null);
  const { t } = useTranslation();
  

  useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);

  const getTypeActivity = useCallback(async () => {
    try {
      const data = typeActivityId > 0 ? await typeActivityService.getById(typeActivityId) : {
        id: 0,
        name: '',
      };

      if (isMounted()) {
        setTypeActivity(data);
      }
    } catch (err) {
      console.error(err);
    }
  }, [isMounted]);

  useEffect(() => {
      getTypeActivity();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []);

  if (!typeActivity) {
    return null;
  }

  return (
    <>
      <Head>
        <title>
          {typeActivityId == 0 ? 'Inserir' : 'Alterar'} Tipos de Atividades | Didere
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
              href="/dashboard/registrations/type-activity"
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
                  {t('Tipos de Atividades')}
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
              src={typeActivity.avatar}
              sx={{
                height: 64,
                mr: 2,
                width: 64
              }}
            >
              {getInitials(typeActivity.name)}
            </Avatar>
            <div>
              <Typography
                noWrap
                variant="h4"
              >
                {typeActivity.name}
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
                  label={typeActivity.id}
                  size="small"
                  sx={{ ml: 1 }}
                />
              </Box>
            </div>
          </Box>
          <Box mt={3}>
            <TypeActivityEditForm typeActivity={typeActivity} />
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default withAuthGuard(withDashboardLayout(TypeActivityEdit));