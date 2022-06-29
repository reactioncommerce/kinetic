import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { Field, Form, Formik, FormikConfig } from 'formik';
import LoadingButton from '@mui/lab/LoadingButton';
import Link from '@mui/material/Link';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Alert from '@mui/material/Alert';

import { TextField } from '@components/TextField';
import { hashPassword } from '@utils/hashPassword';
import { useAccount } from '@containers/AccountProvider';
import { client } from '../../graphql/graphql-request-client';
import type { Error, GraphQLErrorResponse } from '../../types/common';
import { UserSchema } from '@utils/validate';
import { PasswordField } from '@components/PasswordField';
import { useAuthenticateMutation } from '../../graphql/generates';
import { AppLogo } from '@components/AppLogo';

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

type LocationState = {
  from?: Location;
  showResetPasswordSuccessMsg?: boolean;
};

const Login = () => {
  const { mutate } = useAuthenticateMutation(client);
  const [submitErrorMessage, setSubmitErrorMessage] = useState<string>();
  const { setAccessToken } = useAccount();
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = location.state as LocationState | null;
  const from = locationState?.from?.pathname || '/';

  const handleSubmit: FormikConfig<{ email: string; password: string }>['onSubmit'] = (
    values,
    { setSubmitting }
  ) => {
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
  };

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
        <AppLogo theme="light" />
        <Box sx={{ display: 'flex', gap: '20px', flexDirection: 'column' }}>
          <Box
            sx={{
              backgroundColor: 'primary.main',
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
        {locationState?.showResetPasswordSuccessMsg && (
          <Alert severity="success">
            Your password was reset. You can log in using your new password.
          </Alert>
        )}
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
          <Link component={RouterLink} to="/signup" variant="subtitle2" underline="none">
            Create your first shop
          </Link>
        </Typography>
        <Formik
          onSubmit={handleSubmit}
          validationSchema={UserSchema}
          initialValues={{
            email: '',
            password: ''
          }}>
          {({ isSubmitting }) => {
            return (
              <Box
                component={Form}
                sx={{
                  mt: 1,
                  width: '50%',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 3
                }}>
                <Field
                  component={TextField}
                  label="Email"
                  placeholder="Enter your email address"
                  name="email"
                  autoComplete="email"
                />
                <Box sx={{ position: 'relative' }}>
                  <Link
                    component={RouterLink}
                    to="/password-reset/new"
                    variant="subtitle2"
                    underline="none"
                    sx={{ position: 'absolute', top: 0, right: 0, zIndex: 1 }}>
                    Forgot password?
                  </Link>
                  <Field
                    component={PasswordField}
                    name="password"
                    label="Password"
                    placeholder="Enter your password"
                    margin="none"
                  />
                </Box>

                {submitErrorMessage && <Alert severity="error">{submitErrorMessage}</Alert>}

                <LoadingButton
                  fullWidth
                  variant="contained"
                  sx={{
                    color: 'white'
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
