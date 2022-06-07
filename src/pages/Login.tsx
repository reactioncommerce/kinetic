import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { Field, Form, Formik } from 'formik';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import { Link as RouterLink } from 'react-router-dom';
import { TextField } from 'components/TextField';
import { CheckboxWithLabel } from 'components/Checkbox';

const Login = () => {
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
        onSubmit={(values) => {
          console.log({ values });
        }}
        initialValues={{
          email: '',
          password: '',
          remember: false
        }}>
        {({ values, submitForm }) => (
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
            <Button fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} onClick={submitForm}>
              Sign In
            </Button>
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
        )}
      </Formik>
    </Container>
  );
};

export default Login;
