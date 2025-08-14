import { useState } from 'react';
import {
  Box,
  Container,
  Divider,
  Grid,
  Link,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
  IconButton
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import { MinusOutlined as MinusOutlinedIcon } from '../icons/minus-outlined';
import { Logo } from './logo';
import { ClaimFormModal } from '../components/search/property/claim-form-modal';
import DateBR from '../utils/date-br';

const sections = [
  {
    title: 'Menu',
    links: [
      {
        title: 'Espaços disponíveis',
        href: '/search/property'
      },
      {
        title: 'Cadastrar meu espaço',
        href: '#',
        isModal: true
      },
      {
        title: 'Login',
        href: '/authentication/login'
      }
    ]
  },
  {
    title: 'Institucional',
    links: [
      {
        title: 'Política de privacidade - LGPD',
        href: '/authentication/lgpd'
      },
      {
        title: 'Contato',
        href: 'https://chiste.systems/#contatos',
        external: true
      }
    ]
  }
];

const getYearNow = () => {
  const now = new DateBR().toUTC3();
  return now.getFullYear();
}

export const Footer = (props) => {
  const [openInterestModal, setOpenInterestModal] = useState(false);

  const handleCloseInterestModal = () => setOpenInterestModal(false);

  const handleLinkClick = (link) => {
    if (link.isModal) {
      setOpenInterestModal(true);
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: 'background.default',
        borderTopColor: 'divider',
        borderTopStyle: 'solid',
        borderTopWidth: 1,
        pb: 6,
        pt: {
          md: 6,
          xs: 6
        }
      }}
      {...props}
    >
      <Container maxWidth="lg">
        <Grid
          container
          spacing={3}
        >
          {/* Logo e redes sociais */}
          <Grid
            item
            md={4}
            sm={4}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              order: {
                md: 1,
                xs: 4
              }
            }}
            xs={12}
          >
            <Logo />
            <Typography
              color="textSecondary"
              sx={{ mt: 1, mb: 2 }}
              variant="body2"
            >
              Conectando espaços e oportunidades
            </Typography>
            
            {/* Redes sociais */}
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton
                component="a"
                href="https://www.instagram.com/didere.oficial"
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  color: 'text.secondary',
                  '&:hover': {
                    color: '#E4405F', // Cor do Instagram
                    backgroundColor: 'rgba(228, 64, 95, 0.1)'
                  }
                }}
              >
                <InstagramIcon />
              </IconButton>
              <IconButton
                component="a"
                href="https://www.facebook.com/people/Didere/61577320444231"
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  color: 'text.secondary',
                  '&:hover': {
                    color: '#1877F2', // Cor do Facebook
                    backgroundColor: 'rgba(24, 119, 242, 0.1)'
                  }
                }}
              >
                <FacebookIcon />
              </IconButton>
            </Box>
          </Grid>
          
          {/* Seções de links */}
          {sections.map((section, index) => (
            <Grid
              item
              key={section.title}
              md={4}
              sm={4}
              sx={{
                order: {
                  md: index + 2,
                  xs: index + 1
                }
              }}
              xs={12}
            >
              <Typography
                color="textSecondary"
                variant="overline"
                sx={{ fontWeight: 'bold' }}
              >
                {section.title}
              </Typography>
              <List disablePadding>
                {section.links.map((link) => (
                  <ListItem
                    disableGutters
                    key={link.title}
                    sx={{
                      pb: 0,
                      pt: 1
                    }}
                  >
                    <ListItemAvatar
                      sx={{
                        alignItems: 'center',
                        display: 'flex',
                        minWidth: 0,
                        mr: 0.5
                      }}
                    >
                      <MinusOutlinedIcon color="primary" />
                    </ListItemAvatar>
                    <ListItemText
                      primary={(
                        <Link
                          href={link.isModal ? '#' : link.href}
                          color="textPrimary"
                          variant="subtitle2"
                          onClick={link.isModal ? () => handleLinkClick(link) : undefined}
                          target={link.external ? '_blank' : undefined}
                          rel={link.external ? 'noopener noreferrer' : undefined}
                          sx={{
                            cursor: 'pointer',
                            '&:hover': {
                              color: 'primary.main'
                            }
                          }}
                        >
                          {link.title}
                        </Link>
                      )}
                    />
                  </ListItem>
                ))}
              </List>
            </Grid>
          ))}
        </Grid>
        
        <Divider
          sx={{
            borderColor: (theme) => alpha(theme.palette.primary.contrastText, 0.12),
            my: 3
          }}
        />
        
        <Box
          sx={{
            display: 'flex',
            flexDirection: {
              xs: 'column',
              md: 'row'
            },
            justifyContent: 'space-between',
            alignItems: {
              xs: 'flex-start',
              md: 'center'
            },
            gap: 2
          }}
        >
          <Typography
            color="textSecondary"
            variant="caption"
          >
            © {getYearNow()} Didere Soluções e Otimização. Todos os direitos reservados.
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Typography
              color="textSecondary"
              variant="caption"
              sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
            >
              Siga-nos:
              <IconButton
                component="a"
                href="https://www.instagram.com/didere.oficial"
                target="_blank"
                rel="noopener noreferrer"
                size="small"
                sx={{ color: 'text.secondary' }}
              >
                <InstagramIcon fontSize="small" />
              </IconButton>
              <IconButton
                component="a"
                href="https://www.facebook.com/people/Didere/61577320444231"
                target="_blank"
                rel="noopener noreferrer"
                size="small"
                sx={{ color: 'text.secondary' }}
              >
                <FacebookIcon fontSize="small" />
              </IconButton>
            </Typography>
          </Box>
        </Box>

        {/* Modal de cadastro */}
        <ClaimFormModal
          open={openInterestModal}
          onClose={handleCloseInterestModal}
          propertyId={0}
          propertyTitle={'Cadastrar meu espaço'}
          source={'Locator'}
        />
      </Container>
    </Box>
  );
};
