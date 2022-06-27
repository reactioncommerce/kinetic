import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { Field, Form, Formik } from 'formik';
import LoadingButton from '@mui/lab/LoadingButton';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Alert from '@mui/material/Alert';

import { TextField } from '@components/TextField';
import { hashPassword } from '@utils/hashPassword';
import { useAccount } from '@containers/AccountProvider';
import { client } from '../../graphql/graphql-request-client';
import type { Error, GraphQLErrorResponse, LocationState } from '../../types/common';
import { UserSchema } from '@utils/validate';
import { useAuthenticateMutation } from '../../graphql/generates';

const normalizeErrorMessage = (errors: Error[]) => {
  const error = errors.length ? errors[0] : null;

  if (error?.extensions.exception.code === 'UserNotFound') {
    return 'User not found. Try again or click "Sign Up" to register new account';
  }
  if (error?.extensions.exception.code === 'IncorrectPassword') {
    return 'Wrong password. Try again or click "Forgot password" to reset it';
  }

  return error?.message;
};

const Login = () => {
  const { mutate } = useAuthenticateMutation(client);
  const [submitErrorMessage, setSubmitErrorMessage] = useState<string>();
  const { setAccessToken } = useAccount();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as LocationState)?.from?.pathname || '/';

  return (
    <Container component="main" sx={{ display: 'flex' }} maxWidth={false} disableGutters={true}>
      <Box
        sx={{
          width: '50%',
          minHeight: '100vh',
          backgroundColor: 'background.dark',
          padding: '60px 80px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          color: 'white'
        }}>
        <Typography component="h1" variant="h5" fontWeight={500}>
          Open Commerce
        </Typography>
        <Box sx={{ display: 'flex', gap: '20px', flexDirection: 'column' }}>
          <Box
            sx={{
              backgroundColor: 'green',
              borderRadius: '6px',
              padding: '5px',
              textTransform: 'uppercase',
              width: '150px',
              fontSize: '13px',
              fontWeight: 500,
              textAlign: 'center'
            }}>
            New & Improved
          </Box>
          <Typography variant="h3" component="div" fontWeight="bold">
            Meet Kinetic.
          </Typography>
          <Typography variant="body1">
            A new operator experience redesigned from the ground up to power the modern commerce
            operations of ambitious digital teams.
          </Typography>
        </Box>
        <Typography variant="caption" display="block" color="grey.400">
          {`© ${new Date().getFullYear()} Open Commerce. All rights reserved.`}
        </Typography>
      </Box>
      <Box
        sx={{
          display: 'flex',
          minHeight: '100vh',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '50%'
        }}>
        <Typography component="h1" variant="h4" fontWeight={600} gutterBottom>
          Log in to your shop
        </Typography>
        <Typography variant="body2" gutterBottom color="grey.700">
          Don't have a shop?{' '}
          <Link
            component={RouterLink}
            to="/signup"
            variant="subtitle2"
            underline="none"
            color="green">
            Create your first shop
          </Link>
        </Typography>
        <Formik
          onSubmit={(values, { setSubmitting }) => {
            mutate(
              {
                serviceName: 'password',
                params: { user: { email: values.email }, password: hashPassword(values.password) }
              },
              {
                onSettled: () => setSubmitting(false),
                onError: (error) =>
                  setSubmitErrorMessage(
                    normalizeErrorMessage((error as GraphQLErrorResponse).response.errors)
                  ),
                onSuccess: (data) => {
                  data.authenticate?.tokens?.accessToken &&
                    setAccessToken(data.authenticate.tokens.accessToken);
                  navigate(from, { replace: true });
                }
              }
            );
          }}
          validationSchema={UserSchema}
          initialValues={{
            email: '',
            password: ''
          }}>
          {({ isSubmitting }) => {
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
                <Field
                  component={TextField}
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                />
                {submitErrorMessage && <Alert severity="error">{submitErrorMessage}</Alert>}
                <Grid container justifyContent="flex-end">
                  <Grid item>
                    <Link
                      component={RouterLink}
                      to="#"
                      variant="subtitle2"
                      color="green"
                      underline="none">
                      Forgot password?
                    </Link>
                  </Grid>
                </Grid>
                <LoadingButton
                  fullWidth
                  variant="contained"
                  sx={{
                    mt: 2,
                    mb: 2,
                    backgroundColor: 'green',
                    '&:hover': { backgroundColor: 'green' }
                  }}
                  type="submit"
                  loading={isSubmitting}>
                  Sign In
                </LoadingButton>
              </Box>
            );
          }}
        </Formik>
      </Box>
    </Container>
  );
};

export default Login;
