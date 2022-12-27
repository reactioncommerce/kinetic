import { ColumnDef } from "@tanstack/react-table";
import { useMemo, useState } from "react";
import Stack from "@mui/material/Stack";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import Typography from "@mui/material/Typography";
import { startCase } from "lodash-es";
import * as Yup from "yup";
import { FastField, Field, Form, Formik, FormikConfig } from "formik";
import LoadingButton from "@mui/lab/LoadingButton";
import Button from "@mui/material/Button";

import { Table, TableAction, TableContainer, useTableState } from "@components/Table";
import { useShop } from "@containers/ShopProvider";
import { useCreateGroupMutation, useGetGroupsQuery, useUpdateGroupMutation } from "@graphql/generates";
import { client } from "@graphql/graphql-request-client";
import { filterNodes } from "@utils/common";
import { Group } from "types/group";
import { Drawer } from "@components/Drawer";
import { TextField } from "@components/TextField";
import { useToast } from "@containers/ToastProvider";
import { usePermission } from "@components/PermissionGuard";

import { normalizeRoles, RoleItem, RoleSelectField } from "./RoleSelectField";

type GroupFormValues = {
  name: string
  description?: string
  permissions: Record<string, RoleItem[]>
};

const groupSchema = Yup.object().shape({
  name: Yup.string().required("This field is required")
});

const Groups = () => {
  const [open, setOpen] = useState(false);
  const [activeRow, setActiveRow] = useState<Group>();

  const { pagination, handlePaginationChange } = useTableState();
  const { shopId } = useShop();
  const toast = useToast();

  const { data, isLoading, refetch } = useGetGroupsQuery(client, { shopId: shopId! }, {
    select: (response) => {
      const validGroups = filterNodes(response.groups?.nodes);
      return {
        groups: validGroups,
        totalCount: response.groups?.totalCount
      };
    }
  });

  const { mutate: updateGroup } = useUpdateGroupMutation(client);
  const { mutate: createGroup } = useCreateGroupMutation(client);

  const columns = useMemo((): ColumnDef<Group>[] => [
    {
      accessorKey: "name",
      header: "Name",
      cell: (info) => startCase(info.getValue())
    },
    {
      accessorKey: "description",
      header: "Description"
    }
  ], []);

  const handleClose = () => {
    setOpen(false);
    setActiveRow(undefined);
  };

  const handleSuccess = () => {
    handleClose();
    refetch();
  };

  const handleSubmit: FormikConfig<GroupFormValues>["onSubmit"] = async (
    values,
    { setSubmitting }
  ) => {
    const permissions = Object.values(values.permissions).flat().map(({ name }) => name);

    if (activeRow) {
      updateGroup({ input: { groupId: activeRow._id || "", group: { ...values, permissions }, shopId } }, {
        onSettled: () => setSubmitting(false),
        onSuccess: () => {
          handleSuccess();
          toast.success("Update group successfully.");
        }
      });
    } else {
      createGroup({ input: { shopId: shopId!, group: { ...values, permissions } } }, {
        onSuccess: () => {
          handleSuccess();
          toast.success("Create group successfully.");
        }
      });
    }
  };

  const handleRowClick = (row: Group) => {
    setActiveRow(row);
    setOpen(true);
  };
  const canUpdateGroup = usePermission(["reaction:legacy:groups/update"]);

  return (
    <TableContainer>
      <TableContainer.Header
        title="Groups"
        action={<TableAction onClick={() => setOpen(true)}>Add</TableAction>}
      />
      <Table
        columns={columns}
        data={data?.groups ?? []}
        loading={isLoading}
        tableState={{ pagination }}
        onPaginationChange={handlePaginationChange}
        totalCount={data?.totalCount}
        onRowClick={handleRowClick}
        emptyPlaceholder={
          <Stack alignItems="center" gap={2}>
            <AdminPanelSettingsOutlinedIcon sx={{ color: "grey.500", fontSize: "42px" }} />
            <div>
              <Typography variant="h6" gutterBottom>No Users</Typography>
              <Typography variant="body2" color="grey.600">Invite the first user.</Typography>
            </div>
          </Stack>}
      />
      <Drawer
        open={open}
        onClose={handleClose}
        title={activeRow ? "Edit Group" : "Add Group"}
      >
        <Formik<GroupFormValues>
          onSubmit={handleSubmit}
          initialValues={{
            name: activeRow?.name || "",
            description: activeRow?.description || "",
            permissions: normalizeRoles(filterNodes(activeRow?.permissions))
          }}
          validationSchema={groupSchema}
        >
          {({ isSubmitting, dirty, submitForm }) => (
            <Stack component={Form} flex={1}>
              <Drawer.Content>
                <Typography
                  variant="body2"
                  sx={{ color: "grey.700" }}
                  gutterBottom
                >
                  Control the permissions that are assigned to
                  a specific group. Users then get assigned to groups and have access to the resources via those groups.
                </Typography>
                <Field
                  component={TextField}
                  name="name"
                  label="Name"
                  placeholder="Enter group name"
                />
                <Field
                  component={TextField}
                  name="description"
                  label="Description"
                  placeholder="Enter group description"
                  rows={2}
                  multiline
                />
                <FastField name="permissions" component={RoleSelectField}/>
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
                    {canUpdateGroup ?
                      <LoadingButton
                        size="small"
                        variant="contained"
                        loading={isSubmitting}
                        disabled={!dirty}
                        onClick={submitForm}
                      >
                      Save Changes
                      </LoadingButton> : null}

                  </Stack>
                }
              />
            </Stack>
          )}
        </Formik>
      </Drawer>
    </TableContainer>
  );
};

export default Groups;
