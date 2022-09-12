import { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";

import { Table, TableContainer, useTableState } from "@components/Table";
import { useShop } from "@containers/ShopProvider";
import { useGetEmailLogsQuery } from "@graphql/generates";
import { client } from "@graphql/graphql-request-client";
import { EmailLog } from "types/email";
import { filterNodes, formatDateTime } from "@utils/common";

const EmailLogs = () => {
  const { shopId } = useShop();
  const { pagination, handlePaginationChange } = useTableState();

  const { data, isLoading } = useGetEmailLogsQuery(
    client,
    { shopIds: [shopId!], first: pagination.pageSize, offset: pagination.pageIndex * pagination.pageSize }
  );

  const columns = useMemo((): ColumnDef<EmailLog>[] => [
    {
      accessorFn: (row) => row.data.to,
      header: "To"
    },
    {
      accessorKey: "updated",
      header: "Sent",
      cell: (row) => <Typography variant="body2" noWrap>{formatDateTime(new Date(row.getValue()))}</Typography>
    },
    {
      accessorFn: (row) => row.data.subject,
      header: "Subject"
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: (row) => (
        <Chip
          color={row.getValue() === "completed" ? "success" : "warning"}
          size="small"
          label={row.getValue() === "completed" ? "SENT" : "FAILED"}
        />
      ),
      meta: {
        align: "right"
      }
    }
  ], []);

  return (
    <TableContainer>
      <TableContainer.Header
        title="Email Logs"
      />
      <Table
        columns={columns}
        data={filterNodes(data?.emailJobs?.nodes)}
        loading={isLoading}
        tableState={{ pagination }}
        onPaginationChange={handlePaginationChange}
        totalCount={data?.emailJobs?.totalCount}
        maxHeight={600}
      />
    </TableContainer>
  );
};

export default EmailLogs;
