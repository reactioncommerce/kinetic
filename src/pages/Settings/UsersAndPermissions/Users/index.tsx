import { useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import Stack from "@mui/material/Stack";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { noop, startCase } from "lodash-es";

import { Table, TableAction, TableContainer, useTableState } from "@components/Table";
import { User } from "types/user";
import { useGetGroupsQuery, useGetUsersQuery } from "@graphql/generates";
import { client } from "@graphql/graphql-request-client";
import { filterNodes } from "@utils/common";
import { Group } from "types/group";
import { MenuActions } from "@components/MenuActions";
import { useShop } from "@containers/ShopProvider";


const Users = () => {
  const { pagination, handlePaginationChange } = useTableState();

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


  const { data: { users = [], totalCount } = {}, isLoading } = useGetUsersQuery(
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


  return (
    <TableContainer>
      <TableContainer.Header
        title="Users"
        action={<TableAction>Invite</TableAction>}
      />
      <Table
        columns={columns}
        data={users}
        loading={isLoading || isGroupsLoading}
        tableState={{ pagination }}
        onPaginationChange={handlePaginationChange}
        totalCount={totalCount}
        emptyPlaceholder={
          <Stack alignItems="center" gap={2}>
            <AdminPanelSettingsOutlinedIcon sx={{ color: "grey.500", fontSize: "42px" }} />
            <div>
              <Typography variant="h6" gutterBottom>No Users</Typography>
              <Typography variant="body2" color="grey.600">Invite the first user.</Typography>
            </div>
            <Button variant="contained" size="small" sx={{ width: "120px" }}>
              Invite
            </Button>
          </Stack>}
      />
    </TableContainer>
  );
};

export default Users;
