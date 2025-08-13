import { useState, useCallback, useEffect } from 'react';
import NextLink from 'next/link';
import Head from 'next/head';
import { Avatar, Box, Chip, Container, Link, Typography } from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { ProfileEditForm } from '../../../../components/dashboard/admin/profile/profile-edit-form';
import { withAuthGuard } from '../../../../hocs/with-auth-guard';
import { withDashboardLayout } from '../../../../hocs/with-dashboard-layout';
import { useMounted } from '../../../../hooks/use-mounted';
import { gtm } from '../../../../lib/gtm';
import { getInitials } from '../../../../utils/get-initials';
import profileService from '../../../../services/admin/profile-service';
import { useRouter } from 'next/router';

const ProfileEdit = () => {
  const isMounted = useMounted();
  const router = useRouter();
  const { profileId } = router.query;
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);

  const getProfile = useCallback(async () => {
    try {
      const data = profileId > 0 ? await profileService.getById(profileId) : {
        id: 0,
        idUserRegistration: null,
        idUserLastUpdated: '',
        name: '',
        idOwner: '',
      };

      if (isMounted()) {
        setProfile(data);
      }
    } catch (err) {
      console.error(err);
    }
  }, [isMounted]);

  useEffect(() => {
      getProfile();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []);

  if (!profile) {
    return null;
  }

  return (
    <>
      <Head>
        <title>
          {profileId == 0 ? 'Inserir' : 'Alterar'} perfil de acesso | Didere
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
              href="/dashboard/admin/profile"
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
                  Perfis de acesso
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
              src={profile.avatar}
              sx={{
                height: 64,
                mr: 2,
                width: 64
              }}
            >
              {getInitials(profile.name)}
            </Avatar>
            <div>
              <Typography
                noWrap
                variant="h4"
              >
                {profile.name}
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
                  Código:
                </Typography>
                <Chip
                  label={profile.id}
                  size="small"
                  sx={{ ml: 1 }}
                />
              </Box>
            </div>
          </Box>
          <Box mt={3}>
            <ProfileEditForm profile={profile} />
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default withAuthGuard(withDashboardLayout(ProfileEdit));