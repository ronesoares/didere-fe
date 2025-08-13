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
  Divider,
  Grid,
  MenuItem,
  TextField
} from '@mui/material';
import userService from '../../../../services/admin/user-service';
import profileService from '../../../../services/admin/profile-service';
import authorizationService from '../../../../services/auth/authorization-service';
import { useRouter } from 'next/router';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import 'dayjs/locale/pt-br';
import { useEffect, useState } from 'react';
import DateBR from '../../../../utils/date-br';
import { DialogWarning } from '../../../dialog-warning';

dayjs.extend(localizedFormat);
dayjs.locale('pt-br');

export const UserEditForm = (props) => {
  const { user, ...other } = props;
  const router = useRouter();
  const [profiles, setProfiles] = useState([]);
  const [openDialogDelete, setOpenDialogDelete] = useState(0);

  const getProfiles = (async () => {
    try {
      const profiles = await profileService.getPlusAdministrator('name asc');

      if (profiles) {
        setProfiles(profiles);
      }
    } catch (err) {
      console.error(err);
    }
  });

  useEffect(() => {
    getProfiles();
    nameUser.focus();
  }, 
  // eslint-disable-next-line react-hooks/exhaustive-deps
  []);

  const saveUser = async (values) => {
    let id = values.id;

    const userData = {
      id: values.id,
      name: values.name,
      login: values.login,
      status: values.status,
      creationDate: values.creationDate,
      loginAttemptQuantity: values.loginAttemptQuantity,
      dateOfLastLoginAttempt: values.dateOfLastLoginAttempt,
      isUserOwner: values.isUserOwner,
      password: values.password,
      owner: {
        id: values.idOwner
      },
      profile: {
        id: values.profile
      }
    };
    
    if (userData.id === 0) {
      id = (await userService.insert(userData)).data;
    } else {
      await userService.update(userData);
    }

    return id;
  };

  const handleDelete = async (id) => {
    try {
      await userService.deleteById(id);      

      toast.success('Usuário excluído!');
      router.push('/dashboard/admin/user');
    } catch (err) {
      console.error(err.message + '. ' + err.detail);
      toast.error(err.message + '. ' + err.detail);
    }
  };

  const onGeneratePassword = async () => {
    
    try{
      const password = await userService.generateRandomPassword();
      formik.setFieldValue('password', password);
    } catch (err) {
      console.error(err.message + '. ' + err.detail);
      toast.error(err.message + '. ' + err.detail);
    }
  }

  const formik = useFormik({
    initialValues: {
      id: user?.id || 0,
      idOwner: user?.owner?.id || authorizationService.getOwnerIdFromUserLogged(),
      profile: user?.profile?.id || 0,
      name: user?.name || '',
      login: user?.login || '',
      password: user?.password || '',
      status: user?.status || 'A',
      creationDate: user?.creationDate || new DateBR().toUTC3(),
      loginAttemptQuantity: user?.loginAttemptQuantity || 0,
      dateOfLastLoginAttempt: user?.dateOfLastLoginAttempt || new DateBR().toUTC3(),
      isUserOwner: user?.isUserOwner || 'N',
      submit: null
    },
    validationSchema: Yup.object({
      id: Yup.number(),
      profile: Yup.number().required("Perfil é obrigatório"),
      name: Yup.string().required("Nome é obrigatório"),
      login: Yup.string().required("Login é obrigatório"),
      status: Yup.string(),
      creationDate: Yup.date(),
      password: Yup.string().required("Senha é obrigatória"),
      idOwner: Yup.number()
    }),
    onSubmit: async (values, helpers) => {
      saveUser(values).then(async (id) => {
        helpers.setStatus({ success: true });
        helpers.setSubmitting(false);

        toast.success('Usuário salvo!');
        router.push('/dashboard/admin/user');
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
        <CardHeader title="Usuário" />
        <Divider />
        <CardContent>
          <Grid
            container
            spacing={3}
          >
            <Grid
              item
              md={8}
              xs={12}
            >
              <TextField
                error={Boolean(formik.touched.name && formik.errors.name)}
                fullWidth
                helperText={formik.touched.name && formik.errors.name}
                label="Nome"
                name="name"
                id="nameUser"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                required
                value={formik.values.name}
              />
            </Grid>
            <Grid
              item
              md={4}
              xs={12}
            >
              <TextField
                error={Boolean(formik.touched.login && formik.errors.login)}
                fullWidth
                helperText={formik.touched.login && formik.errors.login}
                required
                label="Login"
                name="login"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.login}
              />
            </Grid>
            <Grid
              item
              md={2}
              xs={12}
            >
              <TextField
                error={Boolean(formik.touched.status && formik.errors.status)}
                fullWidth
                helperText={formik.touched.status && formik.errors.status}
                select
                label="Status"
                name="status"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.status}
                variant="outlined"
                style={{ display: 'block' }}
              >
                <MenuItem key="A" value="A">Ativo</MenuItem>
                <MenuItem key="I" value="I">Inativo</MenuItem>
              </TextField>
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                error={Boolean(formik.touched.profile && formik.errors.profile)}
                fullWidth
                helperText={formik.touched.profile && formik.errors.profile}
                select
                required
                name="profile"
                label="Perfil"
                value={formik.values.profile}
                onBlur={formik.handleBlur}
                onChange={(event) => {
                  const profile = event.target.value;
                  formik.setFieldValue('profile', profile);
                }}
                variant="outlined"
                style={{ display: 'block' }}
              >
                {profiles?.sort((a, b) => a.name.localeCompare(b.name)).map((option) => (
                  <MenuItem key={option.id} value={option.id}>
                    {option.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid
              item
              md={4}
              xs={12}
            >
              <TextField
                error={Boolean(formik.touched.password && formik.errors.password)}
                fullWidth
                helperText={formik.touched.password && formik.errors.password}
                required
                label="Senha"
                name="password"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.password}
              />
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
            href="/dashboard/admin/user"
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
            disabled={formik.isSubmitting}
            component="a"
            sx={{
              m: 1,
              mr: 'auto'
            }}
            variant="outlined"
            onClick={() => onGeneratePassword()}
          >
            Gerar senha
          </Button>
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
        title="Excluir usuário"
        description="Deseja realmente excluir este usuário?"
        cancelButton="Cancelar"
        okButton="Excluir"
        onSubmitOk={() => { handleDelete(openDialogDelete); setOpenDialogDelete(0); }}
        onSubmitCancel={() => {setOpenDialogDelete(0)}}
        open={openDialogDelete != 0}
      />
    </form>
  );
};

UserEditForm.propTypes = {
    user: PropTypes.object.isRequired
};