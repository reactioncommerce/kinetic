import { useCallback, useMemo, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import Stack from "@mui/material/Stack";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { startCase } from "lodash-es";

import { Table, TableAction, TableContainer, useTableState } from "@components/Table";
import { User } from "types/user";
import { useGetGroupsQuery,
  useGetUsersQuery,
  useSendResetPasswordEmailMutation } from "@graphql/generates";
import { client } from "@graphql/graphql-request-client";
import { filterNodes } from "@utils/common";
import { Group } from "types/group";
import { MenuActions } from "@components/MenuActions";
import { useShop } from "@containers/ShopProvider";
import { UserForm } from "../components/UserForm";
import { Toast } from "@components/Toast";

const Users = () => {
  const [open, setOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string>();

  const { pagination, handlePaginationChange } = useTableState();
  const [activeRow, setActiveRow] = useState<User>();

  const { shopId } = useShop();

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

  const { mutate: sendResetEmailPassword } = useSendResetPasswordEmailMutation(client);

  const handleSendResetPasswordEmail = useCallback((email: string) => {
    sendResetEmailPassword({ email }, {
      onSuccess: () => setToastMessage("Reset password email has been sent successfully"),
      onError: () => setToastMessage("Failed to sent reset password email")
    });
  }, [sendResetEmailPassword]);

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
      cell: ({ row }) =>
        <MenuActions
          options={[{
            label: "Send Password Reset",
            onClick: () =>
              handleSendResetPasswordEmail(row.original.primaryEmailAddress)
          }]}
        />,
      header: "",
      meta: {
        align: "right"
      }
    }
  ], [handleSendResetPasswordEmail]);


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

  const handleRowClick = (rowData: User) => {
    setActiveRow(rowData);
    setOpen(true);
  };

  const handleOpen = () => {
    setOpen(true);
    setActiveRow(undefined);
  };

  return (
    <TableContainer>
      <TableContainer.Header
        title="Users"
        action={<TableAction onClick={handleOpen}>Invite</TableAction>}
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
      <UserForm
        open={open}
        onClose={() => setOpen(false)}
        data={activeRow}
        onSuccess={refetch}
      />
      <Toast
        open={!!toastMessage}
        handleClose={() => setToastMessage(undefined)}
        message={toastMessage}
        variant="filled"
      />
    </TableContainer>
  );
};

export default Users;
