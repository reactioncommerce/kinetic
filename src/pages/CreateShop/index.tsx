import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { Field, Form, Formik } from 'formik';
import Alert from '@mui/material/Alert';
import LoadingButton from '@mui/lab/LoadingButton';
import { useState } from 'react';
import StorefrontIcon from '@mui/icons-material/Storefront';
import * as Yup from 'yup';
import { useNavigate, useLocation } from 'react-router-dom';

import { TextField } from '@components/TextField';
import { client } from '../../graphql/graphql-request-client';
import type { GraphQLErrorResponse, Error, LocationState } from '../../types/common';

import { useCreateShopMutation } from './createShop.generated';

export const ShopSchema = Yup.object().shape({
  name: Yup.string().required('This field is required')
});

const normalizeErrorMessage = (errors: Error[]) => {
  const error = errors.length ? errors[0] : null;

  if (error?.extensions.exception.code === 'EmailAlreadyExists') {
    return 'This email already exists. Try another.';
  }

  return error?.message;
};

const CreateShop = () => {
  const [submitErrorMessage, setSubmitErrorMessage] = useState<string>();
  const { mutate } = useCreateShopMutation(client);
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as LocationState)?.from?.pathname || '/';

  return (
    <Container component="main" maxWidth="xs">
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 8 }}>
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <StorefrontIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Set up your shop
        </Typography>
      </Box>
      <Formik
        onSubmit={(values, { setSubmitting }) => {
          mutate(
            {
              input: { name: values.name }
            },
            {
              onSettled: () => setSubmitting(false),
              onError: (error) => {
                setSubmitErrorMessage(
                  normalizeErrorMessage((error as GraphQLErrorResponse).response.errors)
                );
              },
              onSuccess: (data) => {
                navigate(from, { replace: true });
              }
            }
          );
        }}
        validationSchema={ShopSchema}
        initialValues={{
          name: ''
        }}>
        {({ isSubmitting }) => {
          return (
            <Box component={Form} sx={{ mt: 1 }}>
              <Field
                component={TextField}
                margin="normal"
                required
                fullWidth
                id="name"
                label="Shop Name"
                name="name"
                autoComplete="email"
                autoFocus
              />

              {submitErrorMessage && <Alert severity="error">{submitErrorMessage}</Alert>}

              <LoadingButton
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                type="submit"
                loading={isSubmitting}>
                Create
              </LoadingButton>
            </Box>
          );
        }}
      </Formik>
    </Container>
  );
};

export default CreateShop;
