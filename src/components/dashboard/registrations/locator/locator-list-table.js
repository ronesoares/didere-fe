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
import { Scrollbar } from '../../../scrollbar';
import { DialogWarning } from '../../../dialog-warning';
import { useTranslation } from 'react-i18next';

export const LocatorListTable = (props) => {
  const {
    locators: initialLocators,
    locatorsCount,
    onPageChange,
    onRowsPerPageChange,
    page,
    rowsPerPage,
    onDelete,
    ...other
  } = props;
  const [locators, setLocators] = useState(initialLocators);
  const [openDialogDelete, setOpenDialogDelete] = useState(0);
  const { t } = useTranslation();

  useEffect(() => {
    setLocators(initialLocators);
  }, [initialLocators]);

  return (
    <div {...other}>
      <Scrollbar>
        <Table sx={{ minWidth: 700 }}>
          <TableHead>
            <TableRow>
              <TableCell>
                {t('Nome')}
              </TableCell>
              <TableCell>
                {t('Email')}
              </TableCell>
              <TableCell>
                {t('Telefone')}
              </TableCell>
              <TableCell align="right">
                {t('Ações')}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {locators.map((locator) => {
              return (
                <TableRow
                  hover
                  key={locator.id}
                >
                  <TableCell>
                    <Box
                      sx={{
                        alignItems: 'center',
                        display: 'flex'
                      }}
                    >
                      <Avatar
                        src={locator.avatar}
                        sx={{
                          height: 42,
                          width: 42
                        }}
                      >
                        {getInitials(locator.name)}
                      </Avatar>
                      <Box sx={{ ml: 1 }}>
                        <NextLink
                          href={`/dashboard/registrations/locator/${locator.id}`}
                          passHref
                        >
                          <Link
                            color="inherit"
                            variant="subtitle2"
                          >
                            {locator.name}
                          </Link>
                        </NextLink>
                        <Typography
                          color="textSecondary"
                          variant="body2"
                        >
                          {locator.nickname}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    {locator.email}
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
                          {locator.phoneOption1}
                        </Typography>
                        <Typography
                          color="textSecondary"
                          variant="body2"
                        >
                          {locator.phoneOption2}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell align="right">
                    <NextLink
                      href={`/dashboard/registrations/locator/${locator.id}`}
                      passHref
                    >
                      <IconButton component="a">
                        <PencilAltIcon fontSize="small" />
                      </IconButton>
                    </NextLink>
                    <NextLink
                      href="/dashboard/registrations/locator"
                      passHref
                    >
                      <IconButton component="a" onClick={() => {setOpenDialogDelete(locator.id)}} >
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
        count={locatorsCount}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />
      <DialogWarning
        title={t('Excluir locador')}
        description={t('Deseja realmente excluir esta locador?')}
        cancelButton={t('Cancelar')}
        okButton={t('Excluir')}
        onSubmitOk={() => { onDelete(openDialogDelete); setOpenDialogDelete(0); }}
        onSubmitCancel={() => {setOpenDialogDelete(0)}}
        open={openDialogDelete != 0}
      />
    </div>
  );
};

LocatorListTable.propTypes = {
  locators: PropTypes.array.isRequired,
  locatorsCount: PropTypes.number.isRequired,
  onPageChange: PropTypes.func,
  onRowsPerPageChange: PropTypes.func,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
  onDelete: PropTypes.func.isRequired
};