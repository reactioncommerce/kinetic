import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Field, Form, Formik, FormikConfig } from "formik";
import LoadingButton from "@mui/lab/LoadingButton";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import { Link as RouterLink, useNavigate, useSearchParams } from "react-router-dom";
import { useState } from "react";
import Alert from "@mui/material/Alert";
import * as Yup from "yup";

import { client } from "@graphql/graphql-request-client";
import type { GraphQLError, GraphQLErrorResponse } from "types/common";
import { useResetPasswordMutation } from "@graphql/generates";
import { hashPassword } from "@utils/hashPassword";
import { FullHeightLayout } from "@containers/Layouts";
import { AppLogo } from "@components/AppLogo";
import { PasswordField } from "@components/PasswordField";

const PasswordResetSchema = Yup.object().shape({
  newPassword: Yup.string().required("This field is required"),
  confirmPassword: Yup.string().oneOf(
    [Yup.ref("newPassword"), null],
    "Password confirmation does not match. Re-enter your password."
  )
});

const normalizeErrorMessage = (errors: GraphQLError[]) => {
  const error = errors.length ? errors[0] : null;
  if (error?.extensions.exception.code === "InvalidToken") {
    return "Reset token has expired.";
  }
  return error?.message;
};

const NewPassword = () => {
  const { mutate } = useResetPasswordMutation(client);
  const [submitErrorMessage, setSubmitErrorMessage] = useState<string>();

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const handleSubmit: FormikConfig<{ newPassword: string; confirmPassword: string }>["onSubmit"] = (
    values,
    { setSubmitting }
  ) => {
    mutate(
      {
        newPassword: hashPassword(values.newPassword),
        token: searchParams.get("resetToken") || ""
      },
      {
        onSettled: () => setSubmitting(false),
        onError: (error) => setSubmitErrorMessage(normalizeErrorMessage((error as GraphQLErrorResponse).response.errors)),
        onSuccess: () => {
          navigate("/login", { state: { showResetPasswordSuccessMsg: true } });
        }
      }
    );
  };

  return (
    <FullHeightLayout maxWidth="xs">
      <AppLogo theme="dark" sx={{ mb: "50px" }} />
      <Typography component="h1" variant="h4" gutterBottom>
        Reset Password
      </Typography>
      <Typography variant="body1" gutterBottom color="grey.700">
        Enter a new password for your account.
      </Typography>
      <Formik
        onSubmit={handleSubmit}
        validationSchema={PasswordResetSchema}
        initialValues={{
          newPassword: "",
          confirmPassword: ""
        }}
      >
        {({ isSubmitting }) => (
          <Box component={Form} sx={{ mt: 1 }}>
            <Field
              component={PasswordField}
              label="New password"
              name="newPassword"
              placeholder="Enter new password"
            />
            <Field
              component={PasswordField}
              label="Confirm new password"
              name="confirmPassword"
              placeholder="Confirm your new password"
            />
            {submitErrorMessage && (
              <Alert
                severity="error"
                sx={{ ".MuiAlert-action": { alignItems: "center" } }}
                action={
                  <Link component={RouterLink} to="/password-reset/new" variant="body2" color="inherit">
                    Send another link
                  </Link>
                }
              >
                {submitErrorMessage}
              </Alert>
            )}

            <LoadingButton fullWidth variant="contained" size="large" sx={{ mt: 3, mb: 2 }} type="submit" loading={isSubmitting}>
              Reset Password
            </LoadingButton>
            <Grid container>
              <Grid item xs>
                <Link
                  component={RouterLink}
                  to="/login"
                  variant="body2"
                  color="primary"
                  underline="none"
                >
                  Return to login
                </Link>
              </Grid>
            </Grid>
          </Box>
        )}
      </Formik>
    </FullHeightLayout>
  );
};

export default NewPassword;
