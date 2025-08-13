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
import typeActivityService from '../../../../services/registrations/type-activity-service';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { DialogWarning } from '../../../dialog-warning';
import { useTranslation } from 'react-i18next';

export const TypeActivityEditForm = (props) => {
  const { typeActivity, ...other } = props;
  const router = useRouter();
  const [openDialogDelete, setOpenDialogDelete] = useState(0);
  const { t } = useTranslation();

  useEffect(() => {
    nameTypeActivity.focus();
  }, 
  // eslint-disable-next-line react-hooks/exhaustive-deps
  []);

  const saveTypeActivity = async (values) => {
    let id = values.id;

    const typeActivityData = {
      id: values.id,
      name: values.name,
    };  
    
    if (typeActivityData.id === 0) {
      id = (await typeActivityService.insert(typeActivityData)).data;
    } else {
      await typeActivityService.update(typeActivityData);
    }

    return id;
  };

  const handleDelete = async (id) => {
    try {
      await typeActivityService.deleteById(id);      

      toast.success('Tipo de atividade excluída!');
      router.push('/dashboard/registrations/type-activity');
    } catch (err) {
      console.error(err.message + '. ' + err.detail);
      toast.error(err.message + '. ' + err.detail);
    }
  };

  const formik = useFormik({
    initialValues: {
      id: typeActivity?.id || 0,
      name: typeActivity?.name || '',
      submit: null
    },
    validationSchema: Yup.object({
      id: Yup.number(),
      name: Yup.string().required("Nome é obrigatório"),
    }),
    onSubmit: async (values, helpers) => {
      saveTypeActivity(values).then(async (id) => {
        helpers.setStatus({ success: true });
        helpers.setSubmitting(false);

        toast.success('Tipo de atividade salva!');
        router.push('/dashboard/registrations/type-activity');
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
        <CardHeader title="Tipos de atividades" />
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
                id="nameTypeActivity"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                required
                value={formik.values.name}
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
            href="/dashboard/registrations/type-activity"
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
        title={t('Excluir tipo de atividade')}
        description={t('Deseja realmente excluir este tipo de atividade?')}
        cancelButton={t('Cancelar')}
        okButton={t('Excluir')}
        onSubmitOk={() => { handleDelete(openDialogDelete); setOpenDialogDelete(0); }}
        onSubmitCancel={() => {setOpenDialogDelete(0)}}
        open={openDialogDelete != 0}
      />
    </form>
  );
};

TypeActivityEditForm.propTypes = {
    typeActivity: PropTypes.object.isRequired
};