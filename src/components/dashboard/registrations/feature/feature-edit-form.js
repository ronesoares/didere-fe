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
  TextField
} from '@mui/material';
import featureService from '../../../../services/registrations/feature-service';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { DialogWarning } from '../../../dialog-warning';
import { useTranslation } from 'react-i18next';

export const FeatureEditForm = (props) => {
  const { feature, ...other } = props;
  const router = useRouter();
  const [openDialogDelete, setOpenDialogDelete] = useState(0);
  const { t } = useTranslation();

  useEffect(() => {
    nameFeature.focus();
  }, 
  // eslint-disable-next-line react-hooks/exhaustive-deps
  []);

  const saveFeature = async (values) => {
    let id = values.id;

    const featureData = {
      id: values.id,
      name: values.name,
      description: values.description,
    };  
    
    if (featureData.id === 0) {
      id = (await featureService.insert(featureData)).data;
    } else {
      await featureService.update(featureData);
    }

    return id;
  };

  const handleDelete = async (id) => {
    try {
      await featureService.deleteById(id);      

      toast.success('Característica excluída!');
      router.push('/dashboard/registrations/feature');
    } catch (err) {
      console.error(err.message + '. ' + err.detail);
      toast.error(err.message + '. ' + err.detail);
    }
  };

  const formik = useFormik({
    initialValues: {
      id: feature?.id || 0,
      name: feature?.name || '',
      description: feature?.description || '',
      submit: null
    },
    validationSchema: Yup.object({
      id: Yup.number(),
      name: Yup.string().required("Nome é obrigatório"),
      description: Yup.string().required("Descrição é obrigatória"),
    }),
    onSubmit: async (values, helpers) => {
      saveFeature(values).then(async (id) => {
        helpers.setStatus({ success: true });
        helpers.setSubmitting(false);

        toast.success('Característica salva!');
        router.push('/dashboard/registrations/feature');
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
        <CardHeader title="Características" />
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
                label={t('Nome')}
                name="name"
                id="nameFeature"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                required
                value={formik.values.name}
              />
            </Grid>
            <Grid
              item
              md={12}
              xs={100}
            >
              <TextField
                error={Boolean(formik.touched.description && formik.errors.description)}
                fullWidth
                helperText={formik.touched.description && formik.errors.description}
                label={t('Descrição')}
                name="description"
                id="description"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                required
                value={formik.values.description}
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
            {t('Salvar')}
          </Button>
          <NextLink
            href="/dashboard/registrations/feature"
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
              {t('Cancelar')}
            </Button>
          </NextLink>
          <Button
            color="error"
            disabled={formik.isSubmitting}
            onClick={() => {setOpenDialogDelete(formik.values.id);}}
          >
            {t('Excluir')}
          </Button>
        </CardActions>
      </Card>
      <DialogWarning
        title={t('Excluir característica')}
        description={t('Deseja realmente excluir esta característica?')}
        cancelButton={t('Cancelar')}
        okButton={t('Excluir')}
        onSubmitOk={() => { handleDelete(openDialogDelete); setOpenDialogDelete(0); }}
        onSubmitCancel={() => {setOpenDialogDelete(0)}}
        open={openDialogDelete != 0}
      />
    </form>
  );
};

FeatureEditForm.propTypes = {
    feature: PropTypes.object.isRequired
};