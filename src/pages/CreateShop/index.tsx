import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Avatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography'
import { Field, Form, Formik } from 'formik'
import Alert from '@mui/material/Alert'
import LoadingButton from '@mui/lab/LoadingButton'
import { useState } from 'react'
import StorefrontIcon from '@mui/icons-material/Storefront'
import * as Yup from 'yup'
import { useNavigate } from 'react-router-dom'
import Grid from '@mui/material/Grid'
import Link from '@mui/material/Link'

import { TextField } from '@components/TextField'
import { client } from '../../graphql/graphql-request-client'
import type { GraphQLErrorResponse, Error } from '../../types/common'
import { useShop } from '@containers/ShopProvider'
import { useAccount } from '@containers/AccountProvider'
import { useCreateShopMutation } from '../../graphql/generates'

export const ShopSchema = Yup.object().shape({
  name: Yup.string().required('This field is required').trim(),
})

const normalizeErrorMessage = (errors: Error[]) => {
  const error = errors.length ? errors[0] : null
  if (error?.extensions.code === 'FORBIDDEN') {
    return "You don't have permission to create a shop. Please contact the administrator to invite you to a shop."
  }
  if (error?.extensions.code === 'INTERNAL_SERVER_ERROR') {
    return 'This shop name already exists. Try another. '
  }
  return error?.message
}

const CreateShop = () => {
  const [submitErrorMessage, setSubmitErrorMessage] = useState<string>()
  const { mutate } = useCreateShopMutation(client)
  const navigate = useNavigate()
  const { setShopId, shopId } = useShop()
  const { refetchAccount, removeAccessToken } = useAccount()

  const handleClickSignIn = () => {
    removeAccessToken()
    navigate('/login', { replace: true })
  }

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
              input: { name: values.name.trimEnd() },
            },
            {
              onSettled: () => setSubmitting(false),
              onError: error => {
                setSubmitErrorMessage(normalizeErrorMessage((error as GraphQLErrorResponse).response.errors))
              },
              onSuccess: data => {
                setShopId(data.createShop.shop._id)
                refetchAccount()
                navigate('/', { replace: true })
              },
            }
          )
        }}
        validationSchema={ShopSchema}
        initialValues={{
          name: '',
        }}
      >
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

              <LoadingButton fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} type="submit" loading={isSubmitting}>
                Create
              </LoadingButton>
              {!shopId ? (
                <Grid container justifyContent="flex-end">
                  <Grid item>
                    <Link component="button" onClick={handleClickSignIn} variant="body2">
                      Sign in to another account
                    </Link>
                  </Grid>
                </Grid>
              ) : null}
            </Box>
          )
        }}
      </Formik>
    </Container>
  )
}

export default CreateShop
