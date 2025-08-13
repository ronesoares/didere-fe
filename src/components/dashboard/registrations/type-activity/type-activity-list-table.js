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
  TableRow
} from '@mui/material';
import { Trash as TrashRightIcon } from '../../../../icons/trash';
import { PencilAlt as PencilAltIcon } from '../../../../icons/pencil-alt';
import { getInitials } from '../../../../utils/get-initials';
import { Scrollbar } from '../../../scrollbar';
import { DialogWarning } from '../../../dialog-warning';
import { useTranslation } from 'react-i18next';

export const TypeActivityListTable = (props) => {
  const {
    typeActivities: initialTypeActivities,
    typeActivitiesCount,
    onPageChange,
    onRowsPerPageChange,
    page,
    rowsPerPage,
    onDelete,
    ...other
  } = props;
  const [typeActivities, setTypeActivities] = useState(initialTypeActivities);
  const [openDialogDelete, setOpenDialogDelete] = useState(0);
  const { t } = useTranslation();

  useEffect(() => {
    setTypeActivities(initialTypeActivities);
  }, [initialTypeActivities]);

  return (
    <div {...other}>
      <Scrollbar>
        <Table sx={{ minWidth: 700 }}>
          <TableHead>
            <TableRow>
              <TableCell>
                {t('Nome')}
              </TableCell>
              <TableCell align="right">
                {t('Ações')}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {typeActivities.map((typeActivity) => {
              return (
                <TableRow
                  hover
                  key={typeActivity.id}
                >
                  <TableCell>
                    <Box
                      sx={{
                        alignItems: 'center',
                        display: 'flex'
                      }}
                    >
                      <Avatar
                        src={typeActivity.avatar}
                        sx={{
                          height: 42,
                          width: 42
                        }}
                      >
                        {getInitials(typeActivity.name)}
                      </Avatar>
                      <Box sx={{ ml: 1 }}>
                        <NextLink
                          href={`/dashboard/registrations/type-activity/${typeActivity.id}`}
                          passHref
                        >
                          <Link
                            color="inherit"
                            variant="subtitle2"
                          >
                            {typeActivity.name}
                          </Link>
                        </NextLink>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell align="right">
                    <NextLink
                      href={`/dashboard/registrations/type-activity/${typeActivity.id}`}
                      passHref
                    >
                      <IconButton component="a">
                        <PencilAltIcon fontSize="small" />
                      </IconButton>
                    </NextLink>
                    <NextLink
                      href="/dashboard/registrations/type-activity"
                      passHref
                    >
                      <IconButton component="a" onClick={() => {setOpenDialogDelete(typeActivity.id)}} >
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
        count={typeActivitiesCount}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />
      <DialogWarning
        title={t('Excluir tipo de atividade')}
        description={t('Deseja realmente excluir este tipo de atividade?')}
        cancelButton={t('Cancelar')}
        okButton={t('Excluir')}
        onSubmitOk={() => { onDelete(openDialogDelete); setOpenDialogDelete(0); }}
        onSubmitCancel={() => {setOpenDialogDelete(0)}}
        open={openDialogDelete != 0}
      />
    </div>
  );
};

TypeActivityListTable.propTypes = {
  typeActivities: PropTypes.array.isRequired,
  typeActivitiesCount: PropTypes.number.isRequired,
  onPageChange: PropTypes.func,
  onRowsPerPageChange: PropTypes.func,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
  onDelete: PropTypes.func.isRequired
};