import { useMemo, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import Stack from "@mui/material/Stack";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { Field, Form, Formik, FormikConfig } from "formik";
import LoadingButton from "@mui/lab/LoadingButton";
import { startCase } from "lodash-es";
import * as Yup from "yup";

import { Table, TableAction, TableContainer, useTableState } from "@components/Table";
import { User } from "types/user";
import { useGetGroupsQuery, useGetUsersQuery, useInviteUserMutation } from "@graphql/generates";
import { client } from "@graphql/graphql-request-client";
import { filterNodes } from "@utils/common";
import { Group } from "types/group";
import { MenuActions } from "@components/MenuActions";
import { Drawer } from "@components/Drawer";
import { useShop } from "@containers/ShopProvider";
import { TextField } from "@components/TextField";
import { CardRadio, RadioGroup } from "@components/RadioField";
import { Toast } from "@components/Toast";


type UserFormValues = {
  name: string
  email: string
  groupId: string
  shopId: string
};

const userSchema = Yup.object().shape({
  name: Yup.string().required("This field is required"),
  email: Yup.string().email("Email is invalid").required("This field is required")
});

const Users = () => {
  const [open, setOpen] = useState(false);
  const [openToast, showToast] = useState(false);

  const { pagination, handlePaginationChange } = useTableState();
  const [activeRow, setActiveRow] = useState<User>();

  const { shopId } = useShop();
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
      accessorKey: "groups",
      header: "Groups",
      cell: (info) => {
        const groups = info.getValue<Group[]>();
        if (groups.length === 0) return "--";
        return <Typography variant="body2">{groups[0].name}</Typography>;
      }
    },
    {
      id: "actions",
      cell: () => <MenuActions options={[{ label: "Send Password Reset", onClick: () => { console.log("aa"); } }]}/>,
      header: "",
      meta: {
        align: "right"
      }
    }
  ], []);

  const groupsData = useGetGroupsQuery(client, { shopId: shopId! }, {
    select: (response) => ({
      groups: filterNodes(response.groups?.nodes),
      totalCount: response.groups?.totalCount
    })
  });


  const { data, isLoading, refetch } = useGetUsersQuery(
    client, { first: pagination.pageSize, offset: pagination.pageIndex * pagination.pageSize, groupIds: groupsData.data?.groups.map(({ _id }) => _id) },
    {
      keepPreviousData: true,
      enabled: !groupsData.isLoading
    }
  );

  const users = filterNodes(data?.accounts.nodes).map((user) => ({ ...user, groups: filterNodes<Group>(user.groups?.nodes) }));


  const { mutate: inviteUser } = useInviteUserMutation(client);

  const handleClose = () => {
    setOpen(false);
    setActiveRow(undefined);
  };

  const onSuccess = () => {
    handleClose();
    refetch();
  };

  const handleSubmit: FormikConfig<UserFormValues>["onSubmit"] = (
    values,
    { setSubmitting }
  ) => {
    inviteUser({ input: values }, {
      onSettled: () => setSubmitting(false),
      onSuccess: () => {
        onSuccess();
        showToast(true);
      }
    });
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
        loading={isLoading || groupsData.isLoading}
        tableState={{ pagination }}
        onPaginationChange={handlePaginationChange}
        // onRowClick={handleRowClick}
        totalCount={data?.accounts.totalCount}
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
          initialValues={
            {
              name: "",
              email: "",
              groupId: groupsData.data?.groups[0]?._id ?? "",
              shopId: shopId!
            }
          }
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
                />
                <Field
                  component={TextField}
                  name="email"
                  label="Email Address"
                />
                {groupsData.data?.totalCount ?
                  <Stack mt={2}>
                    <Field name="groupId" label="Groups" component={RadioGroup}>
                      <Stack gap={2}>
                        {groupsData.data.groups.map((group) =>
                          <CardRadio
                            value={group._id}
                            key={group._id}
                            selected={values.groupId === group._id}
                            title={startCase(group.name)}
                            description={group.description}
                          />)}
                      </Stack>
                    </Field>
                  </Stack>
                  : null
                }
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
                      Send Invite
                    </LoadingButton>
                  </Stack>
                }
              />
            </Stack>
          )}
        </Formik>
      </Drawer>
      <Toast open={openToast} handleClose={() => showToast(false)} message="Invite user successfully"/>
    </TableContainer>
  );
};

export default Users;
