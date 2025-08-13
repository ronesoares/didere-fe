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
import propertyService from '../../../../services/registrations/property-service';
import typeActivityService from '../../../../services/registrations/type-activity-service';
import featureService from '../../../../services/registrations/feature-service';
import locatorService from '../../../../services/registrations/locator-service';
import { downloadFile } from '../../../../services/files/file-service';
import { searchByZipCode } from '../../../../services/addresses/zip-code-service';
import authorizationService from '../../../../services/auth/authorization-service';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import InputMask from 'react-input-mask';
import { DialogWarning } from '../../../dialog-warning';
import { FileDropzone } from '../../../file-dropzone';
import { CoverImage } from '../../../cover-image';
import { RentalPeriods } from './rental-period-edit-form';

export const PropertyEditForm = (props) => {
  const { property, ...other } = props;
  const router = useRouter();
  const [rentalPeriods, setRentalPeriods] = useState([]);
  const [features, setFeatures] = useState([]);
  const [featuresOptions, setFeaturesOptions] = useState([]);
  const [typeActivities, setTypeActivities] = useState([]);
  const [typeActivitiesOptions, setTypeActivitiesOptions] = useState([]);
  const [mainPhoto, setMainPhoto] = useState(null);
  const [locators, setLocators] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [openDialogDelete, setOpenDialogDelete] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getFeatures = (async () => {
    try {
      const featuresOptions = await featureService.getAll();      
      setFeaturesOptions(featuresOptions);
      
      if (property.features) {
        setFeatures(property.features.map(item => item.feature));
      }
    } catch (err) {
      console.error(err);
    }
  });

  const getTypeActivities = (async () => {
    try {
      const typeActivitiesOptions = await typeActivityService.getAll();      
      setTypeActivitiesOptions(typeActivitiesOptions);
      
      if (property.typeActivities) {
        setTypeActivities(property.typeActivities.map(item => item.typeActivity));
      }
    } catch (err) {
      console.error(err);
    }
  });

  const getLocators = (async () => {
    try {
      const locatorsOptions = await locatorService.getAll();      
      setLocators(locatorsOptions);
    } catch (err) {
      console.error(err);
    }
  });

  const getStates = (async () => {
    try {
      const states = authorizationService.getStatesAndCities();
      
      setStates(states);
      getCitiesByState(formik.values.state, states);
    } catch (err) {
      console.error(err);
    }
  });

  const getDocuments = (async () => {
    try {
      const files = property.documents;
      const _files = transformFiles(files);
      setDocuments(_files);
    } catch (err) {
      console.error(err);
    }
  });

  const getPhotos = (async () => {
    try {
      const files = property.photos;
      const _files = transformFiles(files);
      setPhotos(_files);
    } catch (err) {
      console.error(err);
    }
  });

  const transformFiles = (files) => {
      let _files = [];

      for (let a of files) {
        _files.push({
          status: 'saved',
          id: a.file.id,
          path: a.file.name,
          name: a.file.name,
          type: a.file.type,
          lastModifiedDate: a.file.creationDate,
          size: a.file.size,
        });
      };

      return _files;
  };

  useEffect(() => {
    getFeatures();
    getTypeActivities();
    getLocators();
    getStates();
    getDocuments();
    getPhotos();
    setRentalPeriods(property?.rentalPeriods || []);
    setMainPhoto(formik.values.mainPhoto);
    title.focus();
  }, 
  // eslint-disable-next-line react-hooks/exhaustive-deps
  []);

  const getAddressByZipCode = async (zipCode) => {
    if (zipCode.length == 10) {
      searchByZipCode(zipCode).then((address) => {
        formik.setFieldValue('nameAddress', address.data.logradouro);
        formik.setFieldValue('neighborhood', address.data.bairro);

        const idState = states?.filter(state => state.abbreviation == address.data.uf)[0].id
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

  const saveProperty = async (values) => {
    let id = values.id;

    const propertyData = {
      id: values.id,
      title: values.title,
      description: values.description,
      mainPhoto: mainPhoto,
      urlMaps: values.urlMaps,
      height: values.height,
      width: values.width,
      depth: values.depth,
      periodicity: values.periodicity,
      value: values.value,
      address: mountAddress(values),
      locator: mountLocator(values.locator),
      features: mountFeatures(features),
      typeActivities: mountTypeActivities(typeActivities),
      rentalPeriods: mountRentalPeriods(rentalPeriods),
    };
    
    if (propertyData.id === 0) {
      id = (await propertyService.insert(propertyData)).data;
      values.id = id;
    } else {
      await propertyService.update(propertyData);
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

  const mountLocator = (locatorId) => {
    const locator = {
      id: locatorId,
    };

    return locator;
  };

  const mountFeatures = (features) => {
    let propertyFeatures = [];

    features.map(feature => {
      propertyFeatures.push({
        feature: {
            id: feature.id,
        },
      });
    });

    return propertyFeatures;
  };

  const mountTypeActivities = (typeActivities) => {
    let propertyTypeActivities = [];

    typeActivities.map(typeActivity => {
      propertyTypeActivities.push({
        typeActivity: {
            id: typeActivity.id,
        },
      });
    });

    return propertyTypeActivities;
  };

  const mountRentalPeriods = (rentalPeriods) => {
    let propertyRentalPeriods = [];

    rentalPeriods?.map(rentalPeriod => {
      propertyRentalPeriods.push({
        startDate: rentalPeriod.startDate,
        endDate: rentalPeriod.endDate,
        startHour: rentalPeriod.startHour,
        endHour: rentalPeriod.endHour,
        sunday: rentalPeriod.sunday,
        monday: rentalPeriod.monday,
        tuesday: rentalPeriod.tuesday,
        wednesday: rentalPeriod.wednesday,
        thursday: rentalPeriod.thursday,
        friday: rentalPeriod.friday,
        saturday: rentalPeriod.saturday,
      });
    });

    return propertyRentalPeriods;
  };

  const saveFiles = async (id, files, uploadFile, deleteFile) => {
    try {
      if (files) {
        files
          .filter(item => { return item.status == 'added'; })
          .map(async item => {
            let formData = new FormData();

            formData.append("fileUp", item);
            formData.append("module", "Property");
            formData.append("id", id);

            await uploadFile(formData);
          });

        files
          .filter(item => { return item.status == 'deleted'; })
          .map(async item => {
              await deleteFile(item.id, 'property');
          });
      };

      return '';
    } catch (err) {
      console.error(err);
      return 'Ocorreu um erro ao salvar os anexos!';
    }
  };

  const handleDropDocuments = (newFiles) => {
    newFiles.forEach(file => {
      file.status = 'added';
    });

    setDocuments((prevFiles) => [...prevFiles, ...newFiles]);
  };

  const handleRemoveDocuments = (file) => {
    file.status = file.status == 'added' || file.status == 'discard' ? 'discard' : 'deleted';

    const index = documents.findIndex((_file) => _file.path === file.path);
    if (index !== -1) {
      documents[index] = file;
    }

    setDocuments(documents.filter((x) => x.status !== 'nostatus'));
  };

  const handleRemoveAllDocuments = () => {
    documents.forEach(file => {
      handleRemoveDocuments(file);
    });
  };

  const handleDropPhotos = (newFiles) => {
    newFiles.forEach(file => {
      file.status = 'added';
    });

    setPhotos((prevFiles) => [...prevFiles, ...newFiles]);
  };

  const handleRemovePhotos = (file) => {
    file.status = file.status == 'added' || file.status == 'discard' ? 'discard' : 'deleted';

    const index = photos.findIndex((_file) => _file.path === file.path);
    if (index !== -1) {
      photos[index] = file;
    }

    setPhotos(photos.filter((x) => x.status !== 'nostatus'));
  };

  const handleRemoveAllPhotos = () => {
    photos.forEach(file => {
      handleRemovePhotos(file);
    });
  };

  const handleDownloadFile = async (file) => {
    try {
      await downloadFile(file, 'property', false);
    } catch (err) {
      console.error(err);
      toast.error('Ocorreu um erro ao baixar o arquivo!');
    }
  };

  const handleDelete = async (id) => {
    try {
      await propertyService.deleteById(id);      

      toast.success('Property excluído!');
      router.push('/dashboard/registrations/property');
    } catch (err) {
      console.error(err.message + '. ' + err.detail);
      toast.error(err.message + '. ' + err.detail);
    }
  };

  const formik = useFormik({
    initialValues: {
      id: property?.id || 0,
      title: property?.title || '',
      description: property?.description || '',
      mainPhoto: property?.mainPhoto || '',
      urlMaps: property?.urlMaps || '',
      height: property?.height || 0,
      width: property?.width || 0,
      depth: property?.depth || 0,
      periodicity: property?.periodicity || '',
      value: property?.value || 0,
      locator: property?.locator?.id || 0,
      addressId: property?.address?.id || 0,
      zipCode: property?.address?.zipCode || '',
      nameAddress: property?.address?.name || '',
      neighborhood: property?.address?.neighborhood || '',
      number: property?.address?.number || '',
      state: property?.address?.state?.id || 0,
      city: property?.address?.city?.id || 0,
      complement: property?.address?.complement || '',
      submit: null
    },
    validationSchema: Yup.object({
      id: Yup.number(),
      title: Yup.string().required("Título é obrigatório"),
      description: Yup.string().required("Descrição é obrigatória"),
      urlMaps: Yup.string().required("Url do Maps é obrigatória"),
      height: Yup.number(),
      width: Yup.number(),
      depth: Yup.number(),
      periodicity: Yup.string().required("Periodicidade é obrigatória"),
      value: Yup.number().required("Valor é obrigatório"),
      zipCode: Yup.string().required("CEP é obrigatório"),
      nameAddress: Yup.string().required("Endereço é obrigatório"),
      neighborhood: Yup.string().required("Bairro é obrigatório"),
      number: Yup.string().required("Número do endereço é obrigatório"),
      city: Yup.string().required("Cidade é obrigatória"),
      state: Yup.string().required("Estado é obrigatório"),
      complement: Yup.string()
    }),
    onSubmit: async (values, helpers) => {
      setIsSubmitting(true);

      saveProperty(values).then(async (id) => {
        let messageError = '';
        messageError = messageError + await saveFiles(id, documents, propertyService.uploadDocument, propertyService.deleteDocument);
        messageError = messageError + await saveFiles(id, photos, propertyService.uploadPhoto, propertyService.deletePhoto);

        if (messageError == '') {
          helpers.setStatus({ success: true });
          helpers.setSubmitting(false);
          setIsSubmitting(false);

          toast.success('Imóvel salvo!');
          router.push('/dashboard/registrations/property');
          return;
        }
        else {
          toast.error(messageError);

          helpers.setStatus({ success: false });
          helpers.setErrors({ submit: messageError });
          helpers.setSubmitting(false);
          setIsSubmitting(false);
        };
      }).catch((err) => {
        console.error(err);
        toast.error(err);
  
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: err.message });
        helpers.setSubmitting(false);
        setIsSubmitting(false);
      });
    }
  });

  return (
    <form
      onSubmit={formik.handleSubmit}
      {...other}>
      <Card>
        <CardHeader title="Imóvel" />
        <Divider />
        <CardContent>
          <Grid
            container
            spacing={3}
          >
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                disabled={isSubmitting}
                error={Boolean(formik.touched.title && formik.errors.title)}
                fullWidth
                helperText={formik.touched.title && formik.errors.title}
                label="Título"
                name="title"
                id="title"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                required
                value={formik.values.title}
              />
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                disabled={isSubmitting}
                required
                error={Boolean(formik.touched.locator && formik.errors.locator)}
                fullWidth
                helperText={formik.touched.locator && formik.errors.locator}
                select
                name="locator"
                label="Locador"
                value={formik.values.locator}
                onBlur={formik.handleBlur}
                onChange={(event) => {
                  const locator = event.target.value;
                  formik.setFieldValue('locator', locator);
                }}
                variant="outlined"
                style={{ display: 'block' }}
              >
                {locators?.sort((a, b) => a.name.localeCompare(b.name)).map((option) => (
                  <MenuItem key={option.id} value={option.id}>
                    {option.id} - {option.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid
              item
              md={12}
              xs={12}
            >
              <TextField
                disabled={isSubmitting}
                error={Boolean(formik.touched.description && formik.errors.description)}
                fullWidth
                multiline
                helperText={formik.touched.description && formik.errors.description}
                label="Descrição"
                name="description"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                required
                value={formik.values.description}
              />
            </Grid>
            <Grid
              item
              md={12}
              xs={12}
            >
              <TextField
                disabled={isSubmitting}
                error={Boolean(formik.touched.urlMaps && formik.errors.urlMaps)}
                fullWidth
                helperText={formik.touched.urlMaps && formik.errors.urlMaps}
                label="Url do Maps"
                name="urlMaps"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                required
                value={formik.values.urlMaps}
              />
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
              <Autocomplete
                disabled={isSubmitting}
                required
                multiple
                fullWidth
                id="features"
                onChange={(event, newValue) => {setFeatures(newValue);}}
                options={featuresOptions}
                value={features}
                getOptionLabel={(option) => { return option.name; }}
                renderInput={(params) => (
                    <TextField 
                      {...params} 
                      variant="outlined" 
                      label="Características" 
                    />
                )}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip 
                      key={option.id} 
                      label={option.name} 
                      {...getTagProps({ index })} 
                  />
                  ))
                }
              />
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
              <Autocomplete
                disabled={isSubmitting}
                required
                multiple
                fullWidth
                id="typeActivities"
                onChange={(event, newValue) => {setTypeActivities(newValue);}}
                options={typeActivitiesOptions}
                value={typeActivities}
                getOptionLabel={(option) => { return option.name; }}
                renderInput={(params) => (
                    <TextField 
                      {...params} 
                      variant="outlined" 
                      label="Tipos de atividades" 
                    />
                )}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip 
                      key={option.id} 
                      label={option.name} 
                      {...getTagProps({ index })} 
                  />
                  ))
                }
              />
            </Grid>
            <Grid
              item
              md={4}
              xs={12}
            >
              <TextField
                disabled={isSubmitting}
                error={Boolean(formik.touched.height && formik.errors.height)}
                fullWidth
                helperText={formik.touched.height && formik.errors.height}
                label="Altura (metros)"
                name="height"
                type='number'
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.height}
              />
            </Grid>
            <Grid
              item
              md={4}
              xs={12}
            >
              <TextField
                disabled={isSubmitting}
                error={Boolean(formik.touched.width && formik.errors.width)}
                fullWidth
                helperText={formik.touched.width && formik.errors.width}
                label="Largura (metros)"
                name="width"
                type='number'
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.width}
              />
            </Grid>
            <Grid
              item
              md={4}
              xs={12}
            >
              <TextField
                disabled={isSubmitting}
                error={Boolean(formik.touched.depth && formik.errors.depth)}
                fullWidth
                helperText={formik.touched.depth && formik.errors.depth}
                label="Profundidade (metros)"
                name="depth"
                type='number'
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.depth}
              />
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                disabled={isSubmitting}
                required
                error={Boolean(formik.touched.periodicity && formik.errors.periodicity)}
                fullWidth
                helperText={formik.touched.periodicity && formik.errors.periodicity}
                select
                label="Periodicidade"
                name="periodicity"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.periodicity}
                variant="outlined"
                style={{ display: 'block' }}
              >
                <MenuItem key="M" value="M" defaultChecked>Mensal</MenuItem>
                <MenuItem key="D" value="D">Diário</MenuItem>
                <MenuItem key="S" value="S">Semanal</MenuItem>
                <MenuItem key="H" value="H">Hora</MenuItem>
              </TextField>
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                disabled={isSubmitting}
                error={Boolean(formik.touched.value && formik.errors.value)}
                fullWidth
                helperText={formik.touched.value && formik.errors.value}
                label="Valor"
                name="value"
                type='number'
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                required
                value={formik.values.value}
              />
            </Grid>
            <Grid
              item
              md={12}
              xs={12}
            >
              <Divider sx={{ my: 3 }} />
              <RentalPeriods 
                rentalPeriods={rentalPeriods}
                setRentalPeriods={setRentalPeriods} 
              />
            </Grid>
            <Grid
              item
              md={12}
              xs={12}
            >
              <Divider sx={{ my: 3 }} />
              <CoverImage 
                cover={mainPhoto}
                setCover={setMainPhoto}
              />
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
                disabled={isSubmitting}
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
                disabled={isSubmitting}
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
                disabled={isSubmitting}
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
                disabled={isSubmitting}
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
                disabled={isSubmitting}
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
                disabled={isSubmitting}
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
                disabled={isSubmitting}
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
                    Documentos
                  </Typography>
                </div>
              </Box>
            </Grid>
            <Grid
              item
              md={12}
              xs={12}
            >
              <FileDropzone
                accept={[
                  'image/jpeg', 'image/png', 'image/gif', 'image/bmp', 'image/tiff', 'image/svg+xml', // Imagens
                  'application/pdf', // Documentos
                  'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.oasis.opendocument.text', // Documentos de texto
                  'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.oasis.opendocument.spreadsheet', 'text/csv', // Planilhas
                  'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation', 'application/vnd.oasis.opendocument.presentation', // Apresentações
                  'text/plain', 'application/rtf', 'text/x-log', 'application/json', // Texto simples e rich text
                  'application/zip', 'application/x-rar-compressed', 'application/x-7z-compressed', 'application/x-tar', 'application/gzip', // Arquivos compactados
                  'audio/mpeg', 'audio/wav', 'audio/ogg', // Áudio
                  'video/mp4', 'video/x-msvideo', 'video/x-matroska', 'video/quicktime', 'video/x-ms-wmv' // Vídeo
                ]}
                files={documents.filter(file => file.status == 'added' || file.status == 'saved')}
                onDrop={handleDropDocuments}
                onRemove={handleRemoveDocuments}
                onRemoveAll={handleRemoveAllDocuments}
                onDownload={handleDownloadFile}
                disabled={isSubmitting}
              />
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
                    Fotos
                  </Typography>
                </div>
              </Box>
            </Grid>
            <Grid
              item
              md={12}
              xs={12}
            >
              <FileDropzone
                accept={[
                  'image/jpeg', 'image/png', 'image/gif', 'image/bmp', 'image/tiff', 'image/svg+xml', // Imagens
                ]}
                files={photos.filter(file => file.status == 'added' || file.status == 'saved')}
                onDrop={handleDropPhotos}
                onRemove={handleRemovePhotos}
                onRemoveAll={handleRemoveAllPhotos}
                onDownload={handleDownloadFile}
                disabled={isSubmitting}
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
            disabled={isSubmitting}
            type="submit"
            sx={{ m: 1 }}
            variant="contained"
          >
            Salvar
          </Button>
          <NextLink
            href="/dashboard/registrations/property"
            passHref
          >
            <Button
              component="a"
              disabled={isSubmitting}
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
            disabled={isSubmitting}
            onClick={() => {setOpenDialogDelete(formik.values.id);}}
          >
            Excluir
          </Button>
        </CardActions>
      </Card>
      <DialogWarning
        title="Excluir imóvel"
        description="Deseja realmente excluir este imóvel?"
        cancelButton="Cancelar"
        okButton="Excluir"
        onSubmitOk={() => { handleDelete(openDialogDelete); setOpenDialogDelete(0); }}
        onSubmitCancel={() => {setOpenDialogDelete(0)}}
        open={openDialogDelete != 0}
      />
    </form>
  );
};

PropertyEditForm.propTypes = {
    property: PropTypes.object.isRequired
};