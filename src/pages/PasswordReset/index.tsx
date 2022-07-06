import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Field, Form, Formik, FormikConfig } from "formik";
import LoadingButton from "@mui/lab/LoadingButton";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import { Link as RouterLink } from "react-router-dom";
import { useState } from "react";
import Alert from "@mui/material/Alert";
import * as Yup from "yup";

import { TextField } from "@components/TextField";
import { client } from "../../graphql/graphql-request-client";
import type { Error, GraphQLErrorResponse } from "../../types/common";
import { useSendResetPasswordEmailMutation } from "../../graphql/generates";
import { FullHeightLayout } from "@containers/Layouts";
import { AppLogo } from "@components/AppLogo";

const PasswordResetSchema = Yup.object().shape({
  email: Yup.string().email("Please enter a valid email address").required("This field is required")
});

const normalizeErrorMessage = (errors: Error[]) => {
  const error = errors.length ? errors[0] : null;

  if (error?.extensions.exception.code === "UserNotFound") {
    return 'User not found. Try again or click "Sign Up" to register new account';
  }

  return error?.message;
};

const PasswordReset = () => {
  const { mutate, isSuccess } = useSendResetPasswordEmailMutation(client);
  const [submitErrorMessage, setSubmitErrorMessage] = useState<string>();

  const handleSubmit: FormikConfig<{ email: string }>["onSubmit"] = (values, { setSubmitting }) => {
    mutate(
      {
        email: values.email
      },
      {
        onSettled: () => setSubmitting(false),
        onError: (error) => setSubmitErrorMessage(normalizeErrorMessage((error as GraphQLErrorResponse).response.errors))
      }
    );
  };

  return (
    <FullHeightLayout>
      <AppLogo theme="dark" sx={{ mb: "50px" }} />
      <Typography component="h1" variant="h4" fontWeight={600} gutterBottom>
        Forgot your password?
      </Typography>
      <Typography variant="body1" gutterBottom color="grey.700">
        Enter your email and we'll send you a password reset link.
      </Typography>
      <Formik
        onSubmit={handleSubmit}
        validationSchema={PasswordResetSchema}
        initialValues={{
          email: ""
        }}
      >
        {({ isSubmitting }) => (
          <Box component={Form} sx={{ mt: 1, width: "50%" }}>
            <Field
              component={TextField}
              label="Email"
              name="email"
              autoComplete="email"
              placeholder="Enter your email address"
            />

            {submitErrorMessage && <Alert severity="error">{submitErrorMessage}</Alert>}
            {isSuccess && (
              <Alert severity="success">If you have an account we will email you a reset password link.</Alert>
            )}
            <LoadingButton fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} type="submit" loading={isSubmitting}>
              Reset Password
            </LoadingButton>
            <Grid container>
              <Grid item xs>
                <Link component={RouterLink} to="/login" variant="body2" underline="none">
                  Return to login
                </Link>
              </Grid>
              <Grid item>
                <Link component={RouterLink} to="/signup" variant="body2" underline="none">
                  Don't have an account? Sign Up
                </Link>
              </Grid>
            </Grid>
          </Box>
        )}
      </Formik>
    </FullHeightLayout>
  );
};

export default PasswordReset;
