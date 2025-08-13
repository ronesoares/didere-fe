import PropTypes from 'prop-types';
import { Box, Button, Card, Chip, Typography } from '@mui/material';

export const OverviewBanner = (props) => {
  const { onDismiss, isMainPage, ...other } = props;

  return (
    <Card
      sx={{
        alignItems: 'center',
        backgroundColor: 'primary.main',
        color: 'primary.contrastText',
        display: 'flex',
        flexDirection: {
          xs: 'column',
          md: 'row'
        },
        p: 4
      }}
      {...other}>
      <Box
        sx={{
          mr: 4,
          width: 200,
          height: 200,
          '& img': {
            height: 200,
            width: 'auto'
          }
        }}
      >
        <img
          alt=""
          src="/static/banner-illustration.png"
        />
      </Box>
      <div>
        <div>
          <Chip
            color="secondary"
            label="Chisté Systems"
          />
        </div>
        <Typography
          color="inherit"
          sx={{ mt: 2 }}
          variant="h4"
        >
          Seja bem-vindo à Didere!
        </Typography>
        <Typography
          color="inherit"
          sx={{ mt: 1 }}
          variant="subtitle2"
        >
          Seu negócio será aprimorado! <br/><br/> 
          Conectamos quem deseja rentabilizar seu espaço a quem procura uma solução imobiliária acessível e eficiente.
        </Typography>
        <Box 
          sx={{ mt: 2 }} 
          hidden={isMainPage}
        >
          <Button
            color="secondary"
            onClick={onDismiss}
            variant="contained"
          >
            Não mostrar novamente
          </Button>
        </Box>
      </div>
    </Card>
  );
};

OverviewBanner.propTypes = {
  onDismiss: PropTypes.func,
  isMainPage: PropTypes.bool
};
