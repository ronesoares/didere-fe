import { useState } from 'react';
import PropTypes from 'prop-types';
import NextLink from 'next/link';
import { AppBar, Box, Button, Container, IconButton, Link, Toolbar } from '@mui/material';
import { Menu as MenuIcon } from '../icons/menu';
import { Logo } from './logo';
import { styled } from '@mui/material/styles';
import { ClaimFormModal } from '../components/search/property/claim-form-modal';

const MainNavbarLink = styled(Link)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  display: 'block',
  padding: theme.spacing(1.5),
  '&:hover': {
    backgroundColor: theme.palette.action.hover
  },
  cursor: 'pointer',
}));

export const MainNavbar = (props) => {
  const { onOpenSidebar } = props;
  const [openInterestModal, setOpenInterestModal] = useState(false);

  const handleCloseInterestModal = () => setOpenInterestModal(false);

  return (
    <AppBar
      elevation={0}
      sx={{
        backgroundColor: 'background.paper',
        borderBottomColor: 'divider',
        borderBottomStyle: 'solid',
        borderBottomWidth: 1,
        color: 'text.secondary'
      }}
    >
      <Container maxWidth="lg">
        <Toolbar
          disableGutters
          sx={{ minHeight: 64 }}
        >
          <NextLink
            href="/search/property"
            passHref
          >
            <a>
              <Logo
                sx={{
                  display: {
                    md: 'inline',
                    xs: 'none'
                  },
                  height: 40,
                  width: 40
                }}
              />
            </a>
          </NextLink>
          <Box sx={{ flexGrow: 1 }} />
          <IconButton
            color="inherit"
            onClick={onOpenSidebar}
            sx={{
              display: {
                md: 'none'
              }
            }}
          >
            <MenuIcon fontSize="small" />
          </IconButton>
          <Box
            sx={{
              alignItems: 'center',
              display: {
                md: 'flex',
                xs: 'none'
              }
            }}
          >
            <MainNavbarLink
              color="textSecondary"
              underline="none"
              variant="subtitle2"
              onClick={() => { setOpenInterestModal(true); } }
            >
              Cadastrar meu espaço
            </MainNavbarLink>
            <NextLink
                href="/search/property"
                passHref
            >
              <MainNavbarLink
                color="textSecondary"
                underline="none"
                variant="subtitle2"
              >
                Espaços disponíveis
              </MainNavbarLink>
            </NextLink>
            <Button
              component="a"
              href="/authentication/login"
              size="medium"
              sx={{ ml: 2 }}
              variant="contained"
            >
              Login
            </Button>

            {}
            <ClaimFormModal
              open={openInterestModal}
              onClose={handleCloseInterestModal}
              propertyId={0}
              propertyTitle={'Cadastrar meu espaço'}
              source={'Locator'}
            ></ClaimFormModal>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

MainNavbar.propTypes = {
  onOpenSidebar: PropTypes.func
};
