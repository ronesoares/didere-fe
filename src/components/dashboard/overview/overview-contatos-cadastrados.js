import { Box, Card, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Chart } from '../../chart';
import PropTypes from 'prop-types';

export const OverviewContatosCadastrados = (props) => {
  const { cadastroscontatostotal, cadastroscontatosutilizado, percentualutilizado, ...other } = props;
  const theme = useTheme();

  const descricaoDoPlano = () => {
    let descricao = 'Seu plano permite ';
    
    if (cadastroscontatostotal == 0) {
      descricao += 'contatos ilimitados';
    }
    else {
      descricao += `até ${cadastroscontatostotal} contatos`;
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
    colors: [theme.palette.primary.light],
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
          background: theme.palette.primary.dark
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
              {cadastroscontatosutilizado}
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

OverviewContatosCadastrados.propTypes = {
  cadastroscontatostotal: PropTypes.number,
  cadastroscontatosutilizado: PropTypes.number,
  percentualutilizado: PropTypes.number
};

OverviewContatosCadastrados.defaultProps = {
  cadastroscontatostotal: 0,
  cadastroscontatosutilizado: 0,
  percentualutilizado: 0
};