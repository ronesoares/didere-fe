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

export const FeatureListTable = (props) => {
  const {
    features: initialFeatures,
    featuresCount,
    onPageChange,
    onRowsPerPageChange,
    page,
    rowsPerPage,
    onDelete,
    ...other
  } = props;
  const [features, setFeatures] = useState(initialFeatures);
  const [openDialogDelete, setOpenDialogDelete] = useState(0);
  const { t } = useTranslation();

  useEffect(() => {
    setFeatures(initialFeatures);
  }, [initialFeatures]);

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
                {t('Descrição')}
              </TableCell>
              <TableCell align="right">
                {t('Ações')}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {features.map((feature) => {
              return (
                <TableRow
                  hover
                  key={feature.id}
                >
                  <TableCell>
                    <Box
                      sx={{
                        alignItems: 'center',
                        display: 'flex'
                      }}
                    >
                      <Avatar
                        src={feature.avatar}
                        sx={{
                          height: 42,
                          width: 42
                        }}
                      >
                        {getInitials(feature.name)}
                      </Avatar>
                      <Box sx={{ ml: 1 }}>
                        <NextLink
                          href={`/dashboard/registrations/feature/${feature.id}`}
                          passHref
                        >
                          <Link
                            color="inherit"
                            variant="subtitle2"
                          >
                            {feature.name}
                          </Link>
                        </NextLink>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    {feature.description}
                  </TableCell>
                  <TableCell align="right">
                    <NextLink
                      href={`/dashboard/registrations/feature/${feature.id}`}
                      passHref
                    >
                      <IconButton component="a">
                        <PencilAltIcon fontSize="small" />
                      </IconButton>
                    </NextLink>
                    <NextLink
                      href="/dashboard/registrations/feature"
                      passHref
                    >
                      <IconButton component="a" onClick={() => {setOpenDialogDelete(feature.id)}} >
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
        count={featuresCount}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />
      <DialogWarning
        title={t('Excluir característica')}
        description={t('Deseja realmente excluir esta característica?')}
        cancelButton={t('Cancelar')}
        okButton={t('Excluir')}
        onSubmitOk={() => { onDelete(openDialogDelete); setOpenDialogDelete(0); }}
        onSubmitCancel={() => {setOpenDialogDelete(0)}}
        open={openDialogDelete != 0}
      />
    </div>
  );
};

FeatureListTable.propTypes = {
  features: PropTypes.array.isRequired,
  featuresCount: PropTypes.number.isRequired,
  onPageChange: PropTypes.func,
  onRowsPerPageChange: PropTypes.func,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
  onDelete: PropTypes.func.isRequired
};