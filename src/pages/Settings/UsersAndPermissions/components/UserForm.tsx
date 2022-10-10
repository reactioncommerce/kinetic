import { Field, Form, Formik, FormikConfig } from "formik";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import * as Yup from "yup";
import Button from "@mui/material/Button";
import LoadingButton from "@mui/lab/LoadingButton";
import { useState } from "react";
import Alert from "@mui/material/Alert";
import { startCase } from "lodash-es";
import Box from "@mui/material/Box";

import { Drawer } from "@components/Drawer";
import { User } from "types/user";
import { TextField } from "@components/TextField";
import { useAccount } from "@containers/AccountProvider";
import { useShop } from "@containers/ShopProvider";
import { CardRadio, RadioGroup } from "@components/RadioField";
import { useGetGroupsQuery,
  useInviteUserMutation,
  useUpdateGroupsForAccountsMutation,
  useUpdateUserMutation } from "@graphql/generates";
import { client } from "@graphql/graphql-request-client";
import { filterNodes } from "@utils/common";
import { GraphQLErrorResponse } from "types/common";
import { CheckboxWithLabel } from "@components/Checkbox";
import { useToast } from "@containers/ToastProvider";

type UserFormValues = {
  name: string
  email: string
  groupId: string
  shopId: string
  shouldGetAdminUIAccess?: boolean
};

const userSchema = Yup.object().shape({
  email: Yup.string().email("Email is invalid").required("This field is required")
});


type UserFormProps = {
  open: boolean
  onClose: () => void
  data?: User,
  onSuccess: () => void
}

export const UserForm = ({ onClose, open, data, onSuccess }: UserFormProps) => {
  const { account } = useAccount();
  const { shopId } = useShop();
  const [errorMessage, setErrorMessage] = useState<string>();

  const toast = useToast();

  const { data: groupsData } = useGetGroupsQuery(client, { shopId: shopId! });
  const { mutateAsync: updateUser } = useUpdateUserMutation(client);
  const { mutate: inviteUser } = useInviteUserMutation(client);
  const { mutateAsync: updateUserGroup } = useUpdateGroupsForAccountsMutation(client);

  const groups = filterNodes(groupsData?.groups?.nodes);

  const isLoggedInUser = account?._id === data?._id;
  const initialValues: UserFormValues = {
    name: data?.name || "",
    email: data?.primaryEmailAddress || "",
    groupId: (data?.group?._id || groups[0]?._id) ?? "",
    shopId: shopId!,
    shouldGetAdminUIAccess: data?.adminUIShops?.some(({ _id }) => _id === shopId) ?? true
  };

  const handleClose = () => {
    onClose();
    setErrorMessage(undefined);
  };

  const _onSuccess = (message: string) => {
    handleClose();
    onSuccess();
    toast.success(message);
  };

  const onError = (error: unknown) => {
    const { errors } = (error as GraphQLErrorResponse).response;
    setErrorMessage(errors[0].message);
  };


  const handleSubmit: FormikConfig<UserFormValues>["onSubmit"] = async (
    values,
    { setSubmitting }
  ) => {
    if (data) {
      try {
        await Promise.all([
          ...(isLoggedInUser ? [updateUser({ input: { name: values.name } })] : []),
          ...(!isLoggedInUser ?
            [updateUserGroup({
              input: {
                groupIds: [values.groupId],
                accountIds: [data._id]
              }
            })] : [])
        ]);

        _onSuccess("Update user successfully");
      } catch (error) {
        onError(error);
      } finally {
        setSubmitting(false);
      }
    } else {
      inviteUser({ input: values }, {
        onSettled: () => setSubmitting(false),
        onSuccess: () => _onSuccess("Invite user successfully"),
        onError
      });
    }
  };


  return (
    <>
      <Drawer
        open={open}
        onClose={handleClose}
        title={data ? "Edit User" : "Invite User"}
      >
        <Formik<UserFormValues>
          onSubmit={handleSubmit}
          initialValues={initialValues}
          validationSchema={userSchema}
        >
          {({ isSubmitting, values, dirty }) => (
            <Stack component={Form} flex={1}>
              <Drawer.Content>
                {!data ?
                  <Typography
                    variant="body2"
                    sx={{ color: "grey.700" }}
                    gutterBottom
                  >
                  Send an invitation to add a member of your team to your shop and select a group that matches what you’d like them to be able to do in Kinetic.
                  </Typography> : null}
                <Field
                  component={TextField}
                  name="name"
                  label="Name"
                  placeholder="Enter user name"
                  disabled={data && !isLoggedInUser}
                />
                <Field
                  component={TextField}
                  name="email"
                  label="Email Address"
                  placeholder="Enter email address"
                  disabled={!!data}
                />
                <Box ml={-1.5}>
                  {/* Should always allow admin access when inviting a new user to a shop. Otherwise, they can not access the admin interface. */}
                  <Field
                    name="shouldGetAdminUIAccess"
                    component={CheckboxWithLabel}
                    type="checkbox"
                    labelProps={{ label: "Allow access to admin UI" }}
                    disabled
                  />
                </Box>

                {groupsData?.groups?.totalCount ?
                  <Stack mt={2}>
                    <Field name="groupId" label="Groups" component={RadioGroup}>
                      <Stack gap={2}>
                        {groups.map((group) =>
                          <CardRadio
                            value={group._id}
                            key={group._id}
                            selected={values.groupId === group._id}
                            title={startCase(group.name)}
                            disabled={isLoggedInUser}
                            description={group.description}
                          />)}
                      </Stack>
                    </Field>
                  </Stack>
                  : null
                }
                {errorMessage ? <Alert severity="error" sx={{ mt: 2 }}>{errorMessage}</Alert> : null}

              </Drawer.Content>
              <Drawer.Actions
                right={
                  <Stack direction="row" gap={1}>
                    <Button
                      size="small"
                      variant="outlined"
                      color="secondary"
                      disabled={isSubmitting}
                      onClick={handleClose}
                    >
                      Cancel
                    </Button>
                    <LoadingButton
                      size="small"
                      variant="contained"
                      type="submit"
                      loading={isSubmitting}
                      disabled={!dirty}
                    >
                      {data ? "Save Changes" : "Send Invite"}
                    </LoadingButton>
                  </Stack>
                }
              />
            </Stack>
          )}
        </Formik>
      </Drawer>
    </>
  );
};
