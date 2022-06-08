import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { Field, Form, Formik } from 'formik';
import LoadingButton from '@mui/lab/LoadingButton';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import { Link as RouterLink, Location, Navigate, useLocation, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { useState } from 'react';
import Alert from '@mui/material/Alert';

import { TextField } from '@components/TextField';
import { CheckboxWithLabel } from '@components/Checkbox';
import { hashPassword } from '@utils/hashPassword';
import { useAccount } from '@containers/AccountProvider';
import { client } from '../../graphql/graphql-request-client';
import type { Error, APIErrorResponse } from '../../types/common';

import { useAuthenticateMutation } from './authenticate.generated';

type LocationState = {
  from: Location;
};

const normalizeErrorMessage = (errors: Error[]) => {
  const error = errors.length ? errors[0] : null;

  if (error?.extensions.exception.code === 'UserNotFound') {
    return 'User not found. Try again or click "Sign Up" to register new account';
  }
  if (error?.extensions.exception.code === 'IncorrectPassword') {
    return 'Wrong password. Try again or click "Forgot password" to reset it';
  }

  return 'Unexpected error';
};

const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Please enter a valid email address')
    .required('This field is required'),
  password: Yup.string().required('This field is required')
});

const Login = () => {
  const { mutate } = useAuthenticateMutation(client);
  const [submitErrorMessage, setSubmitErrorMessage] = useState<string>();
  const { setAccessToken, account } = useAccount();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as LocationState)?.from?.pathname || '/';
  if (account) {
    return <Navigate to="/" />;
  }

  return (
    <Container component="main" maxWidth="xs">
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 8 }}>
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Login to your shop
        </Typography>
      </Box>
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
                  normalizeErrorMessage((error as APIErrorResponse).response.errors)
                ),
              onSuccess: (data) => {
                data.authenticate?.tokens?.accessToken &&
                  setAccessToken(data.authenticate.tokens.accessToken);
                navigate(from, { replace: true });
              }
            }
          );
        }}
        validationSchema={LoginSchema}
        initialValues={{
          email: '',
          password: '',
          remember: false
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
                autoFocus
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
              <Field
                component={CheckboxWithLabel}
                type="checkbox"
                color="primary"
                name="remember"
                labelProps={{ label: 'Remember me' }}
              />
              {submitErrorMessage && <Alert severity="error">{submitErrorMessage}</Alert>}

              <LoadingButton
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                type="submit"
                loading={isSubmitting}>
                Sign In
              </LoadingButton>
              <Grid container>
                <Grid item xs>
                  <Link component={RouterLink} to="#" variant="body2">
                    Forgot password?
                  </Link>
                </Grid>
                <Grid item>
                  <Link component={RouterLink} to="#" variant="body2">
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

export default Login;
