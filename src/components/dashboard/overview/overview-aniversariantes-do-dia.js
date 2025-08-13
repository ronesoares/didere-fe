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

export const OverviewAniversariantesDoDia = (props) => {
  const { listaaniversariantes, ...other } = props;

  const formatCellNumber = (telefone) => {
    const cleaned = ('' + telefone).replace(/\D/g, '');  
    const match = cleaned.match(/^(\d{2})(\d{5})(\d{4})$/);
  
    if (match) {
      return '(' + match[1] + ') ' + match[2] + '-' + match[3]
    };
  
    return null
  };

  return (
  <Card {...props}>
    <CardHeader title="Aniversariantes do dia" />
    <Scrollbar>
      <Table sx={{ minWidth: 100 }}>
        <TableHead>
          <TableRow>
            <TableCell>
              Idade
            </TableCell>
            <TableCell>
              Nome
            </TableCell>
            <TableCell>
              Profissão
            </TableCell>
            <TableCell>
              Telefone
            </TableCell>
            <TableCell>
              Ações
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {listaaniversariantes.map((aniversariante) => (
            <TableRow
              key={aniversariante.idContato}
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
                    {aniversariante.idade}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell>
                <div>
                  <Typography variant="subtitle2">
                    {aniversariante.nome}
                  </Typography>
                  <Typography
                    color="textSecondary"
                    variant="body2"
                  >
                    {aniversariante.apelido}
                  </Typography>
                </div>
              </TableCell>
              <TableCell>
                {aniversariante.profissao}
              </TableCell>
              <TableCell>
                {formatCellNumber(aniversariante.telefone)}
              </TableCell>
              <TableCell align='right'>
                <NextLink
                  href={`/dashboard/cadastros-gerais/pessoas/contatos/${aniversariante.idContato}`}
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

OverviewAniversariantesDoDia.propTypes = {
  listaaniversariantes: PropTypes.array
};

OverviewAniversariantesDoDia.defaultProps = {
  listaaniversariantes: []
};