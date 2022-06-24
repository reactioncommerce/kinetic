import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Avatar from '@mui/material/Avatar'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import Typography from '@mui/material/Typography'
import { Field, Form, Formik } from 'formik'
import Alert from '@mui/material/Alert'
import LoadingButton from '@mui/lab/LoadingButton'
import Grid from '@mui/material/Grid'
import Link from '@mui/material/Link'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { useState } from 'react'

import { TextField } from '@components/TextField'
import { UserSchema } from '@utils/validate'
import { client } from '../../graphql/graphql-request-client'
import { hashPassword } from '@utils/hashPassword'
import type { GraphQLErrorResponse, Error } from '../../types/common'
import { useAccount } from '@containers/AccountProvider'
import { useCreateUserMutation } from '../../graphql/generates'

const normalizeErrorMessage = (errors: Error[]) => {
  const error = errors.length ? errors[0] : null

  if (error?.extensions.exception.code === 'EmailAlreadyExists') {
    return 'This email already exists. Try another.'
  }

  return error?.message
}

const SignUp = () => {
  const [submitErrorMessage, setSubmitErrorMessage] = useState<string>()
  const { mutate } = useCreateUserMutation(client)
  const { setAccessToken } = useAccount()
  const navigate = useNavigate()

  return (
    <Container component="main" maxWidth="xs">
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 8 }}>
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Create an account
        </Typography>
      </Box>
      <Formik
        onSubmit={(values, { setSubmitting }) => {
          mutate(
            {
              user: {
                email: values.email,
                password: hashPassword(values.password),
              },
            },
            {
              onSettled: () => setSubmitting(false),
              onError: error => {
                setSubmitErrorMessage(normalizeErrorMessage((error as GraphQLErrorResponse).response.errors))
              },
              onSuccess: data => {
                const accessToken = data.createUser?.loginResult?.tokens?.accessToken
                accessToken && setAccessToken(accessToken)
                navigate('/new-shop')
              },
            }
          )
        }}
        validationSchema={UserSchema}
        initialValues={{
          email: '',
          password: '',
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

              <LoadingButton fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} type="submit" loading={isSubmitting}>
                Sign Up
              </LoadingButton>
              <Grid container justifyContent="flex-end">
                <Grid item>
                  <Link component={RouterLink} to="/login" variant="body2">
                    Already have an account? Sign in
                  </Link>
                </Grid>
              </Grid>
            </Box>
          )
        }}
      </Formik>
    </Container>
  )
}

export default SignUp
