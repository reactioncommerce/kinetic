import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { Field, Form, Formik } from 'formik';
import LoadingButton from '@mui/lab/LoadingButton';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import { Link as RouterLink } from 'react-router-dom';
import { useState } from 'react';
import Alert from '@mui/material/Alert';
import * as Yup from 'yup';

import { TextField } from '@components/TextField';
import { client } from '../../graphql/graphql-request-client';
import type { Error, GraphQLErrorResponse } from '../../types/common';
import { useSendResetPasswordEmailMutation } from '../../graphql/generates';

const PasswordResetSchema = Yup.object().shape({
  email: Yup.string().email('Please enter a valid email address').required('This field is required')
});

const normalizeErrorMessage = (errors: Error[]) => {
  const error = errors.length ? errors[0] : null;

  if (error?.extensions.exception.code === 'UserNotFound') {
    return 'User not found. Try again or click "Sign Up" to register new account';
  }

  return error?.message;
};

const PasswordReset = () => {
  const { mutate, isSuccess } = useSendResetPasswordEmailMutation(client);
  const [submitErrorMessage, setSubmitErrorMessage] = useState<string>();

  return (
    <Container component="main" maxWidth="xs">
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 8 }}>
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5" gutterBottom>
          Forgot your password?
        </Typography>
        <Typography variant="body2">
          Enter your email and we'll send you a password reset link.
        </Typography>
      </Box>
      <Formik
        onSubmit={(values, { setSubmitting }) => {
          mutate(
            {
              email: values.email
            },
            {
              onSettled: () => setSubmitting(false),
              onError: (error) =>
                setSubmitErrorMessage(
                  normalizeErrorMessage((error as GraphQLErrorResponse).response.errors)
                )
            }
          );
        }}
        validationSchema={PasswordResetSchema}
        initialValues={{
          email: ''
        }}>
        {({ isSubmitting, status }) => {
          return (
            <Box component={Form} sx={{ mt: 1 }}>
              <Field
                component={TextField}
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
              />

              {submitErrorMessage && <Alert severity="error">{submitErrorMessage}</Alert>}
              {isSuccess && (
                <Alert severity="success">
                  A link to reset your password has been emailed to you.
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
                  <Link component={RouterLink} to="/login" variant="body2">
                    Return to login
                  </Link>
                </Grid>
                <Grid item>
                  <Link component={RouterLink} to="/signup" variant="body2">
                    Don't have an account? Sign Up
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

export default PasswordReset;
