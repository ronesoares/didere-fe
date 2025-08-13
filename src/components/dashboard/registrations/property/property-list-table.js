import { useEffect, useState } from 'react';
import NextLink from 'next/link';
import PropTypes from 'prop-types';
import {
  Avatar,
  Box,
  IconButton,
  Link,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography
} from '@mui/material';
import { Trash as TrashRightIcon } from '../../../../icons/trash';
import { PencilAlt as PencilAltIcon } from '../../../../icons/pencil-alt';
import { getInitials } from '../../../../utils/get-initials';
import { limitText } from '../../../../utils/limit-text';
import { Scrollbar } from '../../../scrollbar';
import { DialogWarning } from '../../../dialog-warning';
import { useTranslation } from 'react-i18next';

export const PropertyListTable = (props) => {
  const {
    properties: initialProperties,
    propertiesCount,
    onPageChange,
    onRowsPerPageChange,
    page,
    rowsPerPage,
    onDelete,
    ...other
  } = props;
  const [properties, setProperties] = useState(initialProperties);
  const [openDialogDelete, setOpenDialogDelete] = useState(0);
  const { t } = useTranslation();

  useEffect(() => {
    setProperties(initialProperties);
  }, [initialProperties]);

  return (
    <div {...other}>
      <Scrollbar>
        <Table sx={{ minWidth: 700 }}>
          <TableHead>
            <TableRow>
              <TableCell>
                {t('Título')}
              </TableCell>
              <TableCell>
                {t('Localização')}
              </TableCell>
              <TableCell>
                {t('Características')}
              </TableCell>
              <TableCell>
                {t('Tipos de atividades')}
              </TableCell>
              <TableCell align="right">
                {t('Ações')}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {properties.map((property) => {
              return (
                <TableRow
                  hover
                  key={property.id}
                >
                  <TableCell>
                    <Box
                      sx={{
                        alignItems: 'center',
                        display: 'flex'
                      }}
                    >
                      <Avatar
                        src={property.photo}
                        sx={{
                          height: 42,
                          width: 42
                        }}
                      >
                        {getInitials(property.title)}
                      </Avatar>
                      <Box sx={{ ml: 1 }}>
                        <NextLink
                          href={`/dashboard/registrations/property/${property.id}`}
                          passHref
                        >
                          <Link
                            color="inherit"
                            variant="subtitle2"
                          >
                            {property.title}
                          </Link>
                        </NextLink>
                        <Typography
                          color="textSecondary"
                          variant="body2"
                        >
                          {limitText(property.description, 10)}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box
                      sx={{
                        alignItems: 'center',
                        display: 'flex'
                      }}
                    >
                      <Box sx={{ ml: 1 }}>
                        <Typography
                          color="inherit"
                          variant="subtitle2"
                        >
                          {property.city}
                        </Typography>
                        <Typography
                          color="textSecondary"
                          variant="body2"
                        >
                          {property.neighborhood}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    {property.features}
                  </TableCell>
                  <TableCell>
                    {property.typeActivities}
                  </TableCell>
                  <TableCell align="right">
                    <NextLink
                      href={`/dashboard/registrations/property/${property.id}`}
                      passHref
                    >
                      <IconButton component="a">
                        <PencilAltIcon fontSize="small" />
                      </IconButton>
                    </NextLink>
                    <NextLink
                      href="/dashboard/registrations/property"
                      passHref
                    >
                      <IconButton component="a" onClick={() => {setOpenDialogDelete(property.id)}} >
                        <TrashRightIcon fontSize="small" />
                      </IconButton>
                    </NextLink>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Scrollbar>
      <TablePagination
        component="div"
        count={propertiesCount}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />
      <DialogWarning
        title={t('Excluir imóvel')}
        description={t('Deseja realmente excluir esta imóvel?')}
        cancelButton={t('Cancelar')}
        okButton={t('Excluir')}
        onSubmitOk={() => { onDelete(openDialogDelete); setOpenDialogDelete(0); }}
        onSubmitCancel={() => {setOpenDialogDelete(0)}}
        open={openDialogDelete != 0}
      />
    </div>
  );
};

PropertyListTable.propTypes = {
  properties: PropTypes.array.isRequired,
  propertiesCount: PropTypes.number.isRequired,
  onPageChange: PropTypes.func,
  onRowsPerPageChange: PropTypes.func,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
  onDelete: PropTypes.func.isRequired
};