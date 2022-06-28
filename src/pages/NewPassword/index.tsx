import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { Field, Form, Formik } from 'formik';
import LoadingButton from '@mui/lab/LoadingButton';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import { Link as RouterLink, useNavigate, useSearchParams } from 'react-router-dom';
import { useState } from 'react';
import Alert from '@mui/material/Alert';
import * as Yup from 'yup';

import { TextField } from '@components/TextField';
import { client } from '../../graphql/graphql-request-client';
import type { Error, GraphQLErrorResponse } from '../../types/common';
import { useResetPasswordMutation } from '../../graphql/generates';
import { hashPassword } from '@utils/hashPassword';

const PasswordResetSchema = Yup.object().shape({
  newPassword: Yup.string().required('This field is required'),
  confirmPassword: Yup.string().oneOf(
    [Yup.ref('newPassword'), null],
    'Password confirmation does not match. Re-enter your password.'
  )
});

const normalizeErrorMessage = (errors: Error[]) => {
  const error = errors.length ? errors[0] : null;
  if (error?.extensions.exception.code === 'InvalidToken') {
    return 'Reset token has expired.';
  }
  return error?.message;
};

const NewPassword = () => {
  const { mutate } = useResetPasswordMutation(client);
  const [submitErrorMessage, setSubmitErrorMessage] = useState<string>();

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  return (
    <Container component="main" maxWidth="xs">
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 8 }}>
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5" gutterBottom>
          Reset Password
        </Typography>
        <Typography variant="body2">Enter a new password for your account.</Typography>
      </Box>
      <Formik
        onSubmit={(values, { setSubmitting }) => {
          mutate(
            {
              newPassword: hashPassword(values.newPassword),
              token: searchParams.get('resetToken') || ''
            },
            {
              onSettled: () => setSubmitting(false),
              onError: (error) =>
                setSubmitErrorMessage(
                  normalizeErrorMessage((error as GraphQLErrorResponse).response.errors)
                ),
              onSuccess: () => {
                navigate('/login', { state: { showResetPasswordSuccessMsg: true } });
              }
            }
          );
        }}
        validationSchema={PasswordResetSchema}
        initialValues={{
          newPassword: '',
          confirmPassword: ''
        }}>
        {({ isSubmitting }) => {
          return (
            <Box component={Form} sx={{ mt: 1 }}>
              <Field
                component={TextField}
                margin="normal"
                required
                fullWidth
                id="password"
                label="New password"
                name="newPassword"
                type="password"
              />
              <Field
                component={TextField}
                margin="normal"
                required
                fullWidth
                id="password"
                label="Confirm new password"
                name="confirmPassword"
                type="password"
              />
              {submitErrorMessage && (
                <Alert
                  severity="error"
                  sx={{ '.MuiAlert-action': { alignItems: 'center' } }}
                  action={
                    <Link
                      component={RouterLink}
                      to="/password-reset/new"
                      variant="body2"
                      color="inherit">
                      Send another link
                    </Link>
                  }>
                  {submitErrorMessage}
                </Alert>
              )}

              <LoadingButton
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                type="submit"
                loading={isSubmitting}>
                Reset Password
              </LoadingButton>
              <Grid container>
                <Grid item xs>
                  <Link component={RouterLink} to="/login" variant="body2" color="primary">
                    Return to login
                  </Link>
                </Grid>
              </Grid>
            </Box>
          );
        }}
      </Formik>
    </Container>
  );
};

export default NewPassword;
