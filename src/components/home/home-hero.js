import { useState } from 'react';
import NextLink from 'next/link';
import { Box, Button, Container, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { OverviewBanner } from '../dashboard/overview/overview-banner';
import { ClaimFormModal } from '../../components/search/property/claim-form-modal';

export const HomeHero = (props) => {
  const [openInterestModal, setOpenInterestModal] = useState(false);
  const theme = useTheme();

  const handleCloseInterestModal = () => setOpenInterestModal(false);

  return (
    <Box
      sx={{
        backgroundColor: 'background.paper',
        pt: 6
      }}
      {...props}>
      <Container
        maxWidth="md"
        sx={{
          alignItems: 'center',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <OverviewBanner 
          onDismiss={() => {}}
          isMainPage={true} 
        />
        <Box
          sx={{
            alignItems: {
              sm: 'center',
              xs: 'flex-start'
            },
            display: 'flex',
            flexDirection: {
              sm: 'row',
              xs: 'column'
            },
            py: 3,
            m: -1,
            '& > *': {
              m: 1
            }
          }}
        >
          <Typography
            variant="h5"
            align='center'
          >
            Na Didere, acreditamos que o espaço certo pode transformar o seu negócio. Somos especialistas em conectar quem deseja rentabilizar seus imóveis a pessoas e empresas que buscam soluções imobiliárias acessíveis, práticas e inteligentes.
          </Typography>
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            mx: -1,
            mt: 2,
            mb: 6,
            '& > a': {
              m: 1
            }
          }}
        >
          <Button
            component="a"
            size="large"
            variant="outlined"
            onClick={() => { setOpenInterestModal(true); } }
          >
            Cadastrar meu espaço
          </Button>
          <NextLink
            href="/search/property"
            passHref
          >
            <Button
              component="a"
              size="large"
              variant="outlined"
            >
              Espaços disponíveis
            </Button>
          </NextLink>
          <NextLink
            href="/authentication/login"
            passHref
          >
            <Button
              component="a"
              size="large"
              variant="contained"
            >
              Login
            </Button>
          </NextLink>

          {}
          <ClaimFormModal
              open={openInterestModal}
              onClose={handleCloseInterestModal}
              propertyId={0}
              propertyTitle={'Cadastrar meu espaço'}
              source={'Locator'}
          ></ClaimFormModal>
        </Box>
      </Container>
      <Box
        sx={{
          maxWidth: 980,
          width: '100%',
          mx: 'auto'
        }}
      >
        <Box
          sx={{
            position: 'relative',
            pt: 'calc(600 / 980 * 100%)',
            '& img': {
              height: 'auto',
              position: 'absolute',
              top: 0,
              width: '100%'
            }
          }}
        >
          <img
            alt=""
            src={`/static/home/sistema.png`}
          />
        </Box>
      </Box>
    </Box>
  );
};
