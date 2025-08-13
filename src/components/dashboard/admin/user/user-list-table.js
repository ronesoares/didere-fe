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

export const UserListTable = (props) => {
  const {
    users: initialUsers,
    usersCount,
    onPageChange,
    onRowsPerPageChange,
    page,
    rowsPerPage,
    onDelete,
    ...other
  } = props;
  const [users, setUsers] = useState(initialUsers);
  const [openDialogDelete, setOpenDialogDelete] = useState(0);

  useEffect(() => {
    setUsers(initialUsers);
  }, [initialUsers]);

  return (
    <div {...other}>
      <Scrollbar>
        <Table sx={{ minWidth: 700 }}>
          <TableHead>
            <TableRow>
              <TableCell>
                Nome
              </TableCell>
              <TableCell>
                Login
              </TableCell>
              <TableCell align="right">
                Ações
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => {
              return (
                <TableRow
                  hover
                  key={user.id}
                >
                  <TableCell>
                    <Box
                      sx={{
                        alignItems: 'center',
                        display: 'flex'
                      }}
                    >
                      <Avatar
                        src={user.avatar}
                        sx={{
                          height: 42,
                          width: 42
                        }}
                      >
                        {getInitials(user.name)}
                      </Avatar>
                      <Box sx={{ ml: 1 }}>
                        <NextLink
                          href={`/dashboard/admin/user/${user.id}`}
                          passHref
                        >
                          <Link
                            color="inherit"
                            variant="subtitle2"
                          >
                            {user.name}
                          </Link>
                        </NextLink>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    {user.login}
                  </TableCell>
                  <TableCell align="right">
                    <NextLink
                      href={`/dashboard/admin/user/${user.id}`}
                      passHref
                    >
                      <IconButton component="a">
                        <PencilAltIcon fontSize="small" />
                      </IconButton>
                    </NextLink>
                    <NextLink
                      href="/dashboard/admin/user"
                      passHref
                    >
                      <IconButton component="a" onClick={() => {setOpenDialogDelete(user.id)}} >
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
        count={usersCount}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />
      <DialogWarning
        title="Excluir usuário"
        description="Deseja realmente excluir este usuário?"
        cancelButton="Cancelar"
        okButton="Excluir"
        onSubmitOk={() => { onDelete(openDialogDelete); setOpenDialogDelete(0); }}
        onSubmitCancel={() => {setOpenDialogDelete(0)}}
        open={openDialogDelete != 0}
      />
    </div>
  );
};

UserListTable.propTypes = {
  users: PropTypes.array.isRequired,
  usersCount: PropTypes.number.isRequired,
  onPageChange: PropTypes.func,
  onRowsPerPageChange: PropTypes.func,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
  onDelete: PropTypes.func.isRequired
};