import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Field, Form, Formik, FormikConfig } from "formik";
import Alert from "@mui/material/Alert";
import LoadingButton from "@mui/lab/LoadingButton";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useState } from "react";

import { TextField } from "@components/TextField";
import { UserSchema } from "@utils/validate";
import { client } from "@graphql/graphql-request-client";
import { hashPassword } from "@utils/hashPassword";
import type { GraphQLErrorResponse, Error } from "types/common";
import { useAccount } from "@containers/AccountProvider";
import { useCreateUserMutation } from "@graphql/generates";
import { AppLogo } from "@components/AppLogo";
import { PasswordField } from "@components/PasswordField";
import { FullHeightLayout } from "@containers/Layouts";

const normalizeErrorMessage = (errors: Error[]) => {
  const error = errors.length ? errors[0] : null;

  if (error?.extensions.exception.code === "EmailAlreadyExists") {
    return "This email already exists. Try another.";
  }

  return error?.message;
};

const SignUp = () => {
  const [submitErrorMessage, setSubmitErrorMessage] = useState<string>();
  const { mutate } = useCreateUserMutation(client);
  const { setAccessToken } = useAccount();
  const navigate = useNavigate();

  const handleSubmit: FormikConfig<{ email: string; password: string }>["onSubmit"] = (values, { setSubmitting }) => {
    mutate(
      {
        user: {
          email: values.email,
          password: hashPassword(values.password)
        }
      },
      {
        onSettled: () => setSubmitting(false),
        onError: error => {
          setSubmitErrorMessage(normalizeErrorMessage((error as GraphQLErrorResponse).response.errors));
        },
        onSuccess: data => {
          const accessToken = data.createUser?.loginResult?.tokens?.accessToken;
          accessToken && setAccessToken(accessToken);
          navigate("/new-shop");
        }
      }
    );
  };

  return (
    <FullHeightLayout maxWidth="xs">
      <AppLogo theme="dark" sx={{ mb: "50px" }} />
      <Typography component="h1" variant="h4" gutterBottom>
        Create an account
      </Typography>
      <Typography variant="body1" gutterBottom color="grey.700">
        You need an account to create your first shop.
      </Typography>
      <Formik
        onSubmit={handleSubmit}
        validationSchema={UserSchema}
        initialValues={{
          email: "",
          password: ""
        }}
      >
        {({ isSubmitting }) => (
          <Box component={Form} sx={{ mt: 1 }}>
            <Field
              component={TextField}
              label="Email"
              placeholder="Enter your email address"
              name="email"
              autoComplete="email"
            />
            <Field component={PasswordField} name="password" label="Password" placeholder="Enter your password" />

            {submitErrorMessage && <Alert severity="error">{submitErrorMessage}</Alert>}

            <LoadingButton fullWidth variant="contained" size="large" sx={{ mt: 3, mb: 2 }} type="submit" loading={isSubmitting}>
              Continue
            </LoadingButton>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link component={RouterLink} to="/login" variant="body2" underline="none">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        )}
      </Formik>
    </FullHeightLayout>
  );
};

export default SignUp;
