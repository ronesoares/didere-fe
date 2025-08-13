import { useState, useCallback, useEffect } from 'react';
import NextLink from 'next/link';
import Head from 'next/head';
import { Avatar, Box, Chip, Container, Link, Typography } from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { UserEditForm } from '../../../../components/dashboard/admin/user/user-edit-form';
import { withAuthGuard } from '../../../../hocs/with-auth-guard';
import { withDashboardLayout } from '../../../../hocs/with-dashboard-layout';
import { useMounted } from '../../../../hooks/use-mounted';
import { gtm } from '../../../../lib/gtm';
import { getInitials } from '../../../../utils/get-initials';
import userService from '../../../../services/admin/user-service';
import { useRouter } from 'next/router';

const UserEdit = () => {
  const isMounted = useMounted();
  const router = useRouter();
  const { userId } = router.query;
  const [user, setUser] = useState(null);

  useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);

  const getUser = useCallback(async () => {
    try {
      const data = userId > 0 ? await userService.getById(userId) : {
        id: 0,
        idOwner: '',
        profile: '',
        name: '',
        login: '',
        password: '',
        status: 'A',
        creationDate: '',
        email: '',
        loginAttemptQuantity: '',
        dateOfLastLoginAttempt: 0,
        isUserOwner: 'N'
      };

      if (isMounted()) {
        setUser(data);
      }
    } catch (err) {
      console.error(err);
    }
  }, [isMounted]);

  useEffect(() => {
      getUser();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []);

  if (!user) {
    return null;
  }

  return (
    <>
      <Head>
        <title>
          {userId == 0 ? 'Inserir' : 'Alterar'} usuário | Didere
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
              href="/dashboard/admin/user"
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
                  Usuários
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
              src={user.avatar}
              sx={{
                height: 64,
                mr: 2,
                width: 64
              }}
            >
              {getInitials(user.name)}
            </Avatar>
            <div>
              <Typography
                noWrap
                variant="h4"
              >
                {user.name}
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
                  label={user.id}
                  size="small"
                  sx={{ ml: 1 }}
                />
              </Box>
            </div>
          </Box>
          <Box mt={3}>
            <UserEditForm user={user} />
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default withAuthGuard(withDashboardLayout(UserEdit));