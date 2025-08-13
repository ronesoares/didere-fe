import { useEffect, useMemo } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Box, Button, Divider, Drawer, Typography, useMediaQuery } from '@mui/material';
import { BadgeCheckOutlined as BadgeCheckOutlinedIcon } from '../../icons/badge-check-outlined';
import { Collection as CollectionIcon } from '../../icons/collection';
import { Home as HomeIcon } from '../../icons/home';
import { MailOpen as MailOpenIcon } from '../../icons/mail-open';
import { Newspaper as NewspaperIcon } from '../../icons/newspaper';
import { OfficeBuilding as OfficeBuildingIcon } from '../../icons/office-building';
import { User as UserIcon } from '../../icons/user';
import { Users as UsersIcon } from '../../icons/users';
import { Logo } from '../logo';
import { Scrollbar } from '../scrollbar';
import { DashboardSidebarSection } from './dashboard-sidebar-section';
import { useAuth } from '../../hooks/use-auth';

const getSections = (t) => [
  {
    title: 'Dashboard',
    items: [
      {
        title: 'Início',
        path: '/dashboard',
        icon: <HomeIcon fontSize="small" />
      },
    ]
  },
  {
    title: 'Administrativos',
    items: [
      {
        title: 'Perfil de acesso',
        path: '/dashboard/admin/profile',
        icon: <BadgeCheckOutlinedIcon fontSize="small" />
      },
      {
        title: 'Usuário',
        path: '/dashboard/admin/user',
        icon: <UsersIcon fontSize="small" />
      }
    ]
  },
  {
    title: 'Cadastros',
    items: [
      {
        title: 'Imóvel',
        path: '/dashboard/registrations/property',
        icon: <OfficeBuildingIcon fontSize="small" />
      },
      {
        title: 'Característica do imóvel',
        path: '/dashboard/registrations/feature',
        icon: <CollectionIcon fontSize="small" />
      },
      {
        title: 'Tipo de atividade',
        path: '/dashboard/registrations/type-activity',
        icon: <MailOpenIcon fontSize="small" />
      },
      {
        title: 'Locador',
        path: '/dashboard/registrations/locator',
        icon: <UserIcon fontSize="small" />
      },
    ]
  },
  {
    title: 'Processos',
    items: [
      {
        title: 'Formulário de intenção',
        path: '/dashboard/processes/claim-form',
        icon: <NewspaperIcon fontSize="small" />
      },
    ]
  }
];

export const DashboardSidebar = (props) => {
  const { onClose, open } = props;
  const router = useRouter();
  const { t } = useTranslation();
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'), {
    noSsr: true
  });
  const sections = useMemo(() => getSections(t), [t]);
  const { user } = useAuth();

  const handlePathChange = () => {
    if (!router.isReady) {
      return;
    }

    if (open) {
      onClose?.();
    }
  };

  useEffect(handlePathChange,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [router.isReady, router.asPath]);

  const content = (
    <>
      <Scrollbar
        sx={{
          height: '100%',
          '& .simplebar-content': {
            height: '100%'
          }
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%'
          }}
        >
          <div>
            <Box sx={{ p: 3 }}>
              <NextLink
                href="/dashboard"
                passHref
              >
                <a>
                  <Logo
                    sx={{
                      height: 42,
                      width: 42
                    }}
                  />
                </a>
              </NextLink>
            </Box>
            <Box sx={{ px: 2 }}>
              <Box
                sx={{
                  alignItems: 'center',
                  backgroundColor: 'rgba(255, 255, 255, 0.04)',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  px: 3,
                  py: '11px',
                  borderRadius: 1
                }}
              >
                <div>
                  <Typography
                    color="inherit"
                    variant="subtitle1"
                  >
                    {user?.username}
                  </Typography>
                </div>
              </Box>
            </Box>
          </div>
          <Divider
            sx={{
              borderColor: '#2D3748',
              my: 3
            }}
          />
          <Box sx={{ flexGrow: 1 }}>
            {sections.map((section) => (
              <DashboardSidebarSection
                key={section.title}
                path={router.asPath}
                sx={{
                  mt: 2,
                  '& + &': {
                    mt: 2
                  }
                }}
                {...section} />
            ))}
          </Box>
          <Divider
            sx={{
              borderColor: '#2D3748'
            }}
          />
          <Box sx={{ p: 2 }}>
            <Typography
              color="neutral.100"
              variant="subtitle2"
            >
              Precisa de ajuda?
            </Typography>
            <Typography
              color="neutral.500"
              variant="body2"
            >
              Entre em contato com nossa equipe de suporte.
            </Typography>
            <NextLink
              href="https://chiste-systems.atlassian.net/servicedesk/customer/portal/1"
              passHref
            >
              <Button
                color="secondary"
                component="a"
                fullWidth
                sx={{ mt: 2 }}
                variant="contained"
                target="_blank"
                rel="noopener noreferrer"
              >
                Abrir chamado
              </Button>
            </NextLink>
          </Box>
        </Box>
      </Scrollbar>
    </>
  );

  if (lgUp) {
    return (
      <Drawer
        anchor="left"
        open
        PaperProps={{
          sx: {
            backgroundColor: 'neutral.900',
            borderRightColor: 'divider',
            borderRightStyle: 'solid',
            borderRightWidth: (theme) => theme.palette.mode === 'dark' ? 1 : 0,
            color: '#FFFFFF',
            width: 280
          }
        }}
        variant="permanent"
      >
        {content}
      </Drawer>
    );
  }

  return (
    <Drawer
      anchor="left"
      onClose={onClose}
      open={open}
      PaperProps={{
        sx: {
          backgroundColor: 'neutral.900',
          color: '#FFFFFF',
          width: 280
        }
      }}
      sx={{ zIndex: (theme) => theme.zIndex.appBar + 100 }}
      variant="temporary"
    >
      {content}
    </Drawer>
  );
};

DashboardSidebar.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool
};
