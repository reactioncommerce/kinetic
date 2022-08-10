import { useMemo, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import Stack from "@mui/material/Stack";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { Field, Form, Formik, FormikConfig } from "formik";
import LoadingButton from "@mui/lab/LoadingButton";
import { noop, startCase } from "lodash-es";
import * as Yup from "yup";
import { Alert } from "@mui/material";

import { Table, TableAction, TableContainer, useTableState } from "@components/Table";
import { User } from "types/user";
import { useGetGroupsQuery, useGetUsersQuery, useInviteUserMutation, useUpdateGroupsForAccountsMutation, useUpdateUserMutation } from "@graphql/generates";
import { client } from "@graphql/graphql-request-client";
import { filterNodes } from "@utils/common";
import { Group } from "types/group";
import { MenuActions } from "@components/MenuActions";
import { Drawer } from "@components/Drawer";
import { useShop } from "@containers/ShopProvider";
import { TextField } from "@components/TextField";
import { CardRadio, RadioGroup } from "@components/RadioField";
import { Toast } from "@components/Toast";
import { GraphQLErrorResponse } from "types/common";
import { useAccount } from "@containers/AccountProvider";


type UserFormValues = {
  name: string
  email: string
  groupId: string
  shopId: string
};

const userSchema = Yup.object().shape({
  email: Yup.string().email("Email is invalid").required("This field is required")
});


const Users = () => {
  const [open, setOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string>();
  const [errorMessage, setErrorMessage] = useState<string>();

  const { pagination, handlePaginationChange } = useTableState();
  const [activeRow, setActiveRow] = useState<User>();

  const { shopId } = useShop();
  const { account } = useAccount();

  const { data: groupsData, isLoading: isGroupsLoading } = useGetGroupsQuery(client, { shopId: shopId! }, {
    select: (response) => {
      const validGroups = filterNodes(response.groups?.nodes);
      return {
        groups: validGroups,
        totalCount: response.groups?.totalCount,
        groupIds: validGroups.map(({ _id }) => _id)
      };
    }
  });

  const columns = useMemo((): ColumnDef<User>[] => [
    {
      accessorKey: "name",
      header: "Name",
      cell: (info) => info.getValue() ?? "--"
    },
    {
      accessorKey: "primaryEmailAddress",
      header: "Email"
    },
    {
      accessorKey: "group",
      header: "Group",
      cell: (info) =>
        <Typography variant="body2">
          {startCase(info.getValue<Group>().name)}
        </Typography>
    },
    {
      id: "actions",
      cell: () => <MenuActions options={[{ label: "Send Password Reset", onClick: noop }]}/>,
      header: "",
      meta: {
        align: "right"
      }
    }
  ], []);


  const { data: { users = [], totalCount } = {}, isLoading, refetch } = useGetUsersQuery(
    client, { first: pagination.pageSize, offset: pagination.pageIndex * pagination.pageSize, groupIds: groupsData?.groupIds },
    {
      keepPreviousData: true,
      enabled: !isGroupsLoading,
      select: (response) => {
        const validUsers: User[] =
        filterNodes(response?.accounts.nodes)
          .map((user) => ({
            ...user,
            // The accounts API returns all groups of an account, we need to filter valid group that exists in current active shop
            group: filterNodes(user.groups?.nodes)
              .find((group) => (group._id ? groupsData?.groupIds.includes(group._id) : false))
              ?? groupsData?.groups[0]
          }));
        return { users: validUsers, totalCount: response.accounts.totalCount };
      }
    }
  );

  const { mutate: inviteUser } = useInviteUserMutation(client);
  const { mutateAsync: updateUserGroup } = useUpdateGroupsForAccountsMutation(client);
  const { mutateAsync: updateUser } = useUpdateUserMutation(client);

  const handleClose = () => {
    setOpen(false);
    setActiveRow(undefined);
    setErrorMessage(undefined);
  };

  const onSuccess = (message: string) => {
    handleClose();
    refetch();
    setToastMessage(message);
  };

  const onError = (error: unknown) => {
    const { errors } = (error as GraphQLErrorResponse).response;
    setErrorMessage(errors[0].message);
  };

  const isLoggedInUser = account?._id === activeRow?._id;

  const handleSubmit: FormikConfig<UserFormValues>["onSubmit"] = async (
    values,
    { setSubmitting }
  ) => {
    if (activeRow) {
      try {
        isLoggedInUser && await updateUser({ input: { name: values.name } });

        !isLoggedInUser &&
      await updateUserGroup({
        input: {
          groupIds: [values.groupId],
          accountIds: [activeRow._id]
        }
      });

        onSuccess("Update user successfully");
      } catch (error) {
        onError(error);
      } finally {
        setSubmitting(false);
      }
    } else {
      inviteUser({ input: values }, {
        onSettled: () => setSubmitting(false),
        onSuccess: () => onSuccess("Invite user successfully"),
        onError
      });
    }
  };

  const handleRowClick = (rowData: User) => {
    setActiveRow(rowData);
    setOpen(true);
  };

  const initialValues: UserFormValues = {
    name: activeRow?.name || "",
    email: activeRow?.primaryEmailAddress || "",
    groupId: (activeRow?.group?._id || groupsData?.groups[0]?._id) ?? "",
    shopId: shopId!
  };


  return (
    <TableContainer>
      <TableContainer.Header
        title="Users"
        action={<TableAction onClick={() => setOpen(true)}>Invite</TableAction>}
      />
      <Table
        columns={columns}
        data={users}
        loading={isLoading || isGroupsLoading}
        tableState={{ pagination }}
        onPaginationChange={handlePaginationChange}
        onRowClick={handleRowClick}
        totalCount={totalCount}
        emptyPlaceholder={
          <Stack alignItems="center" gap={2}>
            <AdminPanelSettingsOutlinedIcon sx={{ color: "grey.500", fontSize: "42px" }} />
            <div>
              <Typography variant="h6" gutterBottom>No Users</Typography>
              <Typography variant="body2" color="grey.600">Invite the first user.</Typography>
            </div>
            <Button variant="contained" size="small" sx={{ width: "120px" }} onClick={() => setOpen(true)}>
              Invite
            </Button>
          </Stack>}
      />

      <Drawer
        open={open}
        onClose={handleClose}
        title={activeRow ? "Edit User" : "Invite User"}
      >
        <Formik<UserFormValues>
          onSubmit={handleSubmit}
          initialValues={initialValues}
          validationSchema={userSchema}
        >
          {({ isSubmitting, values }) => (
            <Stack component={Form} flex={1}>
              <Drawer.Content>
                <Typography
                  variant="body2"
                  sx={{ color: "grey.700" }}
                  gutterBottom
                >
                  Send an invitation to add a member of your team to your shop and select a group that matches what you’d like them to be able to do in Kinetic.
                </Typography>
                <Field
                  component={TextField}
                  name="name"
                  label="Name"
                  placeholder="Enter user name"
                  disabled={activeRow && !isLoggedInUser}
                />
                <Field
                  component={TextField}
                  name="email"
                  label="Email Address"
                  placeholder="Enter email address"
                  disabled={!!activeRow}
                />
                {groupsData?.totalCount ?
                  <Stack mt={2}>
                    <Field name="groupId" label="Groups" component={RadioGroup}>
                      <Stack gap={2}>
                        {groupsData.groups.map((group) =>
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
                    >
                      {activeRow ? "Save Changes" : "Send Invite"}
                    </LoadingButton>
                  </Stack>
                }
              />
            </Stack>
          )}
        </Formik>
      </Drawer>
      <Toast
        open={!!toastMessage}
        handleClose={() => setToastMessage(undefined)}
        message={toastMessage}/>
    </TableContainer>
  );
};

export default Users;
