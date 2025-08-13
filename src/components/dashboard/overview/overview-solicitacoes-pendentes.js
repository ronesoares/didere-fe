import { format } from 'date-fns';
import {
  Box,
  Card,
  CardHeader,
  IconButton,
  Table,
  TableBody,
  TableHead,
  TableCell,
  TableRow,
  Typography
} from '@mui/material';
import { Scrollbar } from '../../scrollbar';
import PropTypes from 'prop-types';
import NextLink from 'next/link';
import { PencilAlt as PencilAltIcon } from '../../../icons/pencil-alt';
import DateBR from '../../../utils/date-br';

export const OverviewSolicitacoesPendentes = (props) => {
  const { listasolicitacoespendentes, ...other } = props;

  return (
  <Card {...props}>
    <CardHeader title="Solicitações pendentes" />
    <Scrollbar>
      <Table sx={{ minWidth: 100 }}>
        <TableHead>
          <TableRow>
            <TableCell>
              Previsão
            </TableCell>
            <TableCell>
              Tipo / Assunto
            </TableCell>
            <TableCell>
              Ações
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {listasolicitacoespendentes.map((solicitacao) => (
            <TableRow
              key={solicitacao.idSolicitacao}
              sx={{
                '&:last-child td': {
                  border: 0
                }
              }}
            >
              <TableCell width={100}>
                <Box
                  sx={{
                    p: 1,
                    backgroundColor: (theme) => theme.palette.mode === 'dark'
                      ? 'neutral.800'
                      : 'neutral.200',
                    borderRadius: 2,
                    maxWidth: 'fit-content'
                  }}
                >
                  <Typography
                    align="center"
                    color="textSecondary"
                    variant="h6"
                  >
                    {format(new DateBR(solicitacao.data), 'd')}
                  </Typography>
                  <Typography
                    align="center"
                    color="textSecondary"
                    variant="subtitle2"
                  >
                    {format(new DateBR(solicitacao.data), 'LLL').toUpperCase()}
                  </Typography>
                  <Typography
                    align="center"
                    color="textSecondary"
                    variant="h6"
                  >
                    {format(new DateBR(solicitacao.data), 'yyyy')}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell>
                <div>
                  <Typography variant="subtitle2">
                    {solicitacao.tipo}
                  </Typography>
                  <Typography
                    color="textSecondary"
                    variant="body2"
                  >
                    {solicitacao.assunto}
                  </Typography>
                </div>
              </TableCell>
              <TableCell align='right'>
                <NextLink
                  href={`/dashboard/gerenciamento/solicitacoes/${solicitacao.idSolicitacao}`}
                  passHref
                >
                  <IconButton component="a">
                    <PencilAltIcon fontSize="small" />
                  </IconButton>
                </NextLink>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Scrollbar>
  </Card>
  );
};

OverviewSolicitacoesPendentes.propTypes = {
  listasolicitacoespendentes: PropTypes.array
};

OverviewSolicitacoesPendentes.defaultProps = {
  listasolicitacoespendentes: []
};