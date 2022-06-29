import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Field, Form, Formik, FormikConfig } from 'formik';
import Alert from '@mui/material/Alert';
import LoadingButton from '@mui/lab/LoadingButton';
import { useState } from 'react';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';

import { TextField } from '@components/TextField';
import { client } from '../../graphql/graphql-request-client';
import type { GraphQLErrorResponse, Error } from '../../types/common';
import { useShop } from '@containers/ShopProvider';
import { useAccount } from '@containers/AccountProvider';
import { useCreateShopMutation } from '../../graphql/generates';
import { FullHeightLayout } from '@containers/Layouts';
import { AppLogo } from '@components/AppLogo';

const ShopSchema = Yup.object().shape({
  name: Yup.string().required('This field is required').trim()
});

const normalizeErrorMessage = (errors: Error[]) => {
  const error = errors.length ? errors[0] : null;
  if (error?.extensions.code === 'FORBIDDEN') {
    return "You don't have permission to create a shop. Please contact the administrator to invite you to a shop.";
  }
  if (error?.extensions.code === 'INTERNAL_SERVER_ERROR') {
    return 'This shop name already exists. Try another. ';
  }
  return error?.message;
};

const CreateShop = () => {
  const [submitErrorMessage, setSubmitErrorMessage] = useState<string>();
  const { mutate } = useCreateShopMutation(client);
  const navigate = useNavigate();
  const { setShopId, shopId } = useShop();
  const { refetchAccount, removeAccessToken } = useAccount();

  const handleClickSignIn = () => {
    removeAccessToken();
    navigate('/login', { replace: true });
  };

  const handleSubmit: FormikConfig<{ name: string }>['onSubmit'] = (values, { setSubmitting }) => {
    mutate(
      {
        input: { name: values.name.trimEnd() }
      },
      {
        onSettled: () => setSubmitting(false),
        onError: (error) => {
          setSubmitErrorMessage(
            normalizeErrorMessage((error as GraphQLErrorResponse).response.errors)
          );
        },
        onSuccess: (data) => {
          setShopId(data.createShop.shop._id);
          refetchAccount();
          navigate('/', { replace: true });
        }
      }
    );
  };

  return (
    <FullHeightLayout>
      <AppLogo theme="dark" sx={{ mb: '50px' }} />
      <Typography component="h1" variant="h4" fontWeight={600} gutterBottom>
        Set up you shop
      </Typography>
      <Typography variant="body1" gutterBottom color="grey.700">
        Don't worry, you can always change this later.
      </Typography>
      <Formik
        onSubmit={handleSubmit}
        validationSchema={ShopSchema}
        initialValues={{
          name: ''
        }}>
        {({ isSubmitting }) => (
          <Box component={Form} sx={{ mt: 1, width: '50%' }}>
            <Field
              component={TextField}
              label="Shop Name"
              name="name"
              placeholder="Enter shop name"
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
            {!shopId ? (
              <Grid container justifyContent="flex-end">
                <Grid item>
                  <Link
                    component="button"
                    onClick={handleClickSignIn}
                    variant="body2"
                    underline="none">
                    Sign in to another account
                  </Link>
                </Grid>
              </Grid>
            ) : null}
          </Box>
        )}
      </Formik>
    </FullHeightLayout>
  );
};

export default CreateShop;
