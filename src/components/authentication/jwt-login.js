import { useRouter } from 'next/router';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { Box, Button, FormHelperText, TextField } from '@mui/material';
import { useAuth } from '../../hooks/use-auth';
import { useMounted } from '../../hooks/use-mounted';
import toast from 'react-hot-toast';
import GoogleLogin from 'react-google-login';

export const JWTLogin = (props) => {
  const isMounted = useMounted();
  const router = useRouter();
  const { login, loginGoogle } = useAuth();

  const responseGoogle = async (response) => {
    try {
      const gapi = window.gapi;
      const token = gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().id_token;
      const email = gapi.auth2.getAuthInstance().currentUser.get().getBasicProfile().getEmail();
      const idUser = gapi.auth2.getAuthInstance().currentUser.get().getBasicProfile().getId();

      await loginGoogle(email, token, response.code, idUser);

      const returnUrl = router.query.returnUrl || '/dashboard';
      router.push(returnUrl);
    } catch (err) {
      console.error(err);
      toast.error('O e-mail ou a senha estão incorretos.');
    }
  };

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      submit: null
    },
    validationSchema: Yup.object({
      email: Yup
        .string()
        .email('Deve ser um e-mail válido')
        .max(255)
        .required('E-mail é obrigatório'),
      password: Yup
        .string()
        .max(255)
        .required('Senha é obrigatória')
    }),
    onSubmit: async (values, helpers) => {
      try {
        await login(values.email, values.password);

        if (isMounted()) {
          const returnUrl = router.query.returnUrl || '/dashboard';
          router.push(returnUrl);
        }
      } catch (err) {
        console.error(err);
        toast.error('O e-mail ou a senha estão incorretos.');

        if (isMounted()) {
          helpers.setStatus({ success: false });
          helpers.setErrors({ submit: err.message });
          helpers.setSubmitting(false);
        }
      }
    }
  });

  return (
    <form
      noValidate
      onSubmit={formik.handleSubmit}
      {...props}>
      <TextField
        autoFocus
        error={Boolean(formik.touched.email && formik.errors.email)}
        fullWidth
        helperText={formik.touched.email && formik.errors.email}
        label="E-mail"
        margin="normal"
        name="email"
        onBlur={formik.handleBlur}
        onChange={formik.handleChange}
        type="email"
        value={formik.values.email}
      />
      <TextField
        error={Boolean(formik.touched.password && formik.errors.password)}
        fullWidth
        helperText={formik.touched.password && formik.errors.password}
        label="Senha"
        margin="normal"
        name="password"
        onBlur={formik.handleBlur}
        onChange={formik.handleChange}
        type="password"
        value={formik.values.password}
      />
      {formik.errors.submit && (
        <Box sx={{ mt: 3 }}>
          <FormHelperText error>
            {formik.errors.submit}
          </FormHelperText>
        </Box>
      )}
      <Box sx={{ mt: 2 }}>
        <Button
          disabled={formik.isSubmitting}
          fullWidth
          size="large"
          type="submit"
          variant="contained"
        >
          Log In
        </Button>
      </Box>
      <Box sx={{ mt: 2 }}>
        <GoogleLogin 
          clientId="950320189492-8qfnoipb04a5j5p1bu50lu35smehcvac.apps.googleusercontent.com"
          buttonText="Login com Google"
          accessType="offline"
          responseType='code'
          prompt='consent'
          scope="https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/calendar.app.created https://www.googleapis.com/auth/calendar.calendarlist.readonly https://www.googleapis.com/auth/calendar.events.freebusy https://www.googleapis.com/auth/calendar.events.public.readonly https://www.googleapis.com/auth/calendar.settings.readonly https://www.googleapis.com/auth/calendar.freebusy https://www.googleapis.com/auth/iam.test https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.acls https://www.googleapis.com/auth/calendar.acls.readonly https://www.googleapis.com/auth/calendar.readonly https://www.googleapis.com/auth/calendar.calendarlist https://www.googleapis.com/auth/calendar.calendars https://www.googleapis.com/auth/calendar.calendars.readonly https://www.googleapis.com/auth/calendar.events.owned https://www.googleapis.com/auth/calendar.events.owned.readonly https://www.googleapis.com/auth/calendar.events.readonly https://www.googleapis.com/auth/service.management https://www.googleapis.com/auth/service.management.readonly"
          onSuccess={responseGoogle}
          onFailure={responseGoogle}
        />
      </Box>
    </form>
  );
};
