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

export const ProfileListTable = (props) => {
  const {
    profiles: initialProfiles,
    profilesCount,
    onPageChange,
    onRowsPerPageChange,
    page,
    rowsPerPage,
    onDelete,
    ...other
  } = props;
  const [profiles, setProfiles] = useState(initialProfiles);
  const [openDialogDelete, setOpenDialogDelete] = useState(0);

  useEffect(() => {
    setProfiles(initialProfiles);
  }, [initialProfiles]);

  return (
    <div {...other}>
      <Scrollbar>
        <Table sx={{ minWidth: 700 }}>
          <TableHead>
            <TableRow>
              <TableCell>
                Nome
              </TableCell>
              <TableCell align="right">
                Ações
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {profiles.map((profile) => {
              return (
                <TableRow
                  hover
                  key={profile.id}
                >
                  <TableCell>
                    <Box
                      sx={{
                        alignItems: 'center',
                        display: 'flex'
                      }}
                    >
                      <Avatar
                        src={profile.avatar}
                        sx={{
                          height: 42,
                          width: 42
                        }}
                      >
                        {getInitials(profile.name)}
                      </Avatar>
                      <Box sx={{ ml: 1 }}>
                        <NextLink
                          href={`/dashboard/admin/profile/${profile.id}`}
                          passHref
                        >
                          <Link
                            color="inherit"
                            variant="subtitle2"
                          >
                            {profile.name}
                          </Link>
                        </NextLink>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell align="right">
                    <NextLink
                      href={`/dashboard/admin/profile/${profile.id}`}
                      passHref
                    >
                      <IconButton component="a">
                        <PencilAltIcon fontSize="small" />
                      </IconButton>
                    </NextLink>
                    <NextLink
                      href="/dashboard/admin/profile"
                      passHref
                    >
                      <IconButton component="a" onClick={() => {setOpenDialogDelete(profile.id)}} >
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
        count={profilesCount}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />
      <DialogWarning
        title="Excluir perfil de acesso"
        description="Deseja realmente excluir este perfil de acesso?"
        cancelButton="Cancelar"
        okButton="Excluir"
        onSubmitOk={() => { onDelete(openDialogDelete); setOpenDialogDelete(0); }}
        onSubmitCancel={() => {setOpenDialogDelete(0)}}
        open={openDialogDelete != 0}
      />
    </div>
  );
};

ProfileListTable.propTypes = {
  profiles: PropTypes.array.isRequired,
  profilesCount: PropTypes.number.isRequired,
  onPageChange: PropTypes.func,
  onRowsPerPageChange: PropTypes.func,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
  onDelete: PropTypes.func.isRequired
};