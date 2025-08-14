import { useState } from 'react';
import PropTypes from 'prop-types';
import NextLink from 'next/link';
import { AppBar, Box, Button, Container, IconButton, Link, Toolbar, Typography } from '@mui/material';
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
  textDecoration: 'none',
  transition: 'all 0.2s ease-in-out',
  fontWeight: 500
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
          {/* Logo e nome */}
          <NextLink
            href="/"
            passHref
          >
            <Link
              sx={{
                display: 'flex',
                alignItems: 'center',
                textDecoration: 'none',
                color: 'inherit'
              }}
            >
              <Logo
                sx={{
                  display: {
                    md: 'inline',
                    xs: 'none'
                  },
                  height: 40,
                  width: 40,
                  mr: 1
                }}
              />
              <Typography
                variant="h6"
                component="div"
                sx={{
                  fontWeight: 'bold',
                  color: 'primary.main',
                  display: {
                    md: 'block',
                    xs: 'none'
                  }
                }}
              >
                Didere
              </Typography>
            </Link>
          </NextLink>
          
          <Box sx={{ flexGrow: 1 }} />
          
          {/* Menu mobile */}
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
          
          {/* Menu desktop */}
          <Box
            sx={{
              alignItems: 'center',
              display: {
                md: 'flex',
                xs: 'none'
              },
              gap: 1
            }}
          >
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
            
            <MainNavbarLink
              color="textSecondary"
              underline="none"
              variant="subtitle2"
              onClick={() => { setOpenInterestModal(true); }}
            >
              Cadastrar meu espaço
            </MainNavbarLink>
            
            <Button
              component="a"
              href="/authentication/login"
              size="medium"
              sx={{ 
                ml: 2,
                px: 3,
                py: 1,
                fontWeight: 'bold'
              }}
              variant="contained"
              color="primary"
            >
              Login
            </Button>

            {/* Modal de cadastro */}
            <ClaimFormModal
              open={openInterestModal}
              onClose={handleCloseInterestModal}
              propertyId={0}
              propertyTitle={'Cadastrar meu espaço'}
              source={'Locator'}
            />
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

MainNavbar.propTypes = {
  onOpenSidebar: PropTypes.func
};
