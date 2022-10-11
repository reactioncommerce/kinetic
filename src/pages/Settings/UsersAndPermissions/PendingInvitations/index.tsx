import { useMemo, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import Stack from "@mui/material/Stack";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { startCase } from "lodash-es";

import { Table, TableAction, TableContainer, useTableState } from "@components/Table";
import { PendingInvitation, User } from "types/user";
import { useGetPendingInvitationsQuery } from "@graphql/generates";
import { client } from "@graphql/graphql-request-client";
import { filterNodes } from "@utils/common";
import { Group } from "types/group";
import { useShop } from "@containers/ShopProvider";
import { UserForm } from "../components/UserForm";
import { usePermission } from "@components/PermissionGuard";


const PendingInvitations = () => {
  const [open, setOpen] = useState(false);

  const { pagination, handlePaginationChange } = useTableState();

  const { shopId } = useShop();


  const columns = useMemo((): ColumnDef<PendingInvitation>[] => [
    {
      accessorKey: "email",
      header: "Email"
    },
    {
      accessorKey: "invitedBy",
      header: "Invited By",
      cell: (info) => info.getValue<User>().primaryEmailAddress
    },
    {
      accessorKey: "group",
      header: "Group",
      cell: (info) =>
        startCase(info.getValue<Group>().name)
    }
  ], []);


  const { data: { invitations = [], totalCount } = {}, isLoading, refetch } = useGetPendingInvitationsQuery(
    client, { first: pagination.pageSize, offset: pagination.pageIndex * pagination.pageSize, shopIds: [shopId!] },
    {
      keepPreviousData: true,
      select: (response) => {
        const validPendingInvitation: PendingInvitation[] =
        filterNodes(response?.invitations.nodes)
          .map((invitation) => ({
            ...invitation,
            group: invitation.groups[0]
          }));
        return { invitations: validPendingInvitation, totalCount: response.invitations.totalCount };
      }
    }
  );

  const canInviteUser = usePermission(["accounts/invite:group"]);

  return (
    <TableContainer>
      <TableContainer.Header
        title="Pending Invitations"
        action={
          canInviteUser ? <TableAction onClick={() => setOpen(true)}>Invite</TableAction> : undefined}
      />
      <Table
        columns={columns}
        data={invitations}
        loading={isLoading}
        tableState={{ pagination }}
        onPaginationChange={handlePaginationChange}
        totalCount={totalCount}
        emptyPlaceholder={
          <Stack alignItems="center" gap={2}>
            <AdminPanelSettingsOutlinedIcon sx={{ color: "grey.500", fontSize: "42px" }} />
            <div>
              <Typography variant="h6" gutterBottom>No Pending Invitations</Typography>
              <Typography variant="body2" color="grey.600">Invite the first user.</Typography>
            </div>
            {canInviteUser ?
              <Button variant="contained" size="small" sx={{ width: "120px" }} onClick={() => setOpen(true)}>
              Invite
              </Button> : null}
          </Stack>}
      />
      <UserForm
        open={open}
        onClose={() => setOpen(false)}
        onSuccess={refetch}
      />
    </TableContainer>
  );
};

export default PendingInvitations;
