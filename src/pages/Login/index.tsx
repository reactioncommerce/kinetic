import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import Typography from '@mui/material/Typography'
import { Field, Form, Formik } from 'formik'
import LoadingButton from '@mui/lab/LoadingButton'
import Grid from '@mui/material/Grid'
import Link from '@mui/material/Link'
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import Alert from '@mui/material/Alert'

import { TextField } from '@components/TextField'
import { hashPassword } from '@utils/hashPassword'
import { useAccount } from '@containers/AccountProvider'
import { client } from '../../graphql/graphql-request-client'
import type { Error, GraphQLErrorResponse } from '../../types/common'
import { UserSchema } from '@utils/validate'
import { useAuthenticateMutation } from '../../graphql/generates'

const normalizeErrorMessage = (errors: Error[]) => {
  const error = errors.length ? errors[0] : null

  if (error?.extensions.exception.code === 'UserNotFound') {
    return 'User not found. Try again or click "Sign Up" to register new account'
  }
  if (error?.extensions.exception.code === 'IncorrectPassword') {
    return 'Wrong password. Try again or click "Forgot password" to reset it'
  }

  return error?.message
}

type LocationState = {
  from?: Location
  showResetPasswordSuccessMsg?: boolean
}

const Login = () => {
  const { mutate } = useAuthenticateMutation(client)
  const [submitErrorMessage, setSubmitErrorMessage] = useState<string>()
  const { setAccessToken } = useAccount()
  const navigate = useNavigate()
  const location = useLocation()
  const locationState = location.state as LocationState | null
  const from = locationState?.from?.pathname || '/'

  return (
    <Container component="main" maxWidth="xs">
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 8 }}>
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Login to your shop
        </Typography>
        {locationState?.showResetPasswordSuccessMsg && (
          <Alert severity="success">Your password was reset. You can log in using your new password.</Alert>
        )}
      </Box>
      <Formik
        onSubmit={(values, { setSubmitting }) => {
          mutate(
            {
              serviceName: 'password',
              params: { user: { email: values.email }, password: hashPassword(values.password) },
            },
            {
              onSettled: () => setSubmitting(false),
              onError: error =>
                setSubmitErrorMessage(normalizeErrorMessage((error as GraphQLErrorResponse).response.errors)),
              onSuccess: data => {
                data.authenticate?.tokens?.accessToken && setAccessToken(data.authenticate.tokens.accessToken)
                navigate(from, { replace: true })
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
                Sign In
              </LoadingButton>
              <Grid container>
                <Grid item xs>
                  <Link component={RouterLink} to="/password-reset/new" variant="body2">
                    Forgot password?
                  </Link>
                </Grid>
                <Grid item>
                  <Link component={RouterLink} to="/signup" variant="body2">
                    Don't have an account? Sign Up
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

export default Login
