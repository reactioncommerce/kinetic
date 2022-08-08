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
        return <Typography variant="body2">{startCase(groups[0].name)}</Typography>;
      }
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

  const groupsData = useGetGroupsQuery(client, { shopId: shopId! }, {
    select: (response) => ({
      groups: filterNodes(response.groups?.nodes),
      totalCount: response.groups?.totalCount
    })
  });


  const { data, isLoading } = useGetUsersQuery(
    client, { first: pagination.pageSize, offset: pagination.pageIndex * pagination.pageSize, groupIds: groupsData.data?.groups.map(({ _id }) => _id) },
    {
      keepPreviousData: true,
      enabled: !groupsData.isLoading
    }
  );

  const users = filterNodes(data?.accounts.nodes).map((user) => ({ ...user, groups: filterNodes<Group>(user.groups?.nodes) }));


  return (
    <TableContainer>
      <TableContainer.Header
        title="Users"
        action={<TableAction>Invite</TableAction>}
      />
      <Table
        columns={columns}
        data={users}
        loading={isLoading || groupsData.isLoading}
        tableState={{ pagination }}
        onPaginationChange={handlePaginationChange}
        totalCount={data?.accounts.totalCount}
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
