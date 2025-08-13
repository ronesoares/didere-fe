import { Box, Card, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Chart } from '../../chart';
import PropTypes from 'prop-types';

export const OverviewUsuariosCadastrados = (props) => {
  const { cadastrosusuariototal, cadastrosusuarioutilizado, percentualutilizado, ...other } = props;
  const theme = useTheme();

  const descricaoDoPlano = () => {
    let descricao = 'Seu plano permite ';
    
    if (cadastrosusuariototal == 0) {
      descricao += 'usuários ilimitados';
    }
    else {
      descricao += `até ${cadastrosusuariototal} usuários`;
    }

    return descricao;
  }

  const chartOptions = {
    chart: {
      background: 'transparent',
      stacked: false,
      toolbar: {
        show: false
      }
    },
    colors: [theme.palette.secondary.light],
    fill: {
      opacity: 1
    },
    labels: [],
    plotOptions: {
      radialBar: {
        dataLabels: {
          show: false
        },
        hollow: {
          size: '40%'
        },
        track: {
          background: theme.palette.secondary.dark
        }
      }
    },
    theme: {
      mode: theme.palette.mode
    }
  };

  const chartSeries = [percentualutilizado];

  return (
    <Card {...props}>
      <Box
        sx={{
          alignItems: {
            sm: 'center',
            xs: 'center'
          },
          display: 'flex',
          flexDirection: {
            xs: 'row',
            sm: 'row'
          }
        }}
      >
        <Chart
          height={160}
          options={chartOptions}
          series={chartSeries}
          type="radialBar"
          width={160}
        />
        <Box
          sx={{
            display: 'flex',
            flexGrow: 1,
            pt: {
              sm: 3
            },
            pb: 3,
            pr: 4,
            pl: {
              xs: 4,
              sm: 0
            }
          }}
        >
          <Box
            sx={{
              flexGrow: 1,
              mr: 3
            }}
          >
            <Typography
              color="primary"
              variant="h4"
            >
              {cadastrosusuarioutilizado}
            </Typography>
            <Typography
              color="textSecondary"
              sx={{ mt: 1 }}
              variant="body2"
            >
              {descricaoDoPlano()}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Card>
  );
};

OverviewUsuariosCadastrados.propTypes = {
  cadastrosusuariototal: PropTypes.number,
  cadastrosusuarioutilizado: PropTypes.number,
  percentualutilizado: PropTypes.number
};

OverviewUsuariosCadastrados.defaultProps = {
  cadastrosusuariototal: 0,
  cadastrosusuarioutilizado: 0,
  percentualutilizado: 0
};