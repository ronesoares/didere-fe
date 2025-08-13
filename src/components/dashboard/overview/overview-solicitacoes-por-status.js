import numeral from 'numeral';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Chart } from '../../chart';
import PropTypes from 'prop-types';

export const OverviewSolicitacoesPorStatus = (props) => {
  const { qtdsolicitacoesconcluidas, qtdsolicitacoesemandamento, qtdsolicitacoespendentes, qtdsolicitacoescanceladas, ...other } = props;
  const theme = useTheme();

  const data = {
    series: [
      {
        color: '#33BB78',
        category: 'Concluídas',
        data: qtdsolicitacoesconcluidas
      },
      {
        color: '#7783DB',
        category: 'Em Andamento',
        data: qtdsolicitacoesemandamento
      },
      {
        color: '#FFB547',
        category: 'Pendentes',
        data: qtdsolicitacoespendentes
      },
      {
        color: '#F44336',
        category: 'Canceladas',
        data: qtdsolicitacoescanceladas
      }
    ]
  };

  const chartOptions = {
    chart: {
      background: 'transparent',
      stacked: false,
      toolbar: {
        show: false
      }
    },
    colors: data.series.map((item) => item.color),
    dataLabels: {
      enabled: false
    },
    fill: {
      opacity: 1
    },
    grid: {
      borderColor: theme.palette.divider,
      yaxis: {
        lines: {
          show: true
        }
      },
      xaxis: {
        lines: {
          show: true
        }
      }
    },
    legend: {
      show: false
    },
    plotOptions: {
      bar: {
        horizontal: true,
        barHeight: '45',
        distributed: true
      }
    },
    theme: {
      mode: theme.palette.mode
    },
    xaxis: {
      axisBorder: {
        color: theme.palette.divider,
        show: true
      },
      axisTicks: {
        color: theme.palette.divider,
        show: true
      },
      categories: data.series.map((item) => item.category)
    },
    yaxis: {
      labels: {
        show: false
      }
    }
  };

  const chartSeries = [
    {
      data: data.series.map((item) => item.data),
      name: 'Solicitações'
    }
  ];

  return (
    <Card {...props}>
      <CardHeader title="Solicitações por Status" />
      <Divider />
      <CardContent>
        <Chart
          height={350}
          options={chartOptions}
          series={chartSeries}
          type="bar"
        />
      </CardContent>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              Status
            </TableCell>
            <TableCell align="right">
              Quantidade
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.series.map((item) => (
            <TableRow key={item.category}>
              <TableCell>
                <Box
                  key={item.category}
                  sx={{
                    alignItems: 'center',
                    display: 'flex'
                  }}
                >
                  <Box
                    sx={{
                      border: 3,
                      borderColor: item.color,
                      borderRadius: '50%',
                      height: 16,
                      mr: 1,
                      width: 16
                    }}
                  />
                  <Typography variant="subtitle2">
                    {item.category}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell align="right">
                <Typography
                  color="textSecondary"
                  variant="body2"
                >
                  {numeral(item.data).format('0')}
                </Typography>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};

OverviewSolicitacoesPorStatus.propTypes = {
  qtdsolicitacoescanceladas: PropTypes.number,
  qtdsolicitacoesconcluidas: PropTypes.number,
  qtdsolicitacoesemandamento: PropTypes.number,
  qtdsolicitacoespendentes: PropTypes.number
};

OverviewSolicitacoesPorStatus.defaultProps = {
  qtdsolicitacoescanceladas: 0,
  qtdsolicitacoesconcluidas: 0,
  qtdsolicitacoesemandamento: 0,
  qtdsolicitacoespendentes: 0
};