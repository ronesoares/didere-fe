import NextLink from 'next/link';
import PropTypes from 'prop-types';
import toast from 'react-hot-toast';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Chip,
  Divider,
  Grid,
  MenuItem,
  TextField,
  Typography
} from '@mui/material';
import locatorService from '../../../../services/registrations/locator-service';
import { searchByZipCode } from '../../../../services/addresses/zip-code-service';
import authorizationService from '../../../../services/auth/authorization-service';
import { useRouter } from 'next/router';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import 'dayjs/locale/pt-br';
import { useEffect, useState } from 'react';
import InputMask from 'react-input-mask';
import DateBR from '../../../../utils/date-br';
import { DialogWarning } from '../../../dialog-warning';

dayjs.extend(localizedFormat);
dayjs.locale('pt-br');

export const LocatorEditForm = (props) => {
  const { locator, ...other } = props;
  const router = useRouter();
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [openDialogDelete, setOpenDialogDelete] = useState(0);

  const getStates = (async () => {
    try {
      const states = authorizationService.getStatesAndCities();
      
      setStates(states);
      getCitiesByState(formik.values.state, states);
    } catch (err) {
      console.error(err);
    }
  });

  useEffect(() => {
    getStates();
    nameLocator.focus();
  }, 
  // eslint-disable-next-line react-hooks/exhaustive-deps
  []);

  const getAddressByZipCode = async (zipCode) => {
    if (zipCode.length == 10) {
      searchByZipCode(zipCode).then((address) => {
        formik.setFieldValue('nameAddress', address.data.logradouro);
        formik.setFieldValue('neighborhood', address.data.bairro);

        const idState = states?.filter(state => state.abbreviation == address.data.uf)[0]?.id
        formik.setFieldValue('state', idState);
        
        getCitiesByState(idState, states);
        formik.setFieldValue('city', address.data.ibge);
      }).catch((err) => {
        console.error(err);
        toast.error('Ocorreu um erro ao buscar o endereço pelo CEP!');
      });
    };
  };

  const getCitiesByState = async (id, listStates) => {
    setCities(listStates?.filter(state => state.id == id)[0]?.cities);
  };

  const saveLocator = async (values) => {
    let id = values.id;

    const locatorData = {
      id: values.id,
      name: values.name,
      nickname: values.nickname,
      document: values.document.replace(/[^0-9,]*/g, ''),
      email: values.email,
      birthday: values.birthday,
      phoneOption1: values.phoneOption1.replace(/[^0-9,]*/g, ''),
      phoneOption2: values.phoneOption2.replace(/[^0-9,]*/g, ''),
      address: mountAddress(values),
    };
    
    if (locatorData.id === 0) {
      id = (await locatorService.insert(locatorData)).data;
      values.id = id;
    } else {
      await locatorService.update(locatorData);
    };

    return id;
  };

  const mountAddress = (values) => {
    const addressData = {
      id: values.addressId == 0 ? 1 : values.addressId,
      zipCode: values.zipCode.replace(/[^0-9,]*/g, ''),
      name: values.nameAddress,
      neighborhood: values.neighborhood,
      number: values.number || null,
      complement: values.complement,
      city: {
        id: values.city
      },
      state: {
        id: values.state
      },
    };

    return addressData;
  };

  const handleDelete = async (id) => {
    try {
      await locatorService.deleteById(id);      

      toast.success('Locator excluído!');
      router.push('/dashboard/registrations/locator');
    } catch (err) {
      console.error(err.message + '. ' + err.detail);
      toast.error(err.message + '. ' + err.detail);
    }
  };

  const formik = useFormik({
    initialValues: {
      id: locator?.id || 0,
      name: locator?.name || '',
      nickname: locator?.nickname || '',
      document: locator?.document || '',
      email: locator?.email || '',
      phoneOption1: locator?.phoneOption1 || '',
      phoneOption2: locator?.phoneOption2 || '',
      birthday: locator?.birthday || '',
      addressId: locator?.address?.id || 0,
      zipCode: locator?.address?.zipCode || '',
      nameAddress: locator?.address?.name || '',
      neighborhood: locator?.address?.neighborhood || '',
      number: locator?.address?.number || '',
      state: locator?.address?.state?.id || 0,
      city: locator?.address?.city?.id || 0,
      complement: locator?.address?.complement || '',
      submit: null
    },
    validationSchema: Yup.object({
      id: Yup.number(),
      name: Yup.string().required("Nome é obrigatório"),
      nickname: Yup.string().required("Apelido é obrigatório"),
      email: Yup.string().required("E-mail é obrigatório"),
      phoneOption1: Yup.string().required("Telefone principal é obrigatório"),
      phoneOption2: Yup.string(),
      birthday: Yup.date().required("Data de nascimento é obrigatória"),
      zipCode: Yup.string().required("CEP é obrigatório"),
      nameAddress: Yup.string().required("Endereço é obrigatório"),
      neighborhood: Yup.string().required("Bairro é obrigatório"),
      number: Yup.string().required("Número do endereço é obrigatório"),
      city: Yup.string().required("Cidade é obrigatória"),
      state: Yup.string().required("Estado é obrigatório"),
      complement: Yup.string(),
    }),
    onSubmit: async (values, helpers) => {
      saveLocator(values).then(async (id) => {
        helpers.setStatus({ success: true });
        helpers.setSubmitting(false);

        toast.success('Locator salvo!');
        router.push('/dashboard/registrations/locator');
      }).catch((err) => {
        console.error(err);
        toast.error(err.message);
  
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: err.message });
        helpers.setSubmitting(false);
      });
    }
  });

  return (
    <form
      onSubmit={formik.handleSubmit}
      {...other}>
      <Card>
        <CardHeader title="Locador" />
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
                id="nameLocator"
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
                error={Boolean(formik.touched.nickname && formik.errors.nickname)}
                fullWidth
                required
                helperText={formik.touched.nickname && formik.errors.nickname}
                label="Apelido"
                name="nickname"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.nickname}
              />
            </Grid>
            <Grid
              item
              md={8}
              xs={12}
            >
              <TextField
                error={Boolean(formik.touched.email && formik.errors.email)}
                fullWidth
                helperText={formik.touched.email && formik.errors.email}
                label="E-mail"
                name="email"
                type='email'
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.email}
              />
            </Grid>
            <Grid
              item
              md={4}
              xs={12}
            >
              <InputMask
                mask="999.999.999-99"
                value={formik.values.document}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              >
                {(inputProps) => (
                  <TextField
                    {...inputProps}
                    error={Boolean(formik.touched.document && formik.errors.document)}
                    fullWidth
                    helperText={formik.touched.document && formik.errors.document}
                    label="CPF"
                    name="document"
                    variant="outlined"
                  />
                )}
              </InputMask>
            </Grid>
            <Grid
              item
              md={4}
              xs={12}
            >
              <InputMask
                mask="(99) 99999-9999"
                value={formik.values.phoneOption1}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              >
                {(inputProps) => (
                  <TextField
                    {...inputProps}
                    error={Boolean(formik.touched.phoneOption1 && formik.errors.phoneOption1)}
                    fullWidth
                    required
                    helperText={formik.touched.phoneOption1 && formik.errors.phoneOption1}
                    label="Telefone principal"
                    name="phoneOption1"
                    type='tel'
                    variant="outlined"
                  />
                )}
              </InputMask>
            </Grid>
            <Grid
              item
              md={4}
              xs={12}
            >
              <InputMask
                mask="(99) 99999-9999"
                value={formik.values.phoneOption2}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              >
                {(inputProps) => (
                  <TextField
                    {...inputProps}
                    error={Boolean(formik.touched.phoneOption2 && formik.errors.phoneOption2)}
                    fullWidth
                    helperText={formik.touched.phoneOption2 && formik.errors.phoneOption2}
                    label="Telefone adicional"
                    name="phoneOption2"
                    type='tel'
                    variant="outlined"
                  />
                )}
              </InputMask>
            </Grid>
            <Grid
              item
              md={4}
              xs={12}
            >
              <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
                <DatePicker
                  name="birthday"
                  fullWidth
                  required
                  value={dayjs(formik.values.birthday)}
                  label="Data de nascimento"
                  showTodayButton={true}
                  onChange={(newValue) => {
                    formik.values.birthday = newValue;
                  }}
                  renderInput={
                    (params) => 
                      <TextField 
                        fullWidth 
                        required
                        {...params} />
                  }
                />
              </LocalizationProvider>
            </Grid>
            <Grid
              item
              md={12}
              xs={12}
            >
              <Divider sx={{ my: 3 }} />
              <Box
                sx={{
                  alignItems: 'center',
                  display: 'flex',
                  justifyContent: 'space-between',
                  mt: 1
                }}
              >
                <div>
                  <Typography
                    gutterBottom
                    variant="subtitle1"
                  >
                    Endereço
                  </Typography>
                </div>
              </Box>
            </Grid>
            <Grid
              item
              md={2}
              xs={12}
            >
              <InputMask
                mask="99.999-999"
                value={formik.values.zipCode}
                onChange={formik.handleChange}
                onBlur={() => {
                  formik.handleBlur; 
                  getAddressByZipCode(formik.values.zipCode); 
                  numberAddress.focus();
                }}
              >
                {(inputProps) => (
                  <TextField
                    {...inputProps}
                    error={Boolean(formik.touched.zipCode && formik.errors.zipCode)}
                    fullWidth
                    helperText={formik.touched.zipCode && formik.errors.zipCode}
                    label="CEP"
                    name="zipCode"
                    variant="outlined"
                  />
                )}
              </InputMask>
            </Grid>
            <Grid
              item
              md={4}
              xs={12}
            >
              <TextField
                error={Boolean(formik.touched.state && formik.errors.state)}
                fullWidth
                helperText={formik.touched.state && formik.errors.state}
                select
                required
                name="state"
                label="Estado"
                value={formik.values.state}
                onBlur={formik.handleBlur}
                onChange={(event) => {
                  const id = event.target.value;
                  formik.setFieldValue('state', id);
                  formik.setFieldValue('city', '');
                  getCitiesByState(id, states);
                }}
                variant="outlined"
                style={{ display: 'block' }}
              >
                {states?.sort((a, b) => a.name.localeCompare(b.name)).map((option) => (
                  <MenuItem key={option.id} value={option.id}>
                    {option.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                error={Boolean(formik.touched.city && formik.errors.city)}
                fullWidth
                helperText={formik.touched.city && formik.errors.city}
                select
                required
                name="city"
                label="Cidade"
                value={formik.values.city}
                onBlur={formik.handleBlur}
                onChange={(event) => {
                  const city = event.target.value;
                  formik.setFieldValue('city', city);
                }}
                variant="outlined"
                style={{ display: 'block' }}
              >
                {cities?.sort((a, b) => a.name.localeCompare(b.name)).map((option) => (
                  <MenuItem key={option.id} value={option.id}>
                    {option.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid
              item
              md={10}
              xs={12}
            >
              <TextField
                error={Boolean(formik.touched.nameAddress && formik.errors.nameAddress)}
                fullWidth
                helperText={formik.touched.nameAddress && formik.errors.nameAddress}
                label="Logradouro"
                name="nameAddress"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.nameAddress}
              />
            </Grid>
            <Grid
              item
              md={2}
              xs={12}
            >
              <TextField
                error={Boolean(formik.touched.number && formik.errors.number)}
                fullWidth
                helperText={formik.touched.number && formik.errors.number}
                type='number'
                label="Número"
                name="number"
                id='numberAddress'
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.number}
              />
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                error={Boolean(formik.touched.neighborhood && formik.errors.neighborhood)}
                fullWidth
                helperText={formik.touched.neighborhood && formik.errors.neighborhood}
                label="Bairro"
                name="neighborhood"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.neighborhood}
              />
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                error={Boolean(formik.touched.complement && formik.errors.complement)}
                fullWidth
                helperText={formik.touched.complement && formik.errors.complement}
                label="Complemento"
                name="complement"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.complement}
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
            href="/dashboard/registrations/locator"
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
        title="Excluir locador"
        description="Deseja realmente excluir este locador?"
        cancelButton="Cancelar"
        okButton="Excluir"
        onSubmitOk={() => { handleDelete(openDialogDelete); setOpenDialogDelete(0); }}
        onSubmitCancel={() => {setOpenDialogDelete(0)}}
        open={openDialogDelete != 0}
      />
    </form>
  );
};

LocatorEditForm.propTypes = {
    locator: PropTypes.object.isRequired
};