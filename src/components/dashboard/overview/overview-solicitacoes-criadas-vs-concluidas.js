import { Card, CardContent, CardHeader, Divider } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Chart } from '../../chart';
import PropTypes from 'prop-types';

export const OverviewSolicitacoesCriadasVsConcluidas = (props) => {
  const { listamesano, ...other } = props;
  const theme = useTheme();

  const chartOptions = {
    chart: {
      background: 'transparent',
      stacked: false,
      toolbar: {
        show: false
      }
    },
    colors: ['#2F3EB1', '#6E7AD8'],
    dataLabels: {
      enabled: false
    },
    fill: {
      opacity: 1,
      type: 'solid'
    },
    grid: {
      borderColor: theme.palette.divider
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
      categories: listamesano.map((item) => item.mes.toString().padStart(2, '0') + '/' + item.ano.toString().slice(-2))
    }
  };

  const chartSeries = [
    {
      name: 'Criadas',
      data: listamesano.map((item) => item.qtdSolicitacoesCriadas)
    },
    {
      name: 'Concluídas',
      data: listamesano.map((item) => item.qtdSolicitacoesConcluidas)
    }
  ];

  return (
    <Card {...props}>
      <CardHeader title="Solicitações criadas vs concluídas" />
      <Divider />
      <CardContent>
        <Chart
          height={605}
          options={chartOptions}
          series={chartSeries}
          type="area"
        />
      </CardContent>
    </Card>
  );
};

OverviewSolicitacoesCriadasVsConcluidas.propTypes = {
    listamesano: PropTypes.array
};
  
OverviewSolicitacoesCriadasVsConcluidas.defaultProps = {
    listamesano: []
};