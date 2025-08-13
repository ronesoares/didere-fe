import { useEffect, useState } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import { Box, Button, Drawer, Link, useMediaQuery } from '@mui/material';
import { styled } from '@mui/material/styles';
import { ClaimFormModal } from '../components/search/property/claim-form-modal';

const MainSidebarLink = styled(Link)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  display: 'block',
  padding: theme.spacing(1.5),
  '&:hover': {
    backgroundColor: theme.palette.action.hover
  },
  cursor: 'pointer',
}));

export const MainSidebar = (props) => {
  const { onClose, open } = props;
  const router = useRouter();
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'));
  const [openInterestModal, setOpenInterestModal] = useState(false);

  const handlePathChange = () => {
    if (open) {
      onClose?.();
    }
  };

  useEffect(handlePathChange,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [router.asPath]);

  const handleCloseInterestModal = () => setOpenInterestModal(false);

  return (
    <Drawer
      anchor="right"
      onClose={onClose}
      open={!lgUp && open}
      PaperProps={{ sx: { width: 256 } }}
      sx={{
        zIndex: (theme) => theme.zIndex.appBar + 100
      }}
      variant="temporary"
    >
      <Box sx={{ p: 2 }}>
        <MainSidebarLink
          color="textSecondary"
          underline="none"
          variant="subtitle2"
          onClick={() => { setOpenInterestModal(true); } }
        >
          Cadastrar meu espaço
        </MainSidebarLink>
        <NextLink
          href="/search/property"
          passHref
        >
          <MainSidebarLink
            color="textSecondary"
            underline="none"
            variant="subtitle2"
          >
            Espaços disponíveis
          </MainSidebarLink>
        </NextLink>
        <Button
          component="a"
          fullWidth
          href="/authentication/login"
          sx={{ mt: 1.5 }}
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
    </Drawer>
  );
};

MainSidebar.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool
};
