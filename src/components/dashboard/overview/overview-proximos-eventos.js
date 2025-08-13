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

export const OverviewProximosEventos = (props) => {
  const { listaproximoseventos, ...other } = props;

  const linkConformeTipoEvento = (tipoEvento, idSolicitacao, idAtaReuniao) => {
    let link = '';

    if (tipoEvento === 'Solicitação') {
      link = `/dashboard/gerenciamento/solicitacoes/${idSolicitacao}`;
    }
    else if (tipoEvento === 'Ata/Reunião') {
      link = `/dashboard/gerenciamento/atas-reuniao/${idAtaReuniao}`;
    }

    return link;
  };

  return (
  <Card {...props}>
    <CardHeader title="Próximos eventos" />
    <Scrollbar>
      <Table sx={{ minWidth: 100 }}>
        <TableHead>
          <TableRow>
            <TableCell>
              Data
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
          {listaproximoseventos.map((evento) => (
            <TableRow
              key={evento.idAgenda}
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
                    {format(new DateBR(evento.data), 'd')}
                  </Typography>
                  <Typography
                    align="center"
                    color="textSecondary"
                    variant="subtitle2"
                  >
                    {format(new DateBR(evento.data), 'LLL').toUpperCase()}
                  </Typography>
                  <Typography
                    align="center"
                    color="textSecondary"
                    variant="h6"
                  >
                    {format(new DateBR(evento.data), 'yyyy')}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell>
                <div>
                  <Typography variant="subtitle2">
                    {evento.tipoEvento}
                  </Typography>
                  <Typography
                    color="textSecondary"
                    variant="body2"
                  >
                    {evento.assunto}
                  </Typography>
                </div>
              </TableCell>
              <TableCell align='right'>
                <NextLink
                  href={linkConformeTipoEvento(evento.tipoEvento, evento.idSolicitacao, evento.idAtaReuniao)}
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

OverviewProximosEventos.propTypes = {
  listaproximoseventos: PropTypes.array
};

OverviewProximosEventos.defaultProps = {
  listaproximoseventos: []
};