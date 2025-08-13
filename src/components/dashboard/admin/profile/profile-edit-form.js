import NextLink from 'next/link';
import PropTypes from 'prop-types';
import toast from 'react-hot-toast';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Checkbox,
  Divider,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField
} from '@mui/material';
import profileService from '../../../../services/admin/profile-service';
import accessService from '../../../../services/admin/access-service';
import authorizationService from '../../../../services/auth/authorization-service';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { DialogWarning } from '../../../dialog-warning';

export const ProfileEditForm = (props) => {
  const { profile, ...other } = props;
  const router = useRouter();
  const [openDialogDelete, setOpenDialogDelete] = useState(0);
  const [access, setAccess] = useState([]);

  const getAccess = (async () => {
    try {
      const listAccess = await accessService.getByProfile(profile.id);
            
      if (listAccess) {
        setAccess(listAccess);
      }
    } catch (err) {
      console.error(err);
    }
  });

  useEffect(() => {
    getAccess();
    nameAccess.focus();
  }, 
  // eslint-disable-next-line react-hooks/exhaustive-deps
  []);

  const saveProfile = async (values) => {
    let id = values.id;

    const profileData = {
      id: values.id,
      name: values.name,
      idUserRegistration: values.idUserRegistration,
      idUserLastUpdated: values.idUserLastUpdated,
      owner: {
        id: values.idOwner
      },
    };  
    
    if (profileData.id === 0) {
      id = (await profileService.insert(profileData)).data;
    } else {
      await profileService.update(profileData);
    }

    return id;
  };

  const saveAccess = async (access, id) => {
    try {
      access.forEach(async (item) => {
        await accessService.saveAccess(item, id);
      })
    } catch (err) {
      console.error(err);
      toast.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await profileService.deleteById(id);      

      toast.success('Perfil de acesso excluído!');
      router.push('/dashboard/admin/profile');
    } catch (err) {
      console.error(err.message + '. ' + err.detail);
      toast.error(err.message + '. ' + err.detail);
    }
  };

  const formik = useFormik({
    initialValues: {
      id: profile?.id || 0,
      idOwner: profile?.owner?.id || authorizationService.getOwnerIdFromUserLogged(),
      name: profile?.name || '',
      idUserRegistration: profile?.idUserRegistration || authorizationService.getUserIdFromUserLogged(),
      idUserLastUpdated: profile?.idUserLastUpdated || authorizationService.getUserIdFromUserLogged(),
      submit: null
    },
    validationSchema: Yup.object({
      id: Yup.number(),
      name: Yup.string().required("Nome é obrigatório"),
      idUserRegistration: Yup.number(),
      idUserLastUpdated: Yup.number(),
      idOwner: Yup.number()
    }),
    onSubmit: async (values, helpers) => {
      saveProfile(values).then(async (id) => {
        saveAccess(access, id);

        helpers.setStatus({ success: true });
        helpers.setSubmitting(false);

        toast.success('Perfil de acesso salvo!');
        router.push('/dashboard/admin/profile');
      }).catch((err) => {
        console.error(err);
        toast.error(err);
  
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: err });
        helpers.setSubmitting(false);
      });
    }
  });

  return (
    <form
      onSubmit={formik.handleSubmit}
      {...other}>
      <Card>
        <CardHeader title="Perfil de acesso" />
        <Divider />
        <CardContent>
          <Grid
            container
            spacing={3}
          >
            <Grid
              item
              md={12}
              xs={12}
            >
              <TextField
                error={Boolean(formik.touched.name && formik.errors.name)}
                fullWidth
                helperText={formik.touched.name && formik.errors.name}
                label="Nome"
                name="name"
                id="nameAccess"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                required
                value={formik.values.name}
              />
            </Grid>
            <Grid
              item
              md={12}
              xs={12}
            >
              <TableContainer component={Paper}>
                <Table
                  size="small" 
                  aria-label="a dense table"
                >
                    <TableHead>
                    <TableRow>
                        <TableCell>Módulo </TableCell>
                        <TableCell align="center">Consultar</TableCell>
                        <TableCell align="center">Inserir</TableCell>
                        <TableCell align="center">Alterar</TableCell>
                        <TableCell align="center">Excluir</TableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                    {access.map((row, index) => {
                        
                        function toggleYN(e, prop){
                            try{
                                let newAccess = [...access];

                                newAccess[index][prop] = e.target.checked ? "Y": "N";
                                setAccess(newAccess);
                            } catch (err) {
                                console.error(err);
                                toast.error("Erro ao tentar salvar acesso");
                            }
                        };

                        return (
                            <TableRow key={row.id}>
                                <TableCell align="left">{row.module.name}</TableCell>
                                <TableCell align="center">
                                    <Checkbox checked={row.search == "Y"} onChange={(e) => toggleYN(e, "search")} />
                                </TableCell>
                                <TableCell align="center">
                                    <Checkbox checked={row.insert == "Y"} onChange={(e) => toggleYN(e, "insert")} />
                                </TableCell>
                                <TableCell align="center">
                                    <Checkbox checked={row.update == "Y"} onChange={(e) => toggleYN(e, "update")} />
                                </TableCell>
                                <TableCell align="center">
                                    <Checkbox checked={row.delete == "Y"} onChange={(e) => toggleYN(e, "delete")} />
                                </TableCell>
                            </TableRow>
                        )
                    })}
                    </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
        </CardContent>
        <CardActions
          sx={{
            flexWrap: 'wrap',
            m: -1
          }}
        >
          <Button
            disabled={formik.isSubmitting}
            type="submit"
            sx={{ m: 1 }}
            variant="contained"
          >
            Salvar
          </Button>
          <NextLink
            href="/dashboard/admin/profile"
            passHref
          >
            <Button
              component="a"
              disabled={formik.isSubmitting}
              sx={{
                m: 1,
                mr: 'auto'
              }}
              variant="outlined"
            >
              Cancelar
            </Button>
          </NextLink>
          <Button
            color="error"
            disabled={formik.isSubmitting}
            onClick={() => {setOpenDialogDelete(formik.values.id);}}
          >
            Excluir
          </Button>
        </CardActions>
      </Card>
      <DialogWarning
        title="Excluir perfil de acesso"
        description="Deseja realmente excluir este perfil de acesso?"
        cancelButton="Cancelar"
        okButton="Excluir"
        onSubmitOk={() => { handleDelete(openDialogDelete); setOpenDialogDelete(0); }}
        onSubmitCancel={() => {setOpenDialogDelete(0)}}
        open={openDialogDelete != 0}
      />
    </form>
  );
};

ProfileEditForm.propTypes = {
    profile: PropTypes.object.isRequired
};